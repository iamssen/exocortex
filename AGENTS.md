# exocortex

## 프로젝트 목적

Exocortex는 여러 Server와 Client가 N:N으로 연결되는 환경에서 공통으로 사용하는 TypeScript package다. Server들은 Reverse Proxy 등으로 결합될 수 있고, Client도 여러 개 존재할 수 있다.

이 package의 중심 역할은 구현을 공유하는 것이 아니라 다음 두 가지 contract를 공유하는 것이다.

1. Server와 Client가 직렬화해서 주고받는 최소 공통 domain model
2. route, query, response type을 연결하는 type-only REST API contract

Agent coding으로 각 consumer의 구현 비용이 낮아졌으므로, 적은 코드 중복보다 domain별 격리와 독립적인 변경 가능성을 우선한다.

## Package 경계

### 포함한다

- Server와 Client 사이를 이동하는 serialized data shape
- API request/response를 구성하는 domain type
- 날짜, 통화, 비율처럼 값의 의미를 보존하는 Nominal Type
- API response envelope인 `ExpiryData`, `VersionData`
- N:N API contract를 묶는 `APIConfig`

### 포함하지 않는다

- 특정 App의 view model 또는 계산 중간 type
- join, aggregate, projection, summary 계산 같은 실행 함수
- 범용 date utility와 특정 date library dependency
- 외부 provider의 ID mapping 등 Server 구현 detail
- 특정 source data/editor만을 위한 type의 public export

이름만으로 경계를 판단하지 않는다. 예를 들어 `AggregatedBody`는 aggregate라는 이름이지만 `Body` API payload에 포함되므로 공통 contract다. 반면 UI 계산 과정에서만 쓰는 `Joined*` type은 consumer 내부 구현이다.

새 public 항목을 만들기 전에는 다음을 확인한다.

1. 둘 이상의 독립적인 Server/Client가 같은 serialized shape를 공유하는가?
2. 구현 편의를 위한 재사용이 아니라 통신 contract인가?
3. 해당 항목을 각 consumer에 두면 contract가 실제로 깨지는가?

답이 명확하지 않으면 public model보다 consumer 내부 구현을 우선한다.

## Public entrypoint

현재 package가 제공하는 entrypoint는 두 개다.

| Import path                 | 역할                                 |
| --------------------------- | ------------------------------------ |
| `@iamssen/exocortex`        | Core domain model과 API payload type |
| `@iamssen/exocortex/server` | type-only `APIConfig`                |

`@iamssen/exocortex/date-utils`와 `@iamssen/exocortex/projector`는 의도적으로 제거됐다. 같은 목적의 public subpath나 replacement utility package를 다시 추가하지 않는다.

`server/`는 Server runtime 구현이 아니다. 실제 handler, cache, scheduler, provider client는 각 Server repository가 소유한다.

## 주요 디렉토리와 파일

| 경로                                                                       | 역할                                                                |
| -------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| [`model/`](./model)                                                        | 공통 domain model, Nominal Type, serialized payload                 |
| [`model/index.ts`](./model/index.ts)                                       | `@iamssen/exocortex` public barrel                                  |
| [`server/`](./server)                                                      | REST API의 type-level route/query/response contract                 |
| [`server/index.ts`](./server/index.ts)                                     | `APIConfig` public entry                                            |
| [`docs/api-list.yaml`](./docs/api-list.yaml)                               | Agent가 API를 빠르게 파악하기 위한 generated compact route manifest |
| [`docs/reviews/`](./docs/reviews)                                          | 프로젝트 전체 code review 문서                                      |
| `docs/done/`                                                               | 완료된 일시적 task 문서의 archive                                   |
| [`schema/`](./schema)                                                      | 사람이 작성하는 JSON/YAML의 editor 지원과 검증용 JSON Schema        |
| [`scripts/gendoc.api.ts`](./scripts/gendoc.api.ts)                         | `APIConfig`에서 API 목록 생성                                       |
| [`scripts/verify-checkup-schema.mjs`](./scripts/verify-checkup-schema.mjs) | 건강검진 schema/data 검증                                           |

`schema/`를 변경할 때는 하위 [`schema/AGENTS.md`](./schema/AGENTS.md)의 추가 규칙을 따른다.

`docs/done/`은 완료된 일시적 요청의 기록이며 현재 작업의 instruction이나 context가 아니다. 사용자가 명시적으로 요청하지 않는 한 해당 디렉토리의 파일을 나열하거나 검색하거나 읽지 않는다. 일시적 작업 문서에서 확인된 장기 규칙만 `AGENTS.md`에 남긴다.

## Model 작성 규칙

### Serialized contract를 우선한다

- field name, optional 여부, array ordering, 통화 단위 변경은 API 호환성 변경으로 취급한다.
- 직접 import가 없더라도 다른 public payload에 중첩된 type인지 먼저 확인한다.
- 계산으로 만들어진 결과라도 API가 전송하는 payload면 model에 남긴다.
- consumer 내부에서만 계산되는 결과는 해당 consumer에 둔다.

### 값의 의미를 type에 보존한다

날짜, 통화, 비율에는 가능한 한 기존 Nominal Type을 사용한다.

```ts
Iso8601;
Timestamp;
Percent;
Ratio;
KRW;
USD;
JPY;
ASC<T>;
DESC<T>;
```

