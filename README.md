# PathLens

PathLens is a recursive visual query builder that helps users construct, explore, and execute complex database and API queries through an intuitive graphical interface.

Rather than writing raw query syntax manually, users can build nested conditions, combine logical groups, switch between schemas, preview generated queries in multiple formats, and inspect matching results in real time.

The name _PathLens_ reflects the core experience of the application:

- **Path** — the logical paths created through nested rules, conditions, and groups.
- **Lens** — the ability to visualize, inspect, and understand data through those paths.

Built with scalability and maintainability in mind, PathLens uses a recursive query tree architecture that supports unlimited nesting depth while providing a clean and responsive user experience.

## Key Features

- Build complex queries visually without writing code
- Create unlimited nested groups using AND/OR logic
- Switch between multiple data schemas dynamically
- Preview generated SQL, MongoDB, and JSON query output
- Execute queries against datasets and inspect matching records
- Validate query structures and input values in real time
- Import and export query configurations
- Recursive architecture designed for scalability and maintainability

## Tech Stack

- Next.js App Router
- TypeScript
- Tailwind CSS
- Zustand
- Vitest
- React Testing Library
- Lucide React

## Architecture

PathLens is built around a recursive query tree structure. Every query is represented as either a rule or a group.

Rules contain:

- field
- operator
- value

Groups contain:

- logic (`AND` / `OR`)
- collapsed state
- children

Because groups can contain other groups, PathLens supports unlimited query nesting while maintaining a consistent user experience at every level.

## Recursive Rendering Strategy

`RuleGroup.tsx` renders a query group and recursively renders all nested child groups.

Each group manages its own controls for:

- adding rules
- adding child groups
- switching logic operators
- collapsing and expanding
- removing nodes
- reordering children

This recursive approach keeps the implementation predictable and scalable regardless of query depth.

## State Management

`queryStore.ts` manages the query tree and exposes immutable actions for:

- add rule
- add group
- update rule
- remove node
- toggle group
- reorder children
- switch schema
- reset query

Recursive helper functions are used to locate and update nodes while preserving state immutability.

## Query Engine

Core query logic lives in `src/lib`.

- `sqlGenerator.ts` generates SQL-like query syntax
- `mongoGenerator.ts` generates MongoDB-style filters
- `jsonGenerator.ts` serializes the query tree
- `queryExecutor.ts` executes queries against mock datasets
- `validator.ts` validates operators, values, dates, and regex patterns
- `sanitizer.ts` converts values into schema-aware types

## Schema-Driven Controls

Schemas are defined in `src/data/schemas.ts`.

Field types determine the UI controls automatically:

- string → text input
- number → numeric input
- date → date picker
- enum → dropdown selector
- boolean → true/false selector

Available operators are also dynamically restricted based on field type.

## Performance Notes

PathLens is optimized through:

- stable node identifiers
- memoized query output
- pure query engine functions
- isolated recursive components
- immutable tree updates
- paginated result rendering

## Testing

The test suite covers:

- SQL generation
- MongoDB generation
- query execution
- validation
- sanitization
- import/export
- recursive group rendering
- query store actions
- full builder shell rendering

Run tests:

```bash
pnpm test
```

## License

Built for the HNGi14 internship Task.

## Author

Racheal I. Ogunmodede (TechNurse)

---
