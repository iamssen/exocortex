# JSON Schemas

`schema/`는 사람이 작성하는 JSON/YAML 데이터의 VSCode 자동완성과 검증을 위한 JSON Schema를 관리한다. 대부분의 스키마는 `model/`의 타입과 대응하지만, 저장·입력 데이터의 구조와 editor용 제약을 표현하기 위해 타입과 완전히 같지 않을 수 있다.

스키마를 변경할 때의 동기화·검증 규칙은 [AGENTS.md](./AGENTS.md)를 참고한다.

## Editor settings

다음 editor 설정에서 이 디렉터리의 스키마를 연결한다.

- VSCode: `~/Library/Application Support/Code/User/settings.json`
- Antigravity: `~/Library/Application Support/Antigravity/settings.json`

## TypeScript 타입 대응표

| 영역 | Schema | 대응 TypeScript 타입 | 참고 |
| --- | --- | --- | --- |
| Body | [kcal.json](./body/kcal.json) | [KcalInput](../model/body/body.input.ts) | |
| Body | [skin.json](./body/skin.json) | [DaySkin](../model/body/body.ts) | 날짜를 key로 사용하는 기록 형식 |
| Portfolio | [balance.json](./portfolio/balance.json) | [BalanceInput](../model/portfolio/balance.input.ts) | |
| Portfolio | [bond.json](./portfolio/bond.json) | [BondInput](../model/portfolio/bond.input.ts) | |
| Portfolio | [deposit.json](./portfolio/deposit.json) | [DepositInput](../model/portfolio/deposit.input.ts) | |
| Portfolio | [fx.json](./portfolio/fx.json) | [FXInput](../model/portfolio/fx.input.ts) | |
| Portfolio | [holding.json](./portfolio/holding.json) | [Trade](../model/portfolio/trade.ts) | |
| Portfolio | [housing.json](./portfolio/housing.json) | [HousingInput](../model/portfolio/housing.input.ts) | |
| Portfolio | [simulation.json](./portfolio/simulation.json) | [Simulation](../model/portfolio/simulation.ts) | |
| Portfolio | [watch.json](./portfolio/watch.json) | [WatchInput](../model/portfolio/watch.input.ts) | |
| Utils | [indicator.json](./indicator.json) | [EventIndicator](../model/event.ts) | |
| Utils | [link.json](./link.json) | [Link](../model/link.ts) | |

## 건강검진 데이터

- [body/checkup.json](./body/checkup.json): `body/checkups/`의 건강검진 YAML 데이터를 검증하는 스키마
- [body/checkups-source/checkup.json](./body/checkups-source/checkup.json): 원본 건강검진 YAML 데이터를 위한 스키마
- [body/checkup.md](./body/checkup.md): 건강검진 항목의 의미와 분류 설명
