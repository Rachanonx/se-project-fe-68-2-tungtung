# Playwright Chat E2E

This project now includes a Playwright end-to-end test for the chat flow between a user and an admin.

## What the test covers

- Registers a fresh user account through the backend API
- Registers a fresh admin account through the backend API
- Signs both accounts in through the UI
- Sends a chat message from the user widget
- Opens the admin chat page and verifies the new conversation
- Sends a reply from the admin page and verifies the user receives it

## Prerequisites

- MongoDB, backend, and frontend must all be running
- Frontend should be available at `http://127.0.0.1:3000`
- Backend should be available at `http://127.0.0.1:5000`

The test reads these optional environment variables:

- `PLAYWRIGHT_BASE_URL`
- `PLAYWRIGHT_BACKEND_URL`

## Run with Docker

From the project root:

```powershell
docker compose up -d mongo backend frontend
```

If Docker is not running yet, start Docker Desktop first.

## Run the test

From `se-project-fe-68-2-tungtung`:

```powershell
npm run test:e2e
```

For a visible browser:

```powershell
npm run test:e2e:headed
```
