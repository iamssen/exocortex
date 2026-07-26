# `@iamssen/exocortex` package 축소 분석

## 최종 결론

다음 형태로 축소하는 것을 권장한다.

- `@iamssen/exocortex/date-utils` public subpath 전체 제거
- `@iamssen/exocortex/projector` public subpath 전체 제거
- `model/`의 계산 중간 type과 consumer 전용 type 제거
- Server–Client가 직렬화해 주고받는 domain/API contract는 유지
- `@iamssen/exocortex/server`는 type-only `APIConfig`이므로 유지
- `/finance/quote-history-summary/:symbol` API contract와 관련 함수/type 제거
- `centralBankIds` 같은 provider 구현 detail과 source-data input type은 public package에서 제외

축소판 package는 현재 package의 **strict subset**으로 만든다. 이 조건 때문에 이전 보고서에서 제안했던 `HistoryMatch`의 새 model 경로 추가, 대체 public type 추가, 새 subpath 추가는 하지 않는다. 제거되는 기능은 consumer 내부로 옮기고 package에는 대체 항목을 만들지 않는다.

현재 동작 중인 Server와 Client는 기존 package를 계속 사용한다. 축소판 package와 신규 Client를 먼저 완성하고 기존 Server는 마지막에 축소판으로 올린다. 이 순서는 안전하지만, package version과 실제 Server endpoint의 lifecycle은 별개라는 점에 주의해야 한다. 기존 Client가 삭제 예정 endpoint를 실제 호출한다면 Server endpoint 제거는 해당 호출이 없어질 때까지 미뤄야 한다.

## 축소 원칙

### Strict subset의 의미

현재 package의 public surface를 `P0`, 축소판을 `P1`이라고 하면 다음 조건을 지킨다.

```text
P1 ⊂ P0
```

구체적인 규칙은 다음과 같다.

- 기존에 없던 public export name을 추가하지 않는다.
- 기존에 없던 package subpath를 추가하지 않는다.
- 제거 대상의 replacement public type이나 compatibility alias를 추가하지 않는다.
- 유지하는 model의 import path와 type shape는 변경하지 않는다.
- `APIConfig`에서는 삭제할 endpoint만 빼고 나머지 endpoint contract를 변경하지 않는다.
- source 파일 이동, private helper, test, 검증 script는 public export가 아니므로 필요하면 추가할 수 있다.

이 규칙에는 실용적인 장점도 있다. 축소판으로 작성한 신규 Client는 기존 package가 제공하는 항목만 사용하므로, 축소판에 문제가 생겼을 때 기존 package로 dependency를 되돌리기 쉽다.

### 유지와 제거의 판단 기준

이름에 `Projection`, `Aggregate`, `Joined`가 들어가는지만 보고 판단하면 안 된다.

- 여러 Server와 Client 사이에서 직렬화되는 data shape: 유지
- `APIConfig`의 요청·응답을 구성하는 type: 유지
- 특정 App/Server 안의 계산 과정에서만 생기는 type: 제거 또는 해당 consumer로 이관
- 실행 함수와 date/provider library 의존성: package에서 제거
- editor/source data를 위한 input type: public export에서는 제거

예를 들어 `AggregatedBody`는 aggregate라는 이름이지만 `Body` API payload의 일부이므로 유지한다. 반면 `AggregatedTrade`는 projector의 중간 결과이고 API payload에 포함되지 않으므로 제거한다.

## 사용 현황

`exocortex-use-in-apps.json`과 `exocortex-use-in-server.json`을 집계하면 다음과 같다.

| Import path | Apps: symbol / import 위치 | Server: symbol / import 위치 | 양쪽에서 직접 쓰는 symbol |
| --- | ---: | ---: | ---: |
| `@iamssen/exocortex` | 59 / 204 | 71 / 271 | 39 |
| `@iamssen/exocortex/date-utils` | 3 / 16 | 11 / 14 | 0 |
| `@iamssen/exocortex/projector` | 15 / 25 | 3 / 4 | 2 |
| `@iamssen/exocortex/server` | 1 / 1 | 1 / 1 | 1 |

`importingCount`는 import 위치 수로 해석했다. 서로 다른 App 수나 domain 중요도를 직접 의미하지 않으며, 상위 type을 통해 간접 사용되는 type은 나타나지 않을 수 있다.

### `date-utils`

Apps와 Server가 직접 사용하는 symbol이 하나도 겹치지 않는다.

