# Architecture

## Layers

- UI: app/
- Logic: lib/
- Data: content /

## Data Flow

MarkDown -> parse -> mapper -> Project -> UI

1. content (MD)
2. read files
3. parse frontmatter
4. projectMapper
5. project[]
6. UI

## MD type & filed define

- title: string, 카드/모달 제목
- summary: string, 카드 설명
- thumbnail: string, Grid thumbnail
- tags: string[], 필터링 / UI 표시
- status: draft | published, draft 숨기기, 임시 저장 필터링
- createAt: 정렬 기준 및 이력 관리

## slug generate rule

- 소문자만 사용
- 공백 -> 하이픈 (-)
- 특수문자 제거
- 의미있는 단어 사용
