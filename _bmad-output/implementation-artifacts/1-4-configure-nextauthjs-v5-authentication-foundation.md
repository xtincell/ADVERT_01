# Story 1.4: Configure NextAuth.js v5 Authentication Foundation

## Story

As a **developer**,
I want **NextAuth.js v5 configured with email/password authentication and Prisma adapter**,
So that **users can register and login with foundational auth infrastructure ready**.

## Status

🔄 In Progress

## Acceptance Criteria

1. **AC1: Auth Configuration Export**
   - NextAuth.js v5 config at `src/server/auth.ts`
   - Exports `auth`, `signIn`, `signOut`, `handlers` for App Router
   - Configures Prisma adapter for session/account storage

2. **AC2: Credentials Provider**
   - Accepts email and password
   - Validates credentials against User model in database
   - Passwords compared using bcrypt

3. **AC3: JWT Session Strategy**
   - Session strategy set to "jwt"
   - JWT secret from NEXTAUTH_SECRET environment variable
   - Session maxAge set to 24 hours (86400 seconds)

4. **AC4: Auth API Route**
   - Route at `src/app/api/auth/[...nextauth]/route.ts`
   - Exports GET and POST handlers
   - Handles signin, signout, callback, session routes

5. **AC5: Custom Pages Configuration**
   - `pages.signIn` set to `/login`
   - `pages.error` set to `/auth/error`
   - `pages.signOut` set to `/logout`

6. **AC6: JWT Callback**
   - Adds user.id, user.tenantId, user.role to JWT token
   - Tenant context available in all authenticated requests

7. **AC7: Session Callback**
   - Session includes user.id, user.email, user.tenantId, user.role
   - Data accessible via `auth()` in Server Components

## Technical Notes

- NextAuth v5 uses new App Router pattern
- Prisma adapter already installed: @auth/prisma-adapter
- Add bcrypt for password hashing
- Create TypeScript types for extended session/JWT
- Add passwordHash field to User model

## Tasks

- [ ] Task 1: Add passwordHash field to User model
- [ ] Task 2: Install bcrypt for password hashing
- [ ] Task 3: Create auth configuration at src/server/auth.ts
- [ ] Task 4: Configure Credentials provider with validation
- [ ] Task 5: Configure JWT and session callbacks with tenant data
- [ ] Task 6: Set up custom auth pages configuration
- [ ] Task 7: Create TypeScript type declarations for extended session
- [ ] Task 8: Write tests for auth configuration

## Dev Notes

- Use bcrypt for password hashing (industry standard)
- JWT tokens include tenantId for RLS middleware integration
- Credentials provider validates against User model with passwordHash
- Session extends default to include tenantId and role

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20250929)

### Completion Notes

✅ **NextAuth.js v5 Configuration Complete**
- Updated src/server/auth/config.ts with Credentials provider
- JWT session strategy with 24-hour maxAge
- Prisma adapter for user storage (separate client without RLS)
- Custom pages configuration for login/logout/error

✅ **Credentials Provider Implemented**
- Accepts email and password
- Validates against User model with passwordHash
- bcrypt for secure password comparison
- Returns user with tenantId and role

✅ **JWT and Session Callbacks**
- JWT callback adds user.id, tenantId, role to token
- Session callback exposes tenantId and role to client
- TypeScript type declarations for extended Session/JWT

✅ **Database Schema Updated**
- Added passwordHash field to User model (optional for OAuth users)
- Migration: 20260205160145_add_password_hash

✅ **Testing**
- 12 auth tests (10 passing, 2 skipped for Next.js runtime)
- Password hashing verification
- User model with auth fields
- Credentials validation logic

**Technical Details:**
- Uses separate PrismaClient in auth config (no RLS) for cross-tenant auth queries
- bcrypt with 10 salt rounds for password hashing
- Type-safe session/JWT with tenantId and role

**Total Tests:** 57 passing, 2 skipped (59 total)

### File List

**Created:**
- tests/auth.test.ts (12 tests)
- prisma/migrations/20260205160145_add_password_hash/

**Modified:**
- src/server/auth/config.ts (complete rewrite for credentials auth)
- prisma/schema.prisma (added passwordHash field)
- src/env.js (fixed DATABASE_URL validation for SQLite)
- src/server/api/routers/post.ts (removed Post model references)
- src/server/db/middleware.ts (fixed TypeScript typing issues)
