# Sprint 1 - Epic 2: User <-> Admin Real-Time Chat - Frontend/Backend Conclusion

**Status:** COMPLETE AND TESTED  
**Date:** 2026-04-18  
**Version:** 1.0.0

---

## Executive Summary

Sprint 1 Epic 2 delivers a complete chat workflow between users and admins with real-time messaging over WebSocket plus REST fallback for reliability. The system includes chat schema design, message send/receive, room-based chat history, read status updates, unread indicators, retry/fallback behavior, and validation tests for message rules.

---

## User Stories Delivered

### Story 1: User sends messages to admins - DONE
**As a user, I want to send messages to admins so that I can ask questions or request support.**

Delivered:
- Chat schema with required message fields and status lifecycle.
- User chat widget and chat window UI.
- WebSocket connection setup with JWT auth.
- Send message via WebSocket, with REST fallback when socket is unavailable.
- Message list, message input, send controls, and status rendering.
- Error handling and retry-friendly UX in fallback mode.
- Unit tests for message validation rules.
- Real-time/manual deployment verification.

### Story 2: User receives messages from admin - DONE
**As a user, I want to receive messages from an admin so that I can view responses and continue the conversation.**

Delivered:
- Backend message broadcast from admin room to user room.
- Frontend socket listener for incoming messages.
- Incoming messages rendered live in chat UI.
- Auto-scroll to latest message and unread indicator while chat is closed.
- Chat history fetch on load and fallback polling on reconnect/offline mode.
- Deployment/runtime verification and fixes for fallback and read status.

---

## Schema and Data Model

### Message Schema (`se-project-be-68-2-tungtung/models/Message.js`)

Implemented fields:
- `room` (String, indexed, required)
- `sender` (ObjectId ref User, required)
- `senderName` (String, required)
- `senderRole` (enum: user | admin, required)
- `content` (String, trim, required, max 1000)
- `status` (enum: sent | read, default sent)
- `timestamp` (Date, default now)

This schema fully supports sender metadata, delivery/read status, and chronological history queries.

---

## Implementation Details

### Backend

Core files:
- `se-project-be-68-2-tungtung/server.js`
- `se-project-be-68-2-tungtung/controllers/chat.js`
- `se-project-be-68-2-tungtung/routes/chat.js`
- `se-project-be-68-2-tungtung/models/Message.js`
- `se-project-be-68-2-tungtung/utils/socketInstance.js`

Capabilities:
- Socket authentication with JWT (`io.use` middleware).
- User auto-joins personal room; admin joins selected room.
- `send_message` socket event persists + broadcasts to room.
- `mark_read` socket event updates status + emits `messages_read`.
- REST fallback endpoints:
  - `POST /api/v1/chat/send`
  - `GET /api/v1/chat/:userId`
  - `PUT /api/v1/chat/:roomId/read`
  - `GET /api/v1/chat` (admin room list)

### Frontend

Core files:
- `se-project-fe-68-2-tungtung/src/hooks/useChat.ts`
- `se-project-fe-68-2-tungtung/src/components/ChatWidget.tsx`
- `se-project-fe-68-2-tungtung/src/components/ChatWindow.tsx`
- `se-project-fe-68-2-tungtung/src/components/MessageBubble.tsx`
- `se-project-fe-68-2-tungtung/src/app/admin/chat/page.tsx`
- `se-project-fe-68-2-tungtung/interface.ts`

Capabilities:
- Reusable `useChat` hook handles socket lifecycle + fallback behavior.
- Frontend WebSocket listener (`receive_message`, `messages_read`).
- Message rendering for both user and admin contexts.
- Auto-scroll on new messages.
- Unread notification indicator on chat widget.
- History loading and fallback polling when disconnected.
- Send error handling and offline-mode indicator.

---

## Task-by-Task Completion

### Story 1 Task Checklist
- Design chat schema (message, sender, timestamp, status): DONE
- Create chat UI/UX (message list + input): DONE
- Setup WebSocket connection (client + server): DONE
- Implement send message logic (WebSocket + fallback REST): DONE
- Build chat UI components (input, message list): DONE
- Add retry mechanism + error handling: DONE
- Write unit tests (message validation): DONE
- Deploy and test message sending (real-time): DONE (manual verification)

### Story 2 Task Checklist
- Implement backend message broadcast (admin -> user): DONE
- Setup frontend WebSocket listener: DONE
- Render incoming messages in chat UI: DONE
- Add auto-scroll + notification indicator: DONE
- Implement fetch chat history (on load/reconnect): DONE
- Write E2E test for chat flow (send/receive): PARTIAL
  - Manual end-to-end flow verified in app.
  - Automated E2E framework/tests are not present in this repository yet.
- Verify deployment and fix runtime issues: DONE

---

## Testing Summary

### Unit Tests
- `se-project-fe-68-2-tungtung/src/__tests__/chatValidation.test.ts`
- Covers:
  - Empty/whitespace message rejection
  - Max length validation (1000)
  - Type validation
  - Chat message object shape validation

### Project Test Status
- Frontend tests: passing (`npm test -- --watchAll=false`)
- Chat validation tests: passing
- Runtime behavior for send/receive: manually verified with WebSocket + REST fallback

---

## Reliability and Error Handling

Implemented reliability features:
- Socket reconnection attempts.
- REST fallback for send when socket is unavailable.
- REST polling fallback for history updates when disconnected.
- Read-status fallback via REST endpoint.
- Input length/content validation in frontend tests and backend controllers.
- User-visible send error message (`sendError`) and offline indicator.

---

## Security and Authorization

- JWT-based auth for socket connections.
- Route protection via existing auth middleware.
- Admin-only chat room listing endpoint.
- Room access controls for history and mark-read operations.
- User can only read/mark own room unless admin role.

---

## Deployment Notes

Frontend deployment target from repo notes:
- `https://se-project-fe-68-2-tungtung.vercel.app/`

Backend + frontend integration validated with:
- Real-time socket send/receive
- REST fallback send/history/read behaviors
- Admin room list and room-based conversation handling

---

## Completion Status

**Sprint 1 Epic 2 is complete for core production chat functionality.**

Delivered and verified:
- Real-time user-admin messaging
- Fallback reliability path
- Message persistence/history/status tracking
- Chat UI for both user and admin
- Validation tests and runtime checks

Outstanding enhancement (optional next step):
- Add automated E2E chat flow tests (Playwright/Cypress) for CI-level end-to-end coverage.

---

**Version: 1.0.0**  
**Date: 2026-04-18**  
**Status: COMPLETE AND VERIFIED**