- Apps: `findStartIndex`, `collapseYears`, `CollapseYearsResult`
- Server: `groupByMonth`, `groupByWeek`, `groupByYear`, 각 `Grouped*` type, `interpolateMonths`, `interpolateWeeks`, `minDate`, `maxDate`, `parseRescuetimeInterval`

공용 package에 유지할 실익보다 각 consumer가 필요한 것만 소유할 때의 격리 효과가 더 크다.

### `projector`

양쪽에서 직접 사용하는 것은 `createSummary`, `joinHoldingsAndQuotes`뿐이다.

- Server에서만 직접 사용: `pickQuoteHistoryRecords`
- 나머지 대부분: Apps에서만 직접 사용

`pickQuoteHistoryRecords`가 제공하는 quote-history-summary API도 제거할 예정이므로 이 함수는 Server로 이관하지 않고 삭제할 수 있다.

### Root model과 `server`

`Iso8601`은 Apps 41곳, Server 52곳에서 사용한다. `QuoteInfo`, `ASC`, `Ratio`, `Quote`, `KRW`, `QuoteRecord`, `Portfolio` 등도 양쪽에서 폭넓게 사용한다. 이 영역이 package에 남겨야 할 핵심이다.

`@iamssen/exocortex/server`는 양쪽에서 `APIConfig` 하나만 import하지만, 이 하나가 전체 route/query/response contract를 묶는다. runtime Server 구현이 아니므로 package 목적에 부합한다.

## 예상 축소 효과

production source 기준 현재 크기는 다음과 같다.

| 영역 | TypeScript LOC |
| --- | ---: |
| `model/` | 1,290 |
| `projector/` | 912 |
| `date-utils/` | 692 |
| `server/` | 240 |

`date-utils/`와 `projector/`를 제거하면 공용 package가 책임지는 production implementation 약 1,604 LOC와 관련 test 유지 비용이 빠진다.

현재 build의 압축 전 `dist/` snapshot은 약 113 KB다. 두 entry와 두 entry 전용 chunk/source map/declaration은 단순 합산 약 84 KB로 전체의 약 74%다. chunk 구성에 따라 달라질 수 있는 근삿값이지만 축소 방향은 분명하다.

두 영역을 제거하면 root package의 유일한 runtime dependency인 `luxon`도 제거할 수 있다.

- `dependencies.luxon` 제거
- `devDependencies.@types/luxon` 제거
- 모든 Server/Client에 같은 date library와 version을 강제하지 않음
- 각 consumer가 자신의 timezone과 format 요구에 맞는 구현을 선택

## Public surface 정리

### 유지할 contract

| 유지 대상 | 이유 |
| --- | --- |
| `ExpiryData`, `VersionData` | 여러 API 응답의 공통 envelope |
| `Quote`, `QuoteHistory`, `QuoteRecord`, `QuoteStatistics` | 유지되는 finance API payload |
| `EquityValueRecord`, `EquityValueHistory` | 별도의 `/finance/equity-value-history/:symbol` API 응답 |
| `Portfolio`와 내부 domain type | 핵심 Portfolio API payload |
| `PortfolioSummary`, `PortfolioSummaries` | `/portfolio-history` API 응답 |
| `Body`와 `AggregatedBody`, `WeeklyBody`, `MonthlyBody` | Body API payload |
| `Moneybook`과 aggregate type | Moneybook API payload |
| `Rescuetime`과 aggregate type | RescueTime API payload |
| `BondsGain`, `DepositsGain` | `Portfolio` 내부 payload |
| `PortfolioMarket`, `QuoteInfoIndex` | `/finance/quotes` 응답 |
| `Watch` | `Portfolio` payload에 포함되는 저장 domain |
| `Iso8601`, 통화, 비율, 정렬 관련 Nominal Type | 공통 값의 의미와 단위 |
| `APIConfig` | N:N Server–Client API contract |

`EquityValueRecord`와 `EquityValueHistory`는 `quote.projection.ts`에 있지만 quote-history-summary와 무관하다. 별도의 유지되는 API 응답이므로 제거하면 안 된다. 내부 source 파일을 나누는 것은 가능하지만 public name이나 import path를 추가해서는 안 된다.

### 제거할 model 항목

