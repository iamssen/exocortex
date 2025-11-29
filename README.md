# Directories

- TypeScript 개발 (Development)
  - [model](./model): 핵심 도메인 모델 및 타입 정의
  - [server](./server): API 인터페이스 및 서버 설정
  - [projector](./projector): 데이터 변환 및 가공 로직
  - [date-utils](./date-utils): 날짜/시간 처리 유틸리티
- 설정 및 도구 (Configuration & Tooling)
  - [schema](./schema): VSCode 자동완성 및 데이터 검증용 JSON Schema
- 운영 및 자동화 (Operations)
  - [scripts](./scripts): 빌드, 문서 생성 등 내부 자동화 스크립트
- AI 어시스턴트 (AI Assistance)
  - [contexts](./contexts): AI 참고용 문맥(Context) 자료
  - [reviews](./reviews): AI 코드 리뷰 결과
  - [.agent/workflows](./.agent/workflows): AI 작업 지시 워크플로우

# Exports

- `@iamssen/exocortex`: Core Domain Model
- `@iamssen/exocortex/server`: Server API & Config
- `@iamssen/exocortex/projector`: Data Projectors
- `@iamssen/exocortex/date-utils`: Date Utilities
