# Package의 항목을 줄이기

- `@iamssen/exocortex` package는 서버 구현 및 클라이언트 앱들을 N:N으로 구현하기 위한 최소의 공통 도메인을 담고 있어야 함.
- 하지만, 현재 package에는 도메인이 아닌, 비싼 구현 비용을 가진 항목들이 포함되어 있음.
- Agent 코딩을 사용하게 되면서 이 비싼 구현 비용을 가진 항목들을 제거할 필요가 생김 (구현 비용이 대폭 낮아지면서 다소의 중복 코드가 발생하더라도 도메인별 격리가 더 가치있음)
- 기존 서버와 앱에서 이 package가 어떻게 사용되고 있는지를 <./exocortex-use-in-apps.json>과 <./exocortex-use-in-server.json>에 수집했음.
- 위의 정보들을 바탕으로 어떤 항목들을 제거하는게 좋을지 분석해주길 바람.
- 현재 생각은 아래와 같은데, 분석을 통해서 효과적인 방안을 찾아주길 바람
  - `date-utils/` 전체 제거 (각 앱, 서버에서 자체 구현)
  - `projector/` 전체 제거 (각 앱, 서버에서 자체 구현)
  - `model/`에서 projection 이나 aggregate 등 projector와 연관된 항목들을 제거
- 리포트를 현재 디렉토리에 report.md 라는 파일로 만들어주길 바람

# Report에 대한 추가 정보

- 마이그레이션 순서
  1. 현재 동작하고 있는 서버와 클라이언트 앱은 현재 버전의 `@iamssen/exocortex` 패키지를 사용.
  2. 현재 여러 항목들이 제거된 `@iamssen/exocortex`를 만들어서 신규 클라이언트 앱에서 사용. 제거 버전이기 때문에 이전 버전의 완전한 부분 집합이 되어야 함. (추가되는 항목이 있으면 안됨)
  3. 위에서 현재 package와 신규 클라이언트 작업이 끝난 항목들이 제거된 `@iamssen/exocortex`를 업데이트해서 서버를 업데이트.
- `server/finance.ts`의 `/finance/quote-history-summary/:symbol`는 제거 예정. 관련 Model들 역시 제거 가능