| 현재 위치 | 제거/이관 대상 | 현재 직접 사용 |
| --- | --- | --- |
| `model/portfolio/trade.projection.ts` | `JoinedTrade` | Apps |
| `model/portfolio/holding.projection.ts` | `Gain`, `JoinedHolding`, `JoinedHoldings` | Apps/projector |
| `model/portfolio/fx.projection.ts` | `JoinedFX` | Apps/projector |
| `model/portfolio/aggregate.ts` | `AggregatedTrade` | Apps/projector |
| `model/finance/quote.projection.ts` | `JoinedQuoteStatistics`, `JoinedQuoteHistory` | Apps/projector |
| `model/portfolio/portfolio.ts` | `AnalyzedQuoteInfo` | Apps |
| `model/portfolio/watch.ts` | `Match`만 제거하고 `Watch`는 유지 | Apps/projector |
| `model/index.ts` | generic helper `Checked` | Apps |

현재 Apps가 사용하는 항목도 있지만 기존 Apps는 기존 package를 계속 사용한다. 신규 Client에서 필요하면 신규 Client 내부 type으로 정의한다. package에 replacement type을 추가하지 않는다.

다음 항목은 Apps에서만 직접 import되더라도 유지되는 contract에 간접 포함된다.

- `MarketState` → `Quote`
- `Bond` → `Portfolio`
- `QuoteEtfHolding` → `QuoteEtfHoldings`
- `PortfolioMarket` → `QuoteInfoIndex`

직접 사용 위치만 보고 이들을 제거하면 유지할 API payload가 깨진다.

### Public export에서 제거할 input type

다음 type은 수집 자료에서 외부 named import가 없고 `schema/README.md`가 editor/source-data schema의 대응 type으로만 참조한다.

- `KcalInput`
- `BalanceInput`
- `BondInput`
- `DepositInput`
- `FXInput`
- `HousingInput`
- `WatchInput`

권장 처리는 다음과 같다.

1. `model/index.ts`의 export에서 제거
2. source 파일은 `schema/` 문서가 필요로 하면 repository 내부에 유지
3. 필요하면 나중에 실제 data를 읽는 Server repository로 이동

source 파일을 유지하더라도 root barrel에서 export하지 않으면 npm public API와 Rollup entry에는 포함되지 않는다. `model/body/checkup.ts`의 `checkupConst`는 이미 root barrel에서 export되지 않으므로 이번 public surface 변경 대상이 아니다.

### `centralBankIds`

`CentralBank`는 API path contract이지만 `centralBankIds`의 숫자는 특정 외부 provider 연동 detail이다. 현재 public snapshot에는 `centralBankIds` import가 없다.

- `CentralBank`는 동일한 string union 의미로 유지
- `centralBankIds`는 public model에서 제거
- 실제 mapping은 축소판으로 Server를 올릴 때 Server 내부 구현으로 추가

이 변경으로 root `model.js`의 유일한 실질 runtime export도 없앨 수 있다.

## Quote history summary 제거 범위

삭제 예정인 API는 다음 tuple이다.

```ts
API<
  '...',
  '/finance/quote-history-summary/:symbol',
  `finance/quote-history-summary/${string}`,
  VersionData<HistoryMatch<QuoteRecord>[]>,
  { cacheOnly?: boolean }
>
```

package repository에서 제거할 직접 범위는 다음과 같다.

- `server/finance.ts`
  - `HistoryMatch` import
  - 위 `API` tuple
  - 이 tuple 때문에 직접 import하던 `QuoteRecord`
- `contexts/api.yaml`
  - `finance/quote-history-summary/${string}` 항목
- `projector/pickQuoteHistoryRecords.ts`와 전용 test/fixture
- `date-utils/findHistories.ts`
- `date-utils/findHistory.ts`
- `HistoryMatch`

`date-utils/`와 `projector/`를 전체 제거하므로 관련 함수와 test는 결과적으로 함께 삭제된다. `HistoryMatch`를 새 model 위치로 옮기지 않는다. 이것이 축소판의 strict subset 조건에도 맞는다.

다만 다음 type은 유지한다.

- `QuoteRecord`: `QuoteHistory.records`에서도 사용
- `VersionData`: 다른 API에서도 사용
- `EquityValueRecord`, `EquityValueHistory`: 다른 endpoint의 응답

실제 Server repository에서는 package contract 외에도 다음을 검색해 제거해야 한다.

- route handler
- cache file/key와 cache warmer
- scheduler 또는 batch job
- `pickQuoteHistoryRecords` 호출
- API client wrapper
- endpoint 문서와 monitoring

## `date-utils/`와 `projector/`의 consumer 처리

### 신규 Client

