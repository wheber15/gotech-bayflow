# GOTech / BayFlow Engineering Rules

## Product rules

- BayFlow is the current logistics module within the wider GOTech project. Do not mass-rename existing branding.
- `LOADED` means loading is finished and the trailer is ready and waiting for collection.
- `LEFT_SITE` means the trailer has physically departed with the load.
- Never merge or confuse `LOADED` and `LEFT_SITE`, infer departure from loading completion, or automatically transition between them.
- Target trailer lifecycle: `BOOKED → DRIVER_IN → LOADING → LOADED → LEFT_SITE`. If the current model omits a state, do not silently invent transitions.
- Warehouse workflows should support operations. Operational variances should normally be recorded and flagged rather than block work.
- Important actions should preserve WHAT happened, WHEN it happened, and WHO performed it. Do not silently overwrite operational history.
- Floor Reports are independent from trailer tracking and must never block trailer operations.
- Floor Report statuses are only `PENDING` and `COMPLETED` unless product requirements change. Completion never deletes a report.
- Bay Operator workflows are mobile-first; Admin workflows are desktop-friendly.

## Engineering rules

- Build the application with React, TypeScript, and Vite.
- Organise current functionality as a feature-based modular monolith.
- Inspect before editing and prefer incremental improvements over rewrites.
- Preserve working behaviour unless a change is explicit and documented.
- Do not over-engineer or introduce microservices, distributed architecture, or speculative abstractions.
- Do not add a backend, production authentication, Supabase, Redux, Zustand, or React Query until a current requirement justifies it.
- Do not add dependencies without a concrete reason.
- Use strong, explicit TypeScript domain types and avoid `any`.
- Prefer readable code and meaningful responsibilities over clever or generic abstractions.
- Keep canonical timestamps machine-readable (normally ISO 8601); format them only for display.
- Keep mock data free of real or confidential company/customer information. Never commit secrets or credentials.
- Maintain semantic HTML, labelled inputs, accessible button names, useful image alt text, and visible focus states.
- Build and run every configured test, lint, and build check after meaningful changes. Do not claim checks that were not run.

## Change discipline

- Keep trailer and Floor Report state separate.
- Avoid giant root components; extract code when it represents a meaningful domain or UI responsibility.
- Do not create empty future-module directories, fake services, generic repositories, event buses, or dependency-injection frameworks.
- Keep feature boundaries suitable for later persistence, authentication, permissions, storage, realtime updates, and auditing without building those systems prematurely.
