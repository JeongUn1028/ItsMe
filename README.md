# Architecture

## Layers

- UI: app/
- Logic: lib/
- Data: content /

## Data Flow

MDX -> parse -> mapper -> Project -> UI

1. content (MDX)
2. read files
3. parse frontmatter
4. projectMapper
5. project[]
6. UI