서로 다른 통화나 `Percent`/`Ratio`를 일반 `number`로 약화하지 않는다. JSON에서는 Nominal Type을 검증할 수 없으므로 값을 만드는 경계에서 의미와 정렬 조건을 확인한다.

### Public barrel을 작게 유지한다

- `model/index.ts`에는 공통 contract만 export한다.
- schema/source-data용 type은 repository 안에 남길 수 있지만, Server–Client contract가 아니면 root barrel에 export하지 않는다.
- provider constant와 실행 함수는 public barrel에 export하지 않는다.
- 새 export를 추가할 때는 `package.json`, emitted `dist/model.d.ts`, consumer 영향까지 확인한다.

## REST API contract

### Source of truth

API contract의 source of truth는 `server/*.ts`와 `APIConfig`다. 각 API는 `API` generic으로 다음 정보를 연결한다.

```ts
API<Description, RouterPath, ClientPath, Response, Query>;
```

- `Description`: 사람이 이해할 수 있는 endpoint 설명
- `RouterPath`: Server router의 parameter 이름을 포함한 path
- `ClientPath`: Client가 사용하는 concrete/template path
- `Response`: 반환되는 serialized model
- `Query`: query parameter type, 없으면 `never`

현재 모든 endpoint는 `GET`이다. non-GET endpoint를 도입할 때는 문서만 임의로 바꾸지 말고 `API` contract와 generator가 method를 표현하도록 먼저 설계한다.

### Agent용 API 목록

[`docs/api-list.yaml`](./docs/api-list.yaml)은 OpenAPI 대체물이 아니라 Agent가 전체 API를 짧고 명확하게 이해하기 위한 generated 문서다. 직접 수정하지 않는다.

API 또는 generator를 변경한 뒤 다음 명령으로 갱신한다.

```sh
npx tsx scripts/gendoc.api.ts
```

route 표기는 다음 compact syntax를 사용한다.

```text
METHOD /path/{name:type}?{required:type,optional?:type}
```

예:

```yaml
'GET /finance/quote-history/{symbol:string}?{cacheOnly?:boolean}':
  description: 'Quote History'
  returns: 'ExpiryData<QuoteHistory>'
```

규칙:

- HTTP method를 항상 표시한다.
- path parameter는 `${string}` 대신 `{symbol:string}`처럼 의미 있는 이름을 표시한다.
- 제한된 값은 `{benchmark:shiller-pe|sp500-pe}`처럼 표시한다.
- required query는 `longitude:number`, optional query는 `cacheOnly?:boolean`처럼 표시한다.
- 모든 route에 `description`과 `returns`를 포함한다.
- return type 이름은 `@iamssen/exocortex` public model에서 해석할 수 있어야 한다.

`scripts/gendoc.api.ts`는 `RouterPath`에서 parameter 이름을, `ClientPath`에서 실제 path와 허용값을, `Query`에서 optional 여부와 type을 가져온다. 생성 결과를 수동 보정하지 말고 source contract 또는 generator를 수정한다.

API를 추가·변경·제거할 때는 다음을 같은 변경에 포함한다.

1. `server/*.ts`의 `APIConfig` 구성 type
2. 관련 model
3. `docs/api-list.yaml` 재생성 결과
4. `server/__tests__/api.type-check.ts`의 type-level 사용 예 또는 제거 assertion

Package contract에서 endpoint를 제거하는 것과 실제 Server route를 제거하는 것은 별개의 lifecycle이다. 기존 Client가 호출할 수 있다면 code search와 access log로 사용 여부를 확인하거나 compatibility route를 한동안 유지한다.

## 검증

TypeScript 또는 package 구성을 변경한 뒤 기본적으로 다음을 실행한다.

```sh
npm run type-check
npm run lint
npm test
npm run build
```

`server/__tests__/api.type-check.ts`는 runtime test가 아니라 TypeScript compile-time assertion이며 `npm run type-check`로 검증된다.

변경 종류별 추가 검증:

| 변경                      | 추가 검증                                                       |
| ------------------------- | --------------------------------------------------------------- |
| API contract              | `npx tsx scripts/gendoc.api.ts`, `docs/api-list.yaml` diff 확인 |
| Public export/build entry | `npm run build`, `dist/` entry와 `.d.ts` 확인                   |
| Schema                    | `schema/AGENTS.md`에 따른 대응 type과 schema 동기화             |
| 건강검진 schema/data      | `node scripts/verify-checkup-schema.mjs`                        |

`@iamssen/exocortex/server`는 type-only entry이므로 build에서 empty JavaScript chunk 안내가 나오는 것은 정상이다.

## 리뷰

코드 리뷰를 요청받으면 특정 변경분이 아니라 프로젝트 전체를 검토하고 `docs/reviews/code-review-{yyyy-MM-dd}.md`를 작성한다.

1. 처음 접하는 사람이 코드와 package 경계를 이해하기 쉬운지 확인한다.
2. 특히 `model/`의 파일 배치와 public type naming을 확인한다.
3. model에 consumer 구현 detail이 다시 유입되지 않았는지 확인한다.
4. API contract와 `docs/api-list.yaml`이 일치하는지 확인한다.
5. 치명적이지 않은 개선점은 별도 TODO로 정리한다.
6. 처음 참여하는 사람에게 필요한 가이드를 문서 최하단에 추가한다.
7. 문서는 한글로 작성하되, 한국어로 의미가 흐려지는 기술 용어는 English로 표기한다.
