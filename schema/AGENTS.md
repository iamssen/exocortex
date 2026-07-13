# schema

`schema/`는 사람이 작성하는 JSON/YAML 데이터의 VSCode 자동완성과 검증에 쓰이는 JSON Schema를 관리한다.

## 모델과의 관계

- 스키마와 대응하는 TypeScript 타입의 목록은 [README.md](./README.md)에 있다.
- 스키마는 TypeScript 타입을 기계적으로 변환한 결과물이 아니다. 저장·입력 데이터의 구조, editor용 설명과 예시, 값의 범위 등 타입에 없는 제약을 포함할 수 있다.
- 대응하는 TypeScript 타입을 변경하면 관련 스키마의 필드명, 타입, optional 여부, enum 및 제약을 함께 검토한다. 구조가 의도적으로 다르면 그 이유를 스키마의 `description` 또는 README에 남긴다.
- 새 스키마를 추가하거나 대응 관계를 변경하면 README의 목록도 갱신한다.

## 작성과 검증

- 기존 파일과 동일하게 JSON Schema draft-07을 사용한다.
- `additionalProperties`, `required`, `patternProperties`는 데이터 호환성에 영향을 주므로 의도를 확인한 뒤 변경한다.
- `body/checkup.json` 또는 `body/checkups/*.yml`을 변경한 경우 `node scripts/verify-checkup-schema.mjs`로 건강검진 데이터를 검증한다.
