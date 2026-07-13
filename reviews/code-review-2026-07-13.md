# Project Code Review (2026-07-13)

## 개요

이 문서는 특정 변경분이 아니라 현재 `exocortex` 프로젝트 전반을 검토한 결과다. `model/`의 도메인 타입과 네이밍을 중심으로 `date-utils/`, `projector/`, `server/`, `schema/`, 빌드 및 검증 구성을 함께 확인했다.

## 전체 평가

프로젝트의 중심이 되는 `model/`은 도메인별 분리가 명확하고, `Iso8601`, `KRW`, `USD`, `Percent`, `Ratio` 같은 Nominal Type을 통해 값의 의미를 타입에 보존하려는 방향이 일관된다. `ExpiryData`, `VersionData`, `Joined*`, `Aggregated*`처럼 데이터의 수명과 가공 단계를 드러내는 이름도 이해하기 쉽다.

`date-utils/`는 작은 순수 함수와 단위 테스트로 구성되어 있고, `projector/`는 모델 결합과 계산 로직을 담당하도록 분리되어 있다. `server/`의 tuple 기반 `API` 타입과 type-check test는 API 경로·query·응답 타입의 관계를 compile time에 확인한다. 전반적으로 처음 보는 사람도 데이터가 어디에서 정의되고 어디에서 가공되는지 추적하기 좋은 구조다.

치명적인 결함은 확인하지 못했다. 다만 public type의 장기 호환성과 금액 단위 안정성을 높이기 위해 아래 개선을 권장한다.

## 개선 제안

### 1. `Gain` 계열에 통화 generic을 전파하기

`Holding`, `Bond`, `Deposit`, `Balances`는 `Currency` generic으로 금액의 통화를 표현한다. 반면 `holding.projection.ts`의 `Gain`, `JoinedHolding`, `JoinedHoldings`는 금액 필드를 모두 `number`로 선언하며, 파일에도 generic 추가 TODO가 남아 있다.

이 타입은 USD, JPY, KRW holdings를 모두 표현하는 projector 결과에 사용된다. 따라서 이후 계산 코드에서 다른 통화를 같은 `number`로 더해도 TypeScript가 막지 못한다. `Gain<Currency extends number = number>`, `JoinedHolding<Currency>`, `JoinedHoldings<Currency>`로 전파하고, `JoinedFX` 및 projector 함수의 반환 타입에도 같은 generic을 연결하는 방안을 권장한다.

### 2. `Weather.termperature`의 public API 철자 정리

`model/weather.ts`의 `termperature`는 `temperature`의 철자 오류로 보인다. `Weather`는 `server/utils.ts`의 API 응답 타입이므로 현재 이름이 이미 소비자에게 노출됐을 수 있다.

수정 시에는 바로 rename하기보다 release note를 남기고, 필요하면 올바른 `temperature`를 추가한 뒤 기존 필드를 deprecated 처리하는 migration 정책을 정하는 편이 안전하다.

### 3. `Journal`의 자유 형식 데이터 경계 명확화

`JournalEntry.originData`와 `JSONContent`의 attrs/index signature가 `any`를 사용한다. Tiptap/ProseMirror 구조가 자유 형식인 점은 타당하지만, public model의 `any`는 호출자 쪽으로 타입 검사를 전부 우회시킨다.

JSON으로 직렬화되는 값만 허용하는 것이 목적이라면 `JsonValue`/`JsonObject` 같은 재귀 타입을 도입하거나, 최소한 `unknown`으로 바꾸고 사용 지점에서 좁히는 방안을 고려할 수 있다.

### 4. 금액 계산과 watch 평가의 테스트 확대

`date-utils/`는 다양한 단위 테스트가 있으나, `projector/`의 테스트는 `pickQuoteHistoryRecords`, 채권 이익, 예금 이익에 집중되어 있다. `createSummary`의 통화 환산·구성 비율 계산과 `evaluateWatchConditions`의 high/low·P/E·52주 조건은 사용자 결과에 직접 영향을 주지만 전용 테스트가 없다.

다음 사례부터 고정 fixture로 추가하면 회귀 방지 효과가 크다.

- KRW/USD/JPY 및 stable coin이 함께 있는 `createSummary` 결과
- quote, statistics, history가 각각 없는 경우의 watch 결과
- 임계값과 정확히 같은 가격·P/E·52주 위치에서의 비교 규칙

## 비치명적 TODO

- 루트 README에는 디렉터리와 export 목록은 잘 정리되어 있다. 여기에 설치 방법, 각 export의 짧은 import 예시, 검증 명령을 추가하면 외부 패키지 사용자도 빠르게 시작할 수 있다.
- `evaluateWatchConditions`의 예외 메시지 `Unkown watch`는 `Unknown watch`로 고치면 좋다.
- `schema/README.md`의 대응표는 유용하다. 모델과 저장 형식이 의도적으로 다른 항목은 차이의 이유까지 참고란에 적어두면 다음 변경에서 동기화 판단이 쉬워진다.
- Rollup이 `server`의 empty chunk를 알린다. 현재 `server/`가 type-only export라면 정상 동작이므로, 의도된 결과임을 빌드 문서에 짧게 기록하는 것을 고려할 수 있다.

## 검증 결과

- `npm run type-check` 통과
- `npm run lint` 통과 (baseline-browser-mapping 데이터 갱신 안내 경고만 출력)
- `npm test` 통과: 13개 test file, 15개 test
- `npm run build` 통과 (`server` type-only entry에 대한 empty chunk 안내만 출력)
- `node scripts/verify-checkup-schema.mjs` 통과: 건강검진 YAML 5개

---

## 처음 참여하는 사람을 위한 가이드

이 프로젝트는 여러 Server와 Client가 공유할 도메인 타입 및 계산 도구를 제공하는 Node.js package다. 새로운 기능을 추가할 때는 먼저 `model/`에 데이터의 의미와 단위를 표현하고, 변환 로직은 `projector/`, 날짜 처리는 `date-utils/`, API 계약은 `server/`에 둔다.

금액·비율·날짜에는 가능하면 `KRW`, `USD`, `JPY`, `Percent`, `Ratio`, `Iso8601` 같은 Nominal Type을 사용해 의미를 보존한다. JSON/YAML 입력 데이터를 다룰 때는 `schema/README.md`와 `schema/AGENTS.md`를 함께 확인한다. 코드를 수정한 뒤에는 `npm run type-check`, `npm run lint`, `npm test`를 실행하고, package 산출물을 확인해야 하는 경우 `npm run build`까지 실행한다.
