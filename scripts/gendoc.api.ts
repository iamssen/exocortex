import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceFile = path.join(__dirname, '../server/index.ts');
const outputFile = path.join(__dirname, '../contexts/api.yaml');

// 타입 내 속성의 타입을 가져오는 헬퍼 함수
function getMemberType(
  checker: ts.TypeChecker,
  type: ts.Type,
  memberName: string,
): ts.Type | undefined {
  const symbol = type.getProperty(memberName);
  if (!symbol) {
    return undefined;
  }
  return checker.getTypeOfSymbolAtLocation(symbol, symbol.valueDeclaration!);
}

// StringLiteral 타입에서 문자열 값을 추출하는 헬퍼 함수
function getStringLiteralValue(type: ts.Type): string | undefined {
  if (type.isStringLiteral()) {
    return type.value;
  }
  return undefined;
}

// API 경로를 포맷팅하는 헬퍼 함수
function formatApiPath(type: ts.Type, checker: ts.TypeChecker): string {
  // Union 타입 처리
  if (type.isUnion()) {
    const parts = type.types.map((t) => {
      if (t.isStringLiteral()) {
        return t.value;
      }
      // 다른 타입의 경우 문자열 표현을 가져오고 따옴표/백틱 제거
      let str = checker.typeToString(t);
      if (
        (str.startsWith('"') && str.endsWith('"')) ||
        (str.startsWith("'") && str.endsWith("'")) ||
        (str.startsWith('`') && str.endsWith('`'))
      ) {
        str = str.slice(1, -1);
      }
      return str;
    });

    // 공통 접두사 찾기
    if (parts.length === 0) return '';
    const first = parts[0];
    let prefixLen = 0;
    while (prefixLen < first.length) {
      const char = first[prefixLen];
      if (parts.every((p) => p[prefixLen] === char)) {
        prefixLen++;
      } else {
        break;
      }
    }

    let prefix = first.slice(0, Math.max(0, prefixLen));
    let suffixes = parts.map((p) => p.slice(Math.max(0, prefixLen)));

    // 휴리스틱: 디렉토리 구조를 깔끔하게 유지하기 위해 가능한 경우 마지막 슬래시에서 분할
    if (
      prefix.length > 0 &&
      !prefix.endsWith('/') &&
      !suffixes.some((s) => s.startsWith('/'))
    ) {
      const lastSlash = prefix.lastIndexOf('/');
      if (lastSlash !== -1) {
        prefix = prefix.slice(0, Math.max(0, lastSlash + 1));
        suffixes = parts.map((p) => p.slice(prefix.length));
      }
    }

    if (prefix) {
      return `${prefix}(${suffixes.join('|')})`;
    }
    return `(${parts.join('|')})`;
  }

  // 단일 타입 처리 (StringLiteral, TemplateLiteral 등)
  const str = checker.typeToString(type);
  if (
    (str.startsWith('"') && str.endsWith('"')) ||
    (str.startsWith("'") && str.endsWith("'")) ||
    (str.startsWith('`') && str.endsWith('`'))
  ) {
    return str.slice(1, -1);
  }
  return str;
}

function generateDoc() {
  // 1. TypeScript 프로젝트 초기화
  const configPath = ts.findConfigFile(
    __dirname,
    ts.sys.fileExists,
    'tsconfig.json',
  );
  if (!configPath) {
    throw new Error("Could not find a valid 'tsconfig.json'.");
  }

  const configFile = ts.readConfigFile(configPath, ts.sys.readFile);
  const parsedConfig = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    path.dirname(configPath),
  );

  const program = ts.createProgram(
    parsedConfig.fileNames,
    parsedConfig.options,
  );
  const checker = program.getTypeChecker();

  // 2. 진입 파일 위치 찾기
  const indexFile = program.getSourceFile(sourceFile);
  if (!indexFile) {
    throw new Error('Could not find server/index.ts');
  }

  // 3. APIConfig 타입 찾기
  let apiConfigType: ts.Type | undefined;

  ts.forEachChild(indexFile, (node) => {
    if (ts.isTypeAliasDeclaration(node)) {
      if (node.name.text === 'APIConfig') {
        apiConfigType = checker.getTypeAtLocation(node);
      }
    }
  });

  if (!apiConfigType) {
    throw new Error('Could not find APIConfig type');
  }

  // 4. API 메타데이터 추출
  const yamlLines: string[] = [];

  const processConfig = (configType: ts.Type) => {
    // APIConfig는 튜플입니다. 타입 인수에 접근해야 합니다.
    // TS 컴파일러 API에서 튜플 타입은 종종 TypeReference에 'typeArguments' 속성을 가집니다.
    // 기본 Type 인터페이스에 없을 수 있으므로 안전하게 접근하기 위해 any로 캐스팅합니다.
    const typeArguments = (configType as any).typeArguments as
      | ts.Type[]
      | undefined;

    if (!typeArguments) {
      console.warn('No type arguments found for config type');
      return;
    }

    for (const apiType of typeArguments) {
      // API 타입에서 속성 추출 (예: API<...>)
      // 속성은 __apiPath__, __description__, __data__, __query__ 입니다

      const apiPathType = getMemberType(checker, apiType, '__apiPath__');
      const descriptionType = getMemberType(
        checker,
        apiType,
        '__description__',
      );
      const dataType = getMemberType(checker, apiType, '__data__');
      const queryType = getMemberType(checker, apiType, '__query__');

      // 타입을 문자열 값으로 변환
      const cleanApiPath = apiPathType
        ? formatApiPath(apiPathType, checker)
        : 'N/A';

      const description = descriptionType
        ? getStringLiteralValue(descriptionType)
        : 'N/A';
      const returnType = dataType ? checker.typeToString(dataType) : 'N/A';

      // YAML 항목 생성 시작
      yamlLines.push(
        `${JSON.stringify(cleanApiPath)}:`,
        `  description: ${JSON.stringify(description)}`,
        `  return: ${JSON.stringify(returnType)}`,
      );

      // query가 정의되어 있고 'never'가 아닌지 확인
      if (
        queryType &&
        !(
          queryType.flags & ts.TypeFlags.Never ||
          checker.typeToString(queryType) === 'never'
        )
      ) {
        const query = checker.typeToString(queryType);
        yamlLines.push(`  query: ${JSON.stringify(query)}`);
      }
    }
  };

  processConfig(apiConfigType);

  // 5. YAML 파일로 출력
  const yamlContent = yamlLines.join('\n');
  fs.writeFileSync(outputFile, yamlContent);
  console.log(`Generated API documentation at ${outputFile}`);
}

generateDoc();