신규 Client는 축소판 package에 없는 기능이 필요하면 처음부터 Client 내부에 구현한다.

- `findStartIndex`, `collapseYears` 등은 Client 내부 date/history module에 구현
- `Joined*`, `Gain`, `Match` 등은 해당 화면이나 domain module 내부 type으로 선언
- quote/holding/trade join과 watch 평가는 사용하는 domain에 배치
- `createSummary`가 필요하면 Client 소유 implementation으로 작성

package의 과거 구현을 복사해 시작할 수 있지만 필요한 함수와 test만 가져와야 한다. 별도의 범용 `date-utils` 또는 `projector` package를 다시 만들면 이번 축소의 목적이 약해진다.

### Server

사용 현황상 Server가 축소판으로 올라갈 때 local 구현이 필요한 후보는 다음과 같다.

- date: grouping/interpolation/min/max/RescueTime parsing
- projector: `createSummary`, `joinHoldingsAndQuotes`
- provider mapping: `centralBankIds`

`pickQuoteHistoryRecords`는 endpoint와 함께 삭제하므로 이관하지 않는다.

Server에 복사할 때는 기존 test도 필요한 범위만 함께 옮긴다. 특히 ISO week 경계, timezone, 정렬, 빈 history, 통화 환산과 자산 분류는 회귀 가능성이 높다.

`createSummary`는 약 150 LOC의 통화 환산과 자산 분류 정책을 포함한다. Server가 `PortfolioSummary`의 authoritative producer라면 Server implementation을 기준으로 삼고 신규 Client는 Server 결과를 소비하는 편이 단순하다. 신규 Client가 live quote로 독립 계산해야 할 때만 Client 구현을 별도로 둔다.

## 실행 가능한 migration runbook

아래에서 기존 package를 `V0`, 축소판 package를 `V1`이라고 부른다. 분석 시점의 `package.json` version은 `0.0.14`다.

### Phase 0. V0 baseline 고정

목적은 기존 Server/Client의 운영 상태를 보존하고 V1이 실제 subset인지 비교할 기준을 만드는 것이다.

#### 작업

1. V0의 Git commit과 배포된 package version을 기록하고 tag를 만든다.
2. 기존 Server와 Client가 V0을 계속 설치하도록 exact version 또는 lockfile을 확인한다.
3. V0 source에서 다음 검증을 실행한다.

   ```sh
   npm run type-check
   npm run lint
   npm test
   npm run build
   ```

4. V0의 다음 파일을 비교용 artifact로 보관한다.

   ```text
   package.json
   dist/model.d.ts
   dist/server.d.ts
   dist/date-utils.d.ts
   dist/projector.d.ts
   contexts/api.yaml
   ```

5. Apps와 Server에서 이미 만든 사용 현황 JSON을 removal checklist로 고정한다.
6. 기존 Client가 `finance/quote-history-summary/*`를 실제 호출하는지 code search와 production access log로 확인한다.

#### 완료 조건

- V0를 언제든 다시 설치할 수 있다.
- 기존 workload가 자동으로 V1을 받지 않도록 version range/lockfile이 확인됐다.
- quote-history-summary 호출 Client 목록이 확인됐다.
- V0 build artifact가 V1 subset 검증에 사용 가능하다.

현재 `package.json`은 `0.0.14`지만 `package-lock.json` root metadata는 `0.0.12`다. V1 release 작업에서 version을 올릴 때 lockfile metadata도 함께 맞춰야 한다.

### Phase 1. V1 축소판 package 구현

V1은 Server 배포와 분리해 먼저 만든다. 이 repository에서 다음 순서로 작은 commit을 만드는 것이 좋다.

#### Commit 1. quote-history-summary contract 제거

1. `server/finance.ts`에서 quote-history-summary `API` tuple 제거
2. 사용하지 않게 된 `HistoryMatch`, `QuoteRecord` direct import 제거
3. `npx tsx scripts/gendoc.api.ts`로 `contexts/api.yaml` 재생성
4. `server/__tests__/api.type-check.ts`에 삭제된 path가 key가 아님을 확인하는 type assertion 추가
5. 다음 검색 결과가 0건인지 확인

   ```sh
   rg "quote-history-summary|HistoryMatch" server contexts
   ```

`QuoteRecord` source 자체는 `QuoteHistory`가 사용하므로 삭제하지 않는다.

#### Commit 2. model public export 축소

