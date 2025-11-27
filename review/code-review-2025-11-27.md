# Code Review Report

**Date**: 2025-11-27

이 리포트는 `prompts/REVIEW.md`의 지침에 따라 `exocortex` 프로젝트의 코드 가독성, 네이밍, 그리고 신규 입사자를 위한 가이드를 작성한 결과입니다.

## 1. 프로젝트 가독성 (General Readability)

프로젝트의 전반적인 구조는 **Domain-Driven Design (DDD)** 원칙을 잘 따르고 있어 매우 직관적입니다.

- **디렉토리 구조**: `model`, `server`, `schema` 등 역할에 따라 최상위 디렉토리가 명확히 구분되어 있습니다. 이는 프로젝트를 처음 접하는 사람도 각 코드가 어디에 위치해야 하는지 쉽게 예측할 수 있게 돕습니다.
- **응집도**: `model` 내부가 `finance`, `portfolio` 등 도메인별로 나뉘어 있어, 비즈니스 로직의 응집도가 높습니다.

## 2. Model 네이밍 및 구조 (Naming & Structure in Model)

`model` 디렉토리의 파일 및 타입 네이밍은 일관성이 뛰어나며 이해하기 쉽습니다.

### 장점

- **Explicit Naming**: 파일 이름이 해당 파일이 정의하는 핵심 타입을 그대로 반영합니다.
  - `quote.ts` → `Quote`
  - `deposit.ts` → `Deposit`
- **Role-based Suffixes**: 파일의 역할이 이름에 드러납니다.
  - `*.input.ts`: 데이터 입력/생성 시 사용되는 타입 (예: `deposit.input.ts`)
  - `*.projection.ts`: 특정 View나 로직을 위해 가공된 타입 (예: `fx.projection.ts`)
  - 이러한 규칙은 "Entity 타입"과 "DTO(Data Transfer Object) 성격의 타입"을 명확히 구분해주어 혼란을 줄입니다.
- **Nominal Types**: `interface`와 `type` alias가 적절히 사용되고 있으며, `Nominal Types`(`nominal-types.ts`)를 활용하여 `USD`, `Percent`와 같은 값의 의미를 명확히 하고 있습니다.

## 3. 개선 제안 및 아쉬운 점 (Minor Suggestions)

치명적이지 않지만, 차후 개선을 고려해볼 만한 사항들입니다.

- **Script Management**: `scripts/gendoc.api.ts`와 같이 스크립트들이 분리되기 시작했는데, `package.json`의 `scripts` 섹션에서도 이를 명확히 반영하여 관리하면 좋습니다.
- **Routes Type Scaling**: `server/index.ts`의 `Routes` 타입 정의가 API가 늘어남에 따라 비대해질 수 있습니다. 도메인별로 Route 타입을 분리하여 관리하는 것을 고려해볼 수 있습니다.
- **Re-exports**: `model/index.ts`에서 모든 모델을 re-export 하는 방식은 편리하지만, 프로젝트 규모가 커지면 모듈 의존성 관리가 복잡해질 수 있습니다.

## 4. 신규 입사자를 위한 가이드 (Newcomer Guide)

이 프로젝트에 처음 합류하신 분들을 위한 간단한 가이드입니다.

### 4.1. 프로젝트 구조 파악하기

가장 먼저 `model` 디렉토리를 살펴보세요. 이 프로젝트의 핵심 데이터 구조가 정의되어 있습니다.

- **`model/finance`**: 주가, 환율 등 시장 데이터
- **`model/portfolio`**: 내 자산, 거래 기록 등 포트폴리오 데이터

### 4.2. 데이터 흐름 이해하기

1.  **Model**: `model/*.ts`에서 데이터의 형태(Shape)를 정의합니다.
2.  **API Definition**: `server/*.ts`에서 서버가 제공하는 API의 스펙(URL, Request/Response 타입)을 정의합니다.
3.  **Documentation**: `npm run gendoc` (또는 커밋 시 자동 실행)을 통해 `gendoc/api.yaml`이 생성됩니다. 이 파일을 통해 현재 정의된 API 목록을 한눈에 볼 수 있습니다.

### 4.3. 개발 컨벤션

- **Naming**: 파일명은 담고 있는 핵심 타입의 이름을 따릅니다. 입력용 타입은 `*.input.ts`를 붙입니다.
- **Nominal Types**: 금액이나 비율 등을 다룰 때는 `number` 대신 `USD`, `KRW`, `Percent` 등 명시적인 타입을 사용해야 합니다. (`model/nominal-types.ts` 참조)

이 가이드가 프로젝트 적응에 도움이 되기를 바랍니다!
