# Story 1.1: Initialize T3 Stack Project Foundation

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a **developer**,
I want **the T3 Stack project initialized with all core dependencies configured**,
So that **I have a type-safe, modern foundation ready for feature implementation**.

## Acceptance Criteria

### AC1: T3 Stack Initialization
**Given** I have Node.js 20+ and npm installed
**When** I run the T3 Stack initialization command
**Then** the project is created with Next.js 15, TypeScript 5.6+, tRPC v11, Prisma, NextAuth.js v5, and Tailwind CSS
**And** all dependencies are installed without errors
**And** the TypeScript configuration uses strict mode
**And** ESLint and Prettier are configured for consistent code style
**And** the project structure follows T3 Stack conventions (src/app, src/server, src/lib)
**And** `npm run dev` starts the development server successfully on localhost:3000
**And** the default Next.js 15 App Router homepage loads without errors

### AC2: Production Build Verification
**Given** the project is initialized
**When** I run `npm run build`
**Then** the production build completes successfully without type errors
**And** the build output is optimized for deployment

### AC3: Dependencies Verification
**Given** the project is initialized
**When** I inspect the package.json
**Then** it includes all required dependencies:
- next@^15.0.0
- react@^19.0.0
- typescript@^5.6.0
- @trpc/server@^11.0.0
- @trpc/client@^11.0.0
- @trpc/next@^11.0.0
- @prisma/client@latest
- next-auth@^5.0.0
- tailwindcss@^4.0.0
- zod@latest (for validation)

### AC4: Git Repository Setup
**Given** the project is initialized
**When** I check the Git repository
**Then** the initial commit includes all files with message "Initial commit: T3 Stack foundation"
**And** `.gitignore` excludes node_modules, .env files, and build artifacts

## Tasks / Subtasks