1. `JoinedTrade`, `Gain`, `JoinedHolding`, `JoinedHoldings`, `JoinedFX`, `AggregatedTrade` 제거
2. `JoinedQuoteStatistics`, `JoinedQuoteHistory` 제거
3. `AnalyzedQuoteInfo`, `Match`, `Checked` 제거
4. input type을 `model/index.ts`에서 export하지 않도록 변경
5. `centralBankIds` 제거, `CentralBank`의 의미가 같은 string union은 유지
6. `EquityValueRecord`, `EquityValueHistory`와 API payload aggregate type이 남아 있는지 확인

이 단계에서는 새 public type이나 새 public path를 만들지 않는다.

#### Commit 3. implementation subpath 제거

1. `package.json`에서 `./date-utils`, `./projector` exports 제거
2. `rollup.config.mjs`의 두 build entry를 JavaScript와 declaration build 양쪽에서 제거
3. `date-utils/`, `projector/` source와 전용 test/fixture 제거
4. `package.json`에서 `luxon`, `@types/luxon` 제거
5. lockfile 갱신
6. `README.md`에서 두 directory와 두 public export 설명 제거
7. repository 전체에서 stale reference 검색

   ```sh
   rg "date-utils|projector|luxon|centralBankIds|HistoryMatch|quote-history-summary" \
     --glob '!docs/todo-reduce-package/**' \
     --glob '!reviews/**'
   ```

검색 결과는 과거 review와 이번 migration 문서를 제외하면 없어야 한다. `schema/README.md`가 input source 파일을 계속 참조한다면 해당 파일은 삭제하지 않는다.

#### Commit 4. V1 검증과 release 준비

1. repository 표준 검증 실행

   ```sh
   npm run type-check
   npm run lint
   npm test
   npm run build
   ```

2. build entry가 root와 server만 남았는지 확인

   ```sh
   find dist -maxdepth 1 -type f | sort
   ```

3. V0와 V1 declaration을 비교한다.
   - V1에 새 export name이 없어야 한다.
   - root에서는 removal checklist의 symbol만 사라져야 한다.
   - `server.d.ts`에서는 quote-history-summary endpoint만 사라져야 한다.
   - 유지되는 API 응답 type의 shape는 같아야 한다.
4. package tarball 목록을 확인한다.

   ```sh
   npm pack --dry-run
   ```

5. `package.json`과 `package-lock.json` version을 함께 갱신한다.

#### Strict subset gate

V1 release 전에 다음 조건을 모두 만족해야 한다.

| 검사 | 성공 조건 |
| --- | --- |
| package subpath | `.`과 `./server`만 존재 |
| 새 root export | 0개 |
| 새 server export | 0개 |
| API 변경 | quote-history-summary 삭제 외 변경 없음 |
| runtime dependency | `luxon` 없음 |
| build artifact | date-utils/projector entry 없음 |
| repository 검증 | type-check, lint, test, build 모두 성공 |

가능하면 V0/V1의 emitted `.d.ts`에서 export name 집합을 추출해 `V1 - V0 = ∅`를 검사하는 작은 CI script를 둔다. 이 script는 package public export가 아니므로 strict subset 조건을 위반하지 않는다.

### Phase 2. V1 prerelease와 신규 Client 완성

삭제가 많은 breaking release이므로 `0.0.15`보다 `0.1.0`처럼 기존 `0.0.x` range와 분리되는 version을 권장한다.

#### 작업

1. V1을 바로 `latest`로 올리지 말고 별도 dist-tag로 배포한다.

   ```sh
   npm publish --tag next
   ```

2. 신규 Client는 exact V1 version을 설치한다.
3. 제거된 utility/projector/type이 필요하면 신규 Client 내부에 구현한다.
4. 다음 검색 결과가 0건인지 확인한다.

   ```sh
   rg "@iamssen/exocortex/(date-utils|projector)" .
   ```

5. 신규 Client의 type-check, lint, test, production build를 실행한다.
6. 아직 V0를 사용하는 현재 Server를 대상으로 integration test를 실행한다.
7. 신규 Client가 quote-history-summary endpoint를 사용하지 않는지 확인한다.

#### 이 조합이 가능한 이유

현재 Server는 V0 contract의 endpoint 전체를 제공하고 신규 Client는 그 부분집합인 V1만 안다. Server가 추가 endpoint를 제공하는 것은 신규 Client에 문제가 되지 않는다. 이 단계에서는 기존 Server나 기존 Client를 변경할 필요가 없다.

#### 완료 조건

