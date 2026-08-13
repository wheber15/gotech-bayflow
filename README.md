# BayFlow

Early prototype for a logistics bay app.

## Current prototype

- 4-digit PIN login mock
- Bay / Admin roles
- Today's trailer board
- Separate operational statuses:
  - Driver In
  - Loaded = ready, waiting collection
  - Left Site = departed with load
- Actual pallet quantity
- Door number
- Auto timestamps
- Floor Reports tab
- Floor report statuses: Pending / Completed
- Admin planning screen for booked times and planned pallets

## Run in VS Code

1. Open this folder in VS Code.
2. Open the terminal.
3. Run:

```bash
npm install
npm run dev
```

4. Open the local URL Vite prints in the terminal.

## Next build steps

1. Real photo capture/upload in Floor Reports.
2. Proper report form instead of browser prompts.
3. CSV/Excel trailer-plan import.
4. Persistent database.
5. Real PIN/user authentication.
6. Realtime office ↔ bay updates.
7. Audit log for edits.
8. Returns module.
9. Email/report export.

## Important

This is a prototype only. Do not connect real company/customer data until the project has been approved for use and the hosting/security setup is appropriate.