- [x] Task 1: Initialize T3 Stack project with create-t3-app (AC: #1, #3)
  - [x] Run `npm create t3-app@latest` with project name "advert_01"
  - [x] Select all T3 Stack options: Next.js, tRPC, Prisma, NextAuth.js, Tailwind CSS
  - [x] Verify TypeScript strict mode is enabled in tsconfig.json
  - [x] Verify all dependencies are installed correctly
  - [x] Verify project structure follows T3 conventions (src/app, src/server, src/lib)

- [x] Task 2: Configure ESLint and Prettier (AC: #1)
  - [x] Verify ESLint configuration from T3 Stack is present
  - [x] Add Prettier configuration for consistent formatting
  - [x] Add format and lint scripts to package.json
  - [x] Run lint to ensure no errors in initial codebase

- [ ] Task 3: Verify development server functionality (AC: #1)
  - [ ] Start dev server with `npm run dev`
  - [ ] Verify server runs on localhost:3000
  - [ ] Navigate to homepage and verify Next.js 15 App Router loads
  - [ ] Check browser console for any errors
  - [ ] Verify hot module replacement works

- [ ] Task 4: Verify production build (AC: #2)
  - [ ] Run `npm run build`
  - [ ] Verify build completes without TypeScript errors
  - [ ] Verify build output is optimized
  - [ ] Verify no warnings in build output

- [ ] Task 5: Initialize Git repository (AC: #4)
  - [ ] Initialize git with `git init` (if not already done by create-t3-app)
  - [ ] Verify .gitignore includes node_modules, .env*, .next, dist
  - [ ] Create initial commit with message "Initial commit: T3 Stack foundation"
  - [ ] Verify commit includes all project files

- [ ] Task 6: Create comprehensive tests
  - [ ] Write integration test for dev server startup
  - [ ] Write test for build process completion
  - [ ] Write test for TypeScript strict mode compliance
  - [ ] Verify all tests pass

## Dev Notes

### Architecture Alignment

**Framework:** T3 Stack v7.40.0 (create-t3-app)
- Latest version confirmed to support Next.js 15 + NextAuth v5 ([Source: create.t3.gg](https://create.t3.gg/en/installation))
- Installation command: `npm create t3-app@latest`

**Core Stack (from Architecture document):**
- **Next.js 15.5** with App Router (React Server Components)
- **React 19** (via Next.js 15)
- **TypeScript 5.6+** with strict mode
- **tRPC v11.x** for type-safe API
- **Prisma ORM v6.x** (configured in Story 1.2)
- **NextAuth.js v5 (Auth.js)** (configured in Story 1.4)
- **Tailwind CSS v4** utility-first CSS
- **Zod v3.x** for schema validation

[Source: /workspaces/ADVERT_01/_bmad-output/planning-artifacts/architecture.md - Technical Stack Selection]

### Project Structure (T3 Stack Conventions)

Expected folder structure after initialization:
```
advert_01/
├── src/
│   ├── app/              # Next.js 15 App Router (pages, layouts, route handlers)
│   ├── server/           # tRPC routers, procedures, database access
│   ├── lib/              # Shared utilities, configurations
│   └── styles/           # Global CSS, Tailwind config
├── prisma/               # Database schema (Story 1.2)
├── public/               # Static assets
├── .env                  # Environment variables (gitignored)
├── .env.example          # Example environment variables
├── next.config.js        # Next.js configuration
├── tailwind.config.ts    # Tailwind CSS configuration
├── tsconfig.json         # TypeScript configuration (strict mode)
└── package.json          # Dependencies and scripts
```

### Critical Technical Requirements

1. **Node.js Version:** 20+ required
   - T3 Stack requires Node.js 20 LTS minimum
   - Verify with `node --version` before initialization

2. **TypeScript Strict Mode:** MANDATORY
   - `tsconfig.json` must have `"strict": true`
   - Enforces type safety across entire codebase
   - Critical for LLM-driven development consistency

3. **Package Manager:** npm (default for T3 Stack)
   - Can use pnpm or yarn, but npm recommended for consistency
   - Installation command: `npm create t3-app@latest`

4. **T3 Stack Options Selection:**
   - ✅ Next.js (App Router)
   - ✅ tRPC
   - ✅ Prisma
   - ✅ NextAuth.js
   - ✅ Tailwind CSS
   - Select ALL options when prompted

### Testing Requirements

**Unit Tests:**
- Test TypeScript configuration compliance (strict mode enabled)
- Test package.json includes all required dependencies with correct version ranges

**Integration Tests:**
- Test dev server starts successfully on port 3000
- Test production build completes without errors
- Test homepage loads and renders without console errors

**Build Tests:**
- Verify `npm run build` exits with code 0
- Verify `.next` folder is created with optimized bundles
- Verify no TypeScript errors in build output

### Performance Considerations

- Initial bundle size should be minimal (T3 Stack is lean by design)
- Dev server should start in <10 seconds
- Production build should complete in <2 minutes
- Hot module replacement should reflect changes in <1 second

### Security Notes

- **.env files:** NEVER commit .env files (already in .gitignore)
- **.env.example:** Create template without sensitive values
- **Dependencies:** Use exact versions from architecture specification
- **Git hooks:** Consider adding pre-commit hooks for linting (optional, Story 1.8+)

### References

- [T3 Stack Documentation - Installation](https://create.t3.gg/en/installation)
- [Next.js 15 Documentation](https://nextjs.org/docs)
- [tRPC v11 Documentation](https://trpc.io/docs)
- [Source: /workspaces/ADVERT_01/_bmad-output/planning-artifacts/architecture.md#technical-stack-selection]
- [Source: /workspaces/ADVERT_01/_bmad-output/planning-artifacts/epics.md#story-1-1-lines-775-817]

### Implementation Commands

```bash
# Step 1: Initialize T3 Stack project
npm create t3-app@latest

# Project name: advert_01
# Select options: All (Next.js, tRPC, Prisma, NextAuth.js, Tailwind CSS)
# Package manager: npm
# Initialize Git: Yes

# Step 2: Navigate to project
cd advert_01

# Step 3: Verify installation
npm run dev
# Expected: Server starts on http://localhost:3000

# Step 4: Verify build
npm run build
# Expected: Build completes successfully

# Step 5: Verify TypeScript strict mode
cat tsconfig.json | grep strict
# Expected: "strict": true

# Step 6: Create initial commit (if not done by create-t3-app)
git add .
git commit -m "Initial commit: T3 Stack foundation"
```

### Known Issues & Workarounds

- **Issue:** create-t3-app may prompt for Git initialization
  - **Workaround:** Select "Yes" when prompted, or run `git init` manually after

- **Issue:** Tailwind CSS v4 may have breaking changes from v3
  - **Workaround:** Follow migration guide if T3 Stack includes v4

- **Issue:** NextAuth v5 has different configuration than v4
  - **Workaround:** Configuration will be handled in Story 1.4

### Dependencies Between Stories

**Blockers:** None (first story in Epic 1)

**Blocks:**
- Story 1.2 (Database configuration requires Prisma from T3 Stack)
- Story 1.3 (RLS middleware requires Prisma client)
- Story 1.4 (NextAuth configuration requires NextAuth.js package)
- All subsequent stories depend on this foundation

### Project Context

This is a **greenfield project** - no existing codebase.

**Project Type:** Full-Stack AI-Enhanced SaaS Platform

**Complexity:** HIGH / Enterprise-Grade
- Multi-tenancy with strict data isolation
- AI orchestration (streaming, explainability)
- RBAC with 4 roles
- GDPR + PCI DSS compliance requirements

[Source: /workspaces/ADVERT_01/_bmad-output/planning-artifacts/architecture.md#project-context-analysis]

## Dev Agent Record

### Agent Model Used

_To be filled by dev agent during implementation_

### Debug Log References

_To be filled by dev agent during implementation_

### Completion Notes List

_To be filled by dev agent during implementation_

### File List

_To be filled by dev agent as files are created/modified_