- 신규 Client가 V1 exact version으로 build/deploy 가능
- 신규 Client의 removed subpath import가 0건
- V0 Server를 대상으로 모든 integration test 성공
- 신규 Client의 quote-history-summary 호출이 0건

### Phase 3. Server를 V1으로 migration

Server 변경은 별도 branch에서 준비하고 package bump와 함께 검증한다.

#### 작업 순서

1. Server가 V0에서 import하던 date utility를 Server 내부 module로 이관
2. `createSummary`, `joinHoldingsAndQuotes`와 필요한 private type/helper/test를 Server 내부로 이관
3. `centralBankIds` mapping을 provider 연동 module로 이관
4. quote-history-summary의 route, cache, job, client wrapper를 제거
5. `pickQuoteHistoryRecords`는 이관하지 않고 사용 지점 제거
6. package dependency를 exact V1 version으로 변경
7. removed subpath와 removed root type import가 없는지 검색
8. Server의 type-check, lint, test, build 실행
9. V1 신규 Client와 integration test
10. 기존 V0 Client의 주요 API regression test

#### Endpoint 제거 gate

기존 Client는 V0 type을 계속 갖고 있으므로 quote-history-summary를 호출할 수 있다. 다음 중 하나를 선택해야 한다.

- access log와 code search로 호출이 0건임을 확인한 뒤 Server endpoint를 함께 제거
- 호출 여부가 불확실하면 V1 `APIConfig`에서는 먼저 빼되 실제 Server route는 한 번의 배포 동안 compatibility endpoint로 유지하고, 호출이 0건이 된 뒤 다음 배포에서 제거

두 번째 방법도 package strict subset 조건을 위반하지 않는다. package contract에는 endpoint가 없지만 runtime Server가 과도기 동안 추가 endpoint를 제공하는 것은 안전한 방향의 비대칭이다.

#### 완료 조건

- Server의 `@iamssen/exocortex` dependency가 V1 exact version
- removed import가 0건
- 신규 Client와 기존 Client regression test 성공
- endpoint 제거 gate 충족
- Server production 배포와 monitoring 정상

### Phase 4. 안정화

1. Server 배포 후 error rate, API 404, summary 값, cache/job failure를 관찰
2. 문제가 없으면 V1을 기본 dist-tag로 승격
3. 기존 Client는 필요할 때 독립적으로 V1으로 migration
4. 모든 기존 Client migration 전까지 V0 package를 unpublish하지 않음
5. removal checklist와 consumer 사용 현황 JSON을 최종 상태로 갱신

## Rollback

| 장애 지점 | rollback |
| --- | --- |
| 신규 Client + V1 | 신규 Client dependency를 V0 exact version으로 되돌림. V1이 V0의 subset이므로 import 관점에서 안전해야 함 |
| Server V1 migration | 이전 Server artifact와 V0 dependency로 rollback |
| quote-history-summary 제거 | compatibility route를 다시 활성화하거나 endpoint 포함 이전 Server 배포로 rollback |
| package dist-tag | V0 또는 검증된 version으로 dist-tag 복구 |

V0는 이미 배포된 Client가 계속 사용하므로 삭제하거나 덮어쓰지 않는다. package version은 immutable artifact로 취급하고 수정이 필요하면 새 version을 배포한다.

## 최종 목표 public surface

```text
@iamssen/exocortex
├── domain value/type
│   ├── Iso8601, Timestamp, Percent, Ratio
│   ├── KRW, USD, JPY
│   └── ASC, DESC
├── serialized data contract
│   ├── Quote*, Portfolio*, Body, Journal, Moneybook, Rescuetime
│   ├── PortfolioSummary
│   └── EquityValueHistory
└── API envelope
    ├── ExpiryData
    └── VersionData

@iamssen/exocortex/server
└── APIConfig
```

다음은 포함하지 않는다.

- 실행 함수
- date library
- provider ID mapping
- UI용 joined/projection model
- 계산 중간 aggregate model
- source data input type의 public export
- quote-history-summary API와 `HistoryMatch`

따라서 `date-utils/`와 `projector/` 전체 제거는 그대로 진행하는 것이 좋다. `model/`은 공통 API payload가 아닌 계산 중간 type만 제거한다. 축소판을 먼저 신규 Client에 적용하고 Server를 마지막에 올리되, 실제 endpoint 제거는 기존 Client의 호출 여부를 별도 gate로 관리하는 것이 가장 실행 가능하고 안전한 순서다.
