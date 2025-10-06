## Architecture Map

Purpose: a concise, enforceable blueprint for a scalable, modular React app using a Feature‑Sliced + Clean Architecture hybrid. It defines folders, boundaries, naming, and responsibilities so anyone can navigate and extend safely.

### 1) High-level layout
```
/
├─ app/                          # App-level composition (wiring only)
│  ├─ providers/                 # Context providers (ThemeProvider, QueryClient)
│  ├─ routes/                    # Route objects, guards, lazy loaders
│  ├─ index.tsx|jsx              # Root bootstrap
│  └─ App.tsx|jsx                # Top shell (no business logic)
│
├─ shared/                       # Reusable, pure, cross-app modules
│  ├─ ui/                        # UI primitives (Button, Input, Card, Container, Text)
│  ├─ styles/                    # reset.css, tokens.css, ui.css, utilities
│  ├─ lib/                       # Pure utils (format, date, fp helpers)
│  ├─ config/                    # Env, feature flags, constants
│  └─ types/                     # Global types (if TS)
│
├─ entities/                     # Domain entities (User, Post, Media)
│  └─ <entity>/
│     ├─ model/                  # types, adapters, mappers, validators
│     ├─ api/                    # entity-scoped API calls + DTOs
│     └─ ui/                     # simple entity widgets (Avatar, Username)
│
├─ features/                     # User actions and flows (Auth, Search, Upload)
│  └─ <feature>/
│     ├─ ui/                     # feature components (LoginForm, FilterBar)
│     ├─ model/                  # hooks, state machines, usecases
│     └─ api/                    # feature-specific endpoints
│
├─ widgets/                      # Composite UI blocks composed of entities/features
│  └─ <widget>/                  # Header, Sidebar, Feed
│
├─ pages/                        # Route-level composition (no logic)
│  └─ <page>/                    # Home, Gallery
│
├─ api/                          # Transport and schema
│  ├─ http/                      # fetch/axios client, interceptors, errors
│  └─ graphql/
│     ├─ schema.graphql          # Source of truth (rename gaph.ql)
│     ├─ fragments/              # Reusable fragments
│     ├─ operations/             # queries.graphql, mutations.graphql
│     └─ client.ts               # GraphQL client setup
│
├─ assets/                       # images, fonts, icons
├─ tests/                        # unit + integration tests
└─ docs/                         # Architecture docs (this file + ADRs)
```

Key rule: lower layers never import from upper layers.
- shared → imports nothing app-specific
- entities → can import from shared
- features → can import from shared/entities
- widgets → can import from shared/entities/features
- pages → can import from widgets/features/entities/shared
- app → can import from anywhere, but contains no domain logic

### 2) Naming and responsibilities
- Components: PascalCase files (`Header.jsx`, `LoginForm.jsx`)
- Utilities: camelCase files (`formatDate.ts`)
- Styles: kebab-case (`tokens.css`, `reset.css`)
- Avoid abbreviations; names must express intent

UI layering:
- shared/ui: primitives with minimal props, stylistically consistent via CSS variables
- entities/*/ui: thin presentational parts for a domain object
- features/*/ui: form flows and cohesive interactions
- widgets/*: composition-only blocks (no API, minimal state)
- pages/*: route composition, no business logic

### 3) Theming and styles
- Design tokens in `shared/styles/tokens.css`. Define: colors, spacing, radius, shadows, type scales.
- Theme toggling by adding/removing `.dark` on `html`. Components read only CSS vars (no per-component theme logic).
- Global primitives in `shared/styles/ui.css`: `.btn`, `.input`, `.card`, layout helpers.
- Feature-specific styles live in the feature folder (`features/<feature>/ui/*.css`) and must only use CSS variables.

### 4) API and data access
- Single transport setup in `api/http` and/or `api/graphql/client.ts`.
- No network calls in components. Place them under `entities/*/api` or `features/*/api`.
- Map DTOs → domain models in `entities/*/model` with mappers and validators.
- Error types and retry rules live in the transport layer (interceptors).

### 5) State management
- Server cache (React Query, SWR) is provided at `app/providers`.
- Local UI state stays within components.
- Cross-feature or domain-specific state lives in `features/*/model` or `entities/*/model`.
- Prefer explicit hooks: `useLogin`, `useGalleryFilter`, `useUserProfile`.

### 6) Routing
- Centralize route objects in `app/routes` (with lazy imports and guards).
- `pages/*` only composes widgets/features; zero side-effects.

### 7) Testing strategy
- Unit tests close to modules (e.g., `features/auth/model/__tests__`).
- Integration tests under `tests/integration` for route flows and data interactions.
- Mock transport in tests; do not hit live endpoints.

### 8) Documentation set
- `docs/ARCHITECTURE.md`: one-page high-level overview with diagram
- `docs/DECISIONS.md`: Architecture Decision Records (ADRs)
- `docs/NAMING.md`: naming and folder rules with examples
- `docs/DESIGN-TOKENS.md`: token definitions and usage rules
- `docs/map.md`: this blueprint (kept succinct, updated as code evolves)

### 9) Enforce with lint and boundaries (optional but recommended)
- ESLint import rules to forbid upward imports (e.g., `import/no-restricted-paths`).
- Path aliases: `@/shared`, `@/entities`, `@/features`, `@/widgets`, `@/pages`, `@/app`, `@/api`.
- CI checks: lint, typecheck, test, build on every PR.

### 10) Migration guide (from current tree)
1. Move `src/components/ui/*` → `shared/ui/*`. Keep filenames.
2. Move theme files: `src/theme/tokens.css` → `shared/styles/tokens.css`; keep provider in `app/providers/ThemeProvider`.
3. Group feature code under `features/*` (e.g., `auth/ui/LoginForm.jsx`).
4. Create `api/graphql/schema.graphql` (rename `gaph.ql`) and split operations into `operations/` and `fragments/`.
5. Keep `Header` as a `widgets/header` and `pages/*` compose it.
6. Replace raw HTML inputs/buttons with primitives incrementally.

### 11) Example module shapes
```
features/auth/
  ui/
    LoginForm.jsx
    SignupForm.jsx
  model/
    useLogin.js
    validation.js
  api/
    auth.api.js

entities/user/
  model/
    user.types.ts
    user.mappers.ts
  api/
    user.api.ts
  ui/
    Avatar.jsx
    Username.jsx
```

### 12) Principles (keep decisions simple)
- Small files, single responsibility.
- Data flows down, events bubble up.
- No business logic in pages/widgets/shared/ui.
- Strictly use CSS variables; avoid hardcoded colors.
- Favor composition over inheritance; keep props minimal and explicit.

This map is the contract. Keep it short, keep it current.


