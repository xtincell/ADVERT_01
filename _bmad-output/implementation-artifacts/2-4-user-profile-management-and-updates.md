# Story 2.4: User Profile Management and Updates

## Story

As an **authenticated user**,
I want **to view and update my profile information**,
So that **I can keep my account details current**.

## Status

✅ Complete

## Acceptance Criteria

1. **AC1: Profile Page** - `/settings/profile` with editable and read-only fields
2. **AC2: Editable Fields** - Full name (min 2 chars, letters/spaces/hyphens/apostrophes), Company name (optional)
3. **AC3: Read-Only Fields** - Email (with contact support note), Role (with explanation), Member since date
4. **AC4: Save/Cancel** - Save button enabled only with changes, Cancel resets form
5. **AC5: Session Refresh** - Updated name reflected in header immediately via session update
6. **AC6: Route Protection** - `/settings` routes protected by middleware
7. **AC7: Dashboard Link** - Settings link added to dashboard header

## Tasks

- [x] Task 1: Create user tRPC router with getProfile and updateProfile
- [x] Task 2: Register user router in app router
- [x] Task 3: Create profile settings page with form
- [x] Task 4: Add settings route protection to middleware and auth config
- [x] Task 5: Add settings link to dashboard header
- [x] Task 6: Write tests (37 tests)

## Dev Agent Record

### Agent Model Used

Claude Opus 4.6

### Completion Notes

Profile management page with:
- getProfile query fetches user + tenant data via protectedProcedure
- updateProfile mutation updates user name and tenant company name
- Form populated from query data with change tracking
- Session updated after save so name appears in header immediately
- Read-only fields: email (contact support), role (managed by owner), member since
- Validation: name 2-100 chars, letters/spaces/hyphens/apostrophes only
- Route protected via middleware and auth config authorized callback
- 312 tests passing, build succeeds

### File List

- `src/server/api/routers/user.ts` - User router with getProfile + updateProfile
- `src/server/api/root.ts` - Added user router
- `src/pages/settings/profile.tsx` - Profile settings page
- `src/pages/dashboard.tsx` - Added Settings link in header
- `src/middleware.ts` - Added /settings/:path* matcher
- `src/server/auth/config.ts` - Added /settings to protected paths
- `tests/profile.test.ts` - Profile tests (37 tests)
