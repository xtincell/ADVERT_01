# Story 1.7: Configure Resend Email Service and Vercel Blob Storage

## Story

As a **developer**,
I want **Resend email service and Vercel Blob file storage configured**,
So that **I can send transactional emails and store user-uploaded files**.

## Status

✅ Complete

## Acceptance Criteria

1. **AC1: Resend Package Installation**
   - Install `resend` npm package
   - Latest stable version in package.json

2. **AC2: Resend Client Configuration**
   - Create email client at `src/lib/email/client.ts`
   - Export configured Resend instance
   - Use RESEND_API_KEY from environment variables

3. **AC3: React Email Components**
   - Install `@react-email/components`
   - Create test email template at `src/lib/email/templates/test.tsx`
   - Type-safe templates with TypeScript

4. **AC4: Resend Environment Variables**
   - RESEND_API_KEY configured
   - RESEND_FROM_EMAIL configured
   - .env.example documented

5. **AC5: Vercel Blob Package Installation**
   - Install `@vercel/blob` package
   - Latest stable version in package.json

6. **AC6: Vercel Blob Client Configuration**
   - Create blob client at `src/lib/storage/blob.ts`
   - Export helper functions for upload, download, delete
   - Use BLOB_READ_WRITE_TOKEN from environment variables

7. **AC7: Test Upload Route**
   - Create `/api/upload-test` route
   - Accept file upload via FormData
   - Return blob URL

## Technical Notes

- Resend provides transactional email with React Email templating
- Vercel Blob is serverless file storage with CDN
- Both services have free tiers sufficient for MVP
- Environment variables are optional for local development

## Tasks

- [x] Task 1: Install resend and @react-email/components packages
- [x] Task 2: Create email client at src/lib/email/client.ts
- [x] Task 3: Create test email template
- [x] Task 4: Install @vercel/blob package
- [x] Task 5: Create blob storage utilities
- [x] Task 6: Create test upload route
- [x] Task 7: Add environment variables
- [x] Task 8: Write tests

## Dev Agent Record

### Agent Model Used

Claude Opus 4.5 (claude-opus-4-5-20251101)

### Completion Notes

✅ **Resend Email Service**
- Installed `resend` and `@react-email/components` packages
- Created email client at `src/lib/email/client.ts`
- Exports: getResendClient(), isEmailConfigured(), sendEmail(), sendHtmlEmail()
- fromEmail from RESEND_FROM_EMAIL env var

✅ **React Email Templates**
- Created templates directory at `src/lib/email/templates/`
- TestEmail template with React Email components
- Type-safe props with TypeScript interfaces
- Uses Html, Body, Container, Heading, Text, Link components

✅ **Vercel Blob Storage**
- Installed `@vercel/blob` package
- Created blob utilities at `src/lib/storage/blob.ts`
- Exports: uploadFile(), deleteFile(), deleteFiles(), getFileMetadata(), listFiles()
- Helper: generateUniqueFilename() for unique file naming
- Configuration check: isBlobConfigured()

✅ **Test Upload Route**
- Created `/api/upload-test` route
- GET: Check if blob storage is configured
- POST: Upload file via FormData
- DELETE: Delete file by URL
- Supports optional folder parameter via query string

✅ **Environment Variables**
- RESEND_API_KEY for Resend authentication
- RESEND_FROM_EMAIL for default sender
- BLOB_READ_WRITE_TOKEN for Vercel Blob
- All variables optional for local development
- Updated .env.example with documentation

✅ **Testing**
- 35 tests in tests/email-blob.test.ts (all passing)
- Tests for email client, templates, blob utilities
- Tests for upload route and environment configuration

**Technical Details:**
- Services only initialize when credentials configured
- ESLint disable for File/Blob globals in browser APIs
- Type-safe email sending with separate functions for React and HTML

**Total Tests:** 140 passing, 2 skipped (142 total)

### File List

**Created:**
- src/lib/email/client.ts
- src/lib/email/templates/test.tsx
- src/lib/email/templates/index.ts
- src/lib/storage/blob.ts
- src/app/api/upload-test/route.ts
- tests/email-blob.test.ts

**Modified:**
- src/env.js (Resend and Blob environment variables)
- .env.example (service documentation)
- package.json / package-lock.json (resend, @react-email/components, @vercel/blob)
