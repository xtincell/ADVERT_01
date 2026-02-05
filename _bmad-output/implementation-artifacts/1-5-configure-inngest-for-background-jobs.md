# Story 1.5: Configure Inngest for Background Jobs

## Story

As a **developer**,
I want **Inngest configured for background job processing**,
So that **I can queue async tasks like email sending, exports, and webhook delivery**.

## Status

✅ Complete

## Acceptance Criteria

1. **AC1: Inngest Package Installation**
   - Install `inngest` npm package
   - Latest stable version in package.json

2. **AC2: Inngest Client Configuration**
   - Create client at `src/lib/inngest/client.ts`
   - Export configured Inngest instance
   - App name: "advert-01"
   - Include event schemas for type safety

3. **AC3: Environment Variables**
   - INNGEST_EVENT_KEY configured
   - INNGEST_SIGNING_KEY for webhook validation

4. **AC4: API Route**
   - Create route at `src/app/api/inngest/route.ts`
   - Export Inngest serve handler
   - Register all function handlers

5. **AC5: Test Function**
   - Create test function at `src/lib/inngest/functions/test.ts`
   - Simple function to verify setup works

6. **AC6: Local Development**
   - `npx inngest-cli@latest dev` works
   - Dashboard accessible at http://localhost:8288

## Technical Notes

- Inngest provides durable functions for background jobs
- Type-safe event system with TypeScript
- Built-in retries, scheduling, and monitoring
- Free tier sufficient for MVP

## Tasks

- [x] Task 1: Install inngest package
- [x] Task 2: Create Inngest client with event types
- [x] Task 3: Create API route handler
- [x] Task 4: Create test function
- [x] Task 5: Update environment variables
- [x] Task 6: Write tests

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Completion Notes

✅ **Inngest Package Installed**
- inngest package added to dependencies
- 175 packages installed as dependencies

✅ **Inngest Client Configuration**
- Created client at `src/lib/inngest/client.ts`
- App ID: "advert-01"
- Type-safe event schemas for:
  - `test/hello.world` - Test event
  - `email/send` - Email sending
  - `strategy/generate` - Strategy generation
  - `export/pdf` - PDF exports
  - `webhook/deliver` - Webhook delivery

✅ **API Route Handler**
- Created route at `src/app/api/inngest/route.ts`
- Exports GET, POST, PUT handlers via Inngest serve
- Registers helloWorld function

✅ **Test Function**
- Created at `src/lib/inngest/functions/test.ts`
- Uses Inngest step functions for durable execution
- Logs message and returns greeting

✅ **Environment Variables**
- INNGEST_EVENT_KEY added to env schema (optional for dev)
- INNGEST_SIGNING_KEY added to env schema (optional for dev)
- Updated .env.example with documentation
- Variables optional in development (Inngest dev server doesn't require them)

✅ **Testing**
- 18 tests in tests/inngest.test.ts (all passing)
- Tests for client configuration, event types, function exports, API route handlers
- Added path alias to vitest.config.ts for `~/` resolution

**Technical Details:**
- Vitest configured with path alias: `"~": "./src"`
- Event schemas use `EventSchemas().fromRecord<Events>()` for type safety
- Functions directory structure: `src/lib/inngest/functions/`

**Total Tests:** 75 passing, 2 skipped (77 total)

### File List

**Created:**
- src/lib/inngest/client.ts
- src/lib/inngest/functions/test.ts
- src/lib/inngest/functions/index.ts
- src/app/api/inngest/route.ts
- tests/inngest.test.ts

**Modified:**
- src/env.js (added INNGEST_EVENT_KEY, INNGEST_SIGNING_KEY)
- .env.example (added Inngest configuration)
- .env (added Inngest configuration comments)
- vitest.config.ts (added path alias resolution)
