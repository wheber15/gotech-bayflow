# Architecture

## Current stack

React 19, TypeScript in strict mode, Vite, Lucide icons, and a single global CSS stylesheet.

## Application structure

`main.tsx` mounts the application. `app/App.tsx` coordinates prototype login, navigation, and local feature state. Feature directories own their domain types and UI. `data/seedData.ts` contains non-confidential mock data.

## Domain boundaries

### Trailers

The trailer feature owns the board, cards, domain type, and operational actions. `LOADED` and `LEFT_SITE` are separate states. The current prototype does not yet model an explicit `LOADING` state or actor audit fields.

### Floor Reports

The `features/reports` feature owns its typed categories, form, scan-friendly list, detail view, presentation helpers, and prototype ID generation. Creation and completion are coordinated by the application through callbacks.

## Current state/storage approach

All operational state is held in React memory. Photographs use temporary browser object URLs. There is no persistence or server API.

## Authentication status

Authentication is a dedicated client-side prototype feature with separate Bay username/six-digit PIN and Admin username/password flows. Roles come from matched mock accounts. Per-account temporary lockout and Admin unlock state exist only in React memory; there is no production security or server-side authorization.

## Known prototype limitations

Refreshes discard changes, photos are not persistent, IDs and login lockouts are only session-local, mock credentials are visible in the client bundle, trailer timestamps are display-time strings, and authorization is UI-only.

## Expected future infrastructure

Persistence, secure authentication/authorization, protected object storage, and audit history should be selected when product requirements justify them. UI components communicate through typed inputs and callbacks so those additions do not require a UI rewrite.

## Architecture principles

Evolve as a modular monolith, maintain explicit domain boundaries, preserve operational terminology and traceability, and add infrastructure only for current needs.
