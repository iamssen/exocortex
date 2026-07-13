# exocortex

## 프로젝트 개요

Exocortex는 Server와 Client의 관계가 N:N으로
여러개의 Server들을 만들어서 Reverse Proxy로 결합한다던가,
여러개의 Client들을 만들 수 있다.
기본적인 Model과 Function들을 Node.js Package로 공유하기 위한 프로젝트이다.

## 주요 디렉토리와 파일

- TypeScript 개발 (Development)
  - [model](./model): 핵심 도메인 모델 및 타입 정의
  - [server](./server): REST API 인터페이스 및 서버 설정
  - [projector](./projector): 데이터 변환 및 가공 로직
  - [date-utils](./date-utils): 날짜/시간 처리 유틸리티
- 설정 및 도구 (Configuration & Tooling)
  - [schema](./schema): VSCode 자동완성 및 데이터 검증용 JSON Schema
- 운영 및 자동화 (Operations)
  - [scripts](./scripts): 빌드, 문서 생성 등 내부 자동화 스크립트
- AI 어시스턴트 (AI Assistance)
  - [contexts](./contexts): AI에게 참고시키기 위한 문맥(Context) 자료
  - [reviews](./reviews): AI 코드 리뷰 결과

## 검증

변경 후에는 다음 검사를 실행해서 변경된 코드를 검증한다.

```sh
npm run type-check
npm run lint
npm test
```

## 산출물

```sh
npm run build
```

- `@iamssen/exocortex`: Core Domain Model
- `@iamssen/exocortex/server`: Server API & Config
- `@iamssen/exocortex/projector`: Data Projectors
- `@iamssen/exocortex/date-utils`: Date Utilities

## 리뷰

코드 리뷰를 요청하는 경우 `reviews/code-review-{yyyy-MM-dd}.md` 파일을 작성한다. 리뷰는 변경에 대한 리뷰가 아니라, 이 프로젝트 전반에 대한 리뷰를 의미한다.

1. 프로젝트에 포함된 코드들이 이 프로젝트를 처음 접하는 사람들에게도 이해하기 쉽게 되어있는지 체크한다.
2. 특히 `/model`에 포함된 파일들과 내부 Type들의 네이밍이 이해하기 쉽게 되어있는지 체크한다.
3. 치명적이지 않은 아쉬운 점이나 개선할 점은 하단에 별도로 작성한다. (차후의 TODO로 고려할 수 있도록)
4. 이 프로젝트를 처음 접하는 사람들에게 필요한 가이드를 작성해서 최하단에 추가한다.
5. 문서는 한글로 작성되어야 하고, 한국어 단어로는 이해하기 어려운 기술적 단어들의 경우 영어로 표기한다.
