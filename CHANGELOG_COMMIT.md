refactor(fsd): fix FSD violations and reorganize API types

BREAKING CHANGE: API types moved from features/auth/types.ts to shared/lib/types/api.ts

- Move API types to shared/lib/types/api.ts to comply with FSD architecture
- Remove features/auth/types.ts (types now in shared layer)
- Update Like component to receive isAuthenticated via props instead of Redux selector
- Update SimiliarProposals component to receive data via props instead of Redux hooks
- Update Card component to pass isAuthenticated prop to Like component
- Update UserCardsSection to pass isAuthenticated to Card components
- Remove empty types/ directories from entities/city and entities/like

docs: reorganize frontend documentation into API section

- Create doc/api/react-integration.md with React/Redux integration examples
- Update doc/api/overview.md with current likes API (user-to-user)
- Update doc/api/authentication.md with avatar upload and FormData examples
- Update doc/api/endpoints.md with current registration and likes endpoints
- Simplify doc/FRONTEND.md to general overview with links to API docs
- Update doc/types/auth-types.md with RegisterRequest including avatar
- Create doc/types/api-types.md for API types documentation
- Update doc/store/overview.md with FSD structure and current slices
- Update doc/guides/architecture.md with FSD layers and import rules
- Update doc/README.md with new documentation structure

chore: add .obsidian to .gitignore

- Ignore Obsidian editor configuration directory
