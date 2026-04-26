Perform a thorough QA review of the campaign workflow data and React components in this project.

## What to check

### 1. Data Integrity (RAW_DATA in App.jsx)
- **Duplicate IDs**: Verify all `id` fields are unique across RAW_DATA entries
- **Duplicate names**: Flag any tasks with identical `name` values
- **Dependency validity**: For every `deps` array, confirm each referenced name exists as a `name` field in RAW_DATA
- **Circular dependencies**: Detect any dependency cycles (A → B → A)
- **Order consistency**: Check that `order` values don't conflict in unexpected ways
- **Phase coverage**: List all unique phases and flag any task with a missing or empty `phase`

### 2. React Component Quality
- **State management**: Review all `useState` hooks for unnecessary re-renders or stale closures
- **useMemo / useCallback**: Verify memoization is used correctly and dependencies are complete
- **Key props**: Ensure every list-rendered element has a stable, unique `key` prop
- **Accessibility**: Check for missing `aria-*` attributes on interactive elements
- **RTL support**: Since content is Hebrew (RTL), verify `dir="rtl"` or equivalent CSS is applied where needed

### 3. Business Logic
- **Orphaned tasks**: Find tasks whose `deps` are never satisfied by preceding tasks
- **Dead-end phases**: Identify phases that have no outgoing dependencies to later phases
- **Missing phases in sequence**: Check if the workflow phases follow a logical order

## Output format

Produce a structured report with these sections:

```
## Campaign QA Report

### ✅ Passed checks
- (list what looks good)

### ⚠️ Warnings
- (issues that may need attention but aren't critical)

### ❌ Errors
- (critical issues that must be fixed)

### 📊 Summary
- Total tasks: N
- Phases: [list]
- Issues found: N errors, N warnings
```

Start by reading `src/App.jsx` fully, then run all checks above and produce the report.
