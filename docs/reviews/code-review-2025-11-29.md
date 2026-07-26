# Code Review (2025-11-29)

## 1. 개요

이 문서는 `exocortex` 프로젝트의 `model` 디렉토리를 중심으로 코드의 가독성과 네이밍 컨벤션을 점검한 결과입니다. 이 프로젝트는 금융 포트폴리오 관리를 위한 핵심 도메인 모델을 정의하고 있습니다.

## 2. 코드 가독성 및 네이밍 체크

### `model` 디렉토리 분석

전반적으로 TypeScript의 타입 시스템을 매우 효과적으로 활용하고 있으며, 코드의 의도가 명확하게 드러납니다.

- **Nominal Types (명목적 타이핑)**:
  - `nominal-types.ts`에 정의된 `Iso8601`, `Percent`, `Ratio`, `KRW`, `USD` 등의 타입은 이 프로젝트의 가장 큰 장점입니다.
  - 단순 `number`나 `string` 대신 구체적인 단위를 타입으로 명시함으로써, 개발자가 실수로 다른 단위의 값을 대입하는 것을 방지하고 코드의 의미를 명확히 전달합니다.
  - 예: `Holding<Currency>`에서 `Currency` 제네릭을 통해 통화 단위를 강제하는 패턴(`Holding<KRW>`, `Holding<USD>`)은 매우 훌륭합니다.

- **Finance & Portfolio 모델**:
  - `Quote`, `QuoteInfo`, `QuoteStatistics` 등 데이터의 성격에 따라 인터페이스가 잘 분리되어 있습니다.
  - `Holding` 인터페이스의 `avgCostPerShare`, `realizedGain` 등 필드명은 금융 도메인 용어를 정확하게 반영하고 있어 이해하기 쉽습니다.
  - `PeAndYields` 인터페이스의 `priceEarningsRatio`와 같이 약어 대신 풀 네임을 사용하는 경우도 있어 가독성을 높이고 있습니다.

## 3. 개선 제안 (Suggestions)

아래 내용은 치명적인 문제는 아니지만, 프로젝트의 완성도를 높이기 위해 고려해볼 만한 사항들입니다.

- **[TODO] 주석 보강**: `QuoteRecord`나 `CurrentMarketValuation`과 같은 시계열 데이터나 외부 API 의존적인 데이터 구조에는 데이터의 갱신 주기나 출처에 대한 JSDoc 주석을 추가하면 좋겠습니다.
- **[TODO] 유틸리티 타입 활용**: `PlatformMap`의 키(`yahoo`, `google` 등)가 여러 곳에서 반복적으로 사용된다면, 이를 `Platform`이라는 Union Type으로 추출하여 관리하는 것을 고려해볼 수 있습니다.
- **[TODO] 디렉토리 구조**: `model/finance`와 `model/portfolio`의 경계가 명확하지만, `valuation.ts`와 같이 일부 파일은 성격에 따라 위치가 모호할 수 있습니다. 도메인 확장에 대비해 분류 기준을 문서화하면 좋겠습니다.

---

## 4. 신규 참여자를 위한 가이드

이 프로젝트에 처음 참여하시는 분들을 위한 가이드입니다.

### 프로젝트의 핵심: Model

이 프로젝트의 중심은 `model` 디렉토리입니다. 애플리케이션의 로직보다는 **데이터의 구조와 의미**를 정의하는 데 집중되어 있습니다.

### Nominal Typing 이해하기

이 프로젝트에서는 `number` 타입을 그대로 쓰지 않고, 의미를 부여한 타입을 사용합니다.

- **`Ratio`**: 비율을 나타냅니다. (예: 1.5)
- **`Percent`**: 백분율을 나타냅니다. (예: 150%)
- **`KRW`, `USD`**: 통화를 나타냅니다.

```typescript
// 예시: 주식 보유 정보
const myHolding: Holding<KRW> = {
  symbol: '005930', // 삼성전자
  avgCostPerShare: 70000 as KRW, // 7만원
  // ...
};
```

이러한 패턴은 환율 계산이나 수치 연산 시 발생할 수 있는 단위를 혼동하는 실수를 막아줍니다.

### 주요 디렉토리

- **`model/finance`**: 주식, 환율, 시장 지표 등 일반적인 금융 데이터를 정의합니다.
- **`model/portfolio`**: 사용자의 자산, 보유 종목, 거래 내역 등 개인화된 데이터를 정의합니다.
