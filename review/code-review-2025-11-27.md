# Code Review (2025-11-27)

이 문서는 `prompts/REVIEW.md`의 가이드라인에 따라 수행된 코드 리뷰 결과입니다.

## 1. 전반적인 가독성 및 구조

프로젝트의 전반적인 구조는 매우 깔끔하고 직관적입니다.

- **디렉토리 구조**: `model`, `projector`, `server` 등으로 역할이 명확하게 분리되어 있어, 코드를 처음 접하는 사람도 각 디렉토리의 목적을 쉽게 파악할 수 있습니다.
- **Nominal Types**: `model/nominal-types.ts`를 통해 `Iso8601`, `Percent`, `USD`, `KRW` 등 도메인 특화 타입을 정의하여 사용하는 점은 타입 안정성과 가독성을 높이는 훌륭한 패턴입니다.
- **함수 네이밍**: `projector` 디렉토리 내의 함수들(`joinHoldingsAndQuotes`, `sumBondsGain` 등)은 수행하는 동작을 명확하게 설명하고 있어 이해하기 쉽습니다.

## 2. Model 및 Type 네이밍 분석

`model` 디렉토리의 타입 정의들은 대체로 명확하지만, 몇 가지 개선하면 더 좋을 부분들이 보입니다.

### 긍정적인 점

- **`Holding` vs `Holdings`**: 단수와 복수 형태를 사용하여 개별 항목과 목록을 명확히 구분하고 있습니다.
- **`Quote` 계열**: `Quote`(현재 시세), `QuoteRecord`(과거 데이터 포인트), `QuoteHistory`(과거 데이터 집합)의 네이밍이 논리적이고 일관성이 있습니다.
- **`QuoteStatistics`**: 주식의 밸류에이션 지표들을 포함하는 인터페이스로 적절한 이름을 가지고 있습니다.

### 개선 제안 (Naming)

- ~~**`QuoteSource`**: 현재 `QuoteSource`는 `yahoo`, `google` 등의 플랫폼 이름을 키로 가지는 객체입니다. `QuoteInfo`에서 `symbols`와 `links` 필드의 타입으로 사용되고 있는데, `symbols`는 각 플랫폼별 티커 ID를, `links`는 URL을 의미하는 것으로 보입니다. `QuoteSource`라는 이름보다는 **`PlatformMap`** 또는 **`ExternalIdentifiers`** 같은 이름이 더 구체적일 수 있습니다.~~
- ~~**`Quote.source`**: `source: object`로 정의되어 있는데, 가능하다면 더 구체적인 타입을 지정하거나 `unknown`을 사용하여 타입 안전성을 높이는 것이 좋겠습니다.~~

## 3. 아쉬운 점 및 개선 포인트 (TODO)

- ~~**`projector/toMatch.ts` 네이밍**: 함수 이름 `toMatch`는 동사형이지만 목적어가 불분명합니다. `Watch` 조건을 평가하여 매칭 결과를 반환하므로, **`evaluateWatchConditions`** 또는 **`checkWatchMatches`** 와 같이 더 구체적인 이름이 좋을 것 같습니다.~~
- **`projector/toMatch.ts` 복잡도**: `if-else if` 블록이 반복되고 있어, 조건별 로직을 별도 함수로 분리하거나 전략 패턴 등을 사용하면 가독성이 더 좋아질 것입니다.
- **`projector/joinHoldingsAndQuotes.ts`**: `marketState`를 계산하고 보정하는 로직이 `map` 함수 내부에 포함되어 있어 다소 복잡해 보입니다. 이 로직을 별도의 헬퍼 함수로 분리하는 것을 고려해볼 만합니다.

---

## 4. 프로젝트 가이드 (Newcomer Guide)

이 프로젝트에 처음 참여하는 분들을 위한 간략한 가이드입니다.

### 프로젝트 구조

이 프로젝트는 크게 데이터 모델(`model`), 비즈니스 로직/변환(`projector`), 그리고 서버/API(`server`)로 구성되어 있습니다.

- **`model/`**: 데이터의 형태(Schema)를 정의합니다. 모든 데이터 구조는 이곳에 정의된 TypeScript 인터페이스를 따릅니다.
  - **Nominal Types**: `string`이나 `number` 대신 `Iso8601`, `Percent` 같은 타입을 사용하여 데이터의 의미를 명확히 합니다. (예: `2025-01-01`은 단순 문자열이 아니라 `Iso8601` 타입)
- **`projector/`**: 데이터를 가공하고 변환하는 순수 함수들의 집합입니다.
  - 예: `joinHoldingsAndQuotes`는 보유 주식(`Holding`)과 현재 시세(`Quote`)를 결합하여 수익률을 계산합니다.
- **`server/`**: 외부 요청을 처리하는 API 엔드포인트들이 위치합니다.

### 주요 개념

- **Quote**: 주식, 환율 등의 시장 데이터를 의미합니다.
- **Holding**: 사용자가 보유한 자산(주식, 채권 등) 정보를 의미합니다.
- **Watch**: 사용자가 설정한 감시 조건(목표가, 목표 PER 등)을 의미합니다.

### 개발 팁

- 새로운 기능을 추가할 때는 먼저 `model`에 필요한 데이터 구조를 정의하고, `projector`에 변환 로직을 구현한 뒤, 필요한 경우 `server`에서 이를 활용하는 순서로 진행하는 것이 좋습니다.
- 날짜 처리는 `luxon` 라이브러리를 사용하며, 모든 날짜 문자열은 `Iso8601` 형식을 따르는 것을 원칙으로 합니다.
