import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sourceFile = path.join(__dirname, '../server/index.ts');
const outputFile = path.join(__dirname, '../docs/api-list.yaml');

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

function typeToString(type: ts.Type, checker: ts.TypeChecker): string {
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

function getApiPathVariants(type: ts.Type, checker: ts.TypeChecker): string[] {
  return type.isUnion()
    ? type.types.map((t) => typeToString(t, checker))
    : [typeToString(type, checker)];
}

function getPathParameterType(value: string): string | undefined {
  return /^\$\{(.+)\}$/.exec(value)?.[1];
}

// 실제 client path와 router path를 결합해서 parameter의 이름과 타입을 보존한다.
function formatApiPath(
  apiPathType: ts.Type,
  routerPathType: ts.Type,
  checker: ts.TypeChecker,
): string {
  const apiPaths = getApiPathVariants(apiPathType, checker);
  const routerPath = getStringLiteralValue(routerPathType);

  if (!routerPath) {
    return `/${apiPaths.join('|')}`;
  }

  const routerSegments = routerPath.replace(/^\//, '').split('/');
  const apiPathSegments = apiPaths.map((apiPath) =>
    apiPath.replace(/^\//, '').split('/'),
  );

  const segments = apiPathSegments[0].map((_, index) => {
    const values = [
      ...new Set(apiPathSegments.map((apiPath) => apiPath[index])),
    ];
    const routerSegment = routerSegments[index];

    if (!routerSegment?.startsWith(':')) {
      return values.length === 1 ? values[0] : `(${values.join('|')})`;
    }

    const parameterName = routerSegment.slice(1);
    if (values.length > 1) {
      return `{${parameterName}:${values.join('|')}}`;
    }

    const parameterType = getPathParameterType(values[0]);
    return parameterType ? `{${parameterName}:${parameterType}}` : values[0];
  });

  return `/${segments.join('/')}`;
}

function formatTypeWithoutUndefined(
  type: ts.Type,
  checker: ts.TypeChecker,
): string {
  if (!type.isUnion()) {
    return checker.typeToString(type);
  }

  const types = type.types.filter((t) => !(t.flags & ts.TypeFlags.Undefined));

  if (
    types.length === 2 &&
    types.every((t) => t.flags & ts.TypeFlags.BooleanLiteral)
  ) {
    return 'boolean';
  }

  return types.map((t) => checker.typeToString(t)).join('|');
}

function formatQuery(queryType: ts.Type, checker: ts.TypeChecker): string {
  if (
    queryType.flags & ts.TypeFlags.Never ||
    checker.typeToString(queryType) === 'never'
  ) {
    return '';
  }

  const parameters = queryType.getProperties().map((property) => {
    const declaration = property.valueDeclaration ?? property.declarations?.[0];
    if (!declaration) {
      throw new Error(
        `Could not find declaration for query "${property.name}"`,
      );
    }

    const propertyType = checker.getTypeOfSymbolAtLocation(
      property,
      declaration,
    );
    const optional = property.flags & ts.SymbolFlags.Optional ? '?' : '';
    const type = formatTypeWithoutUndefined(propertyType, checker);
    return `${property.name}${optional}:${type}`;
  });

  return parameters.length > 0 ? `?{${parameters.join(',')}}` : '';
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
      ts.Type[] | undefined;

    if (!typeArguments) {
      console.warn('No type arguments found for config type');
      return;
    }

    for (const apiType of typeArguments) {
      // API 타입에서 속성 추출 (예: API<...>)
      // API type에서 route와 문서화할 metadata를 추출합니다.

      const apiPathType = getMemberType(checker, apiType, '__apiPath__');
      const routerPathType = getMemberType(checker, apiType, '__routerPath__');
      const descriptionType = getMemberType(
        checker,
        apiType,
        '__description__',
      );
      const dataType = getMemberType(checker, apiType, '__data__');
      const queryType = getMemberType(checker, apiType, '__query__');

      // 타입을 문자열 값으로 변환
      const cleanApiPath =
        apiPathType && routerPathType
          ? formatApiPath(apiPathType, routerPathType, checker)
          : 'N/A';
      const query = queryType ? formatQuery(queryType, checker) : '';

      const description = descriptionType
        ? getStringLiteralValue(descriptionType)
        : 'N/A';
      const returnType = dataType ? checker.typeToString(dataType) : 'N/A';

      // YAML 항목 생성 시작
      yamlLines.push(
        `  ${JSON.stringify(`GET ${cleanApiPath}${query}`)}:`,
        `    description: ${JSON.stringify(description)}`,
        `    returns: ${JSON.stringify(returnType)}`,
      );
    }
  };

  processConfig(apiConfigType);

  // 5. YAML 파일로 출력
  const yamlContent = [
    'format: "exocortex-http/v1"',
    'types: "@iamssen/exocortex"',
    'syntax: "METHOD /path/{name:type}?{required:type,optional?:type}"',
    'routes:',
    ...yamlLines,
    '',
  ].join('\n');
  fs.writeFileSync(outputFile, yamlContent);
  console.log(`Generated API documentation at ${outputFile}`);
}

generateDoc();
