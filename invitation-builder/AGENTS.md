# Agent Working Policy

## Git Push Default Behavior

- When the user requests commit/push or finishing work, execute `git push` without asking for confirmation first.
- If push fails, immediately report the exact error and the missing prerequisite (for example, missing remote/auth).
- Do not block push execution behind additional confirmation prompts.

## Fixed Repository and Deployment Targets

- Git repository URL (fixed): `https://github.com/upnunde/dearhour.git`
- Vercel project URL (fixed): `https://vercel.com/upnunde-4567s-projects/dearhour`
- Treat the two URLs above as canonical defaults unless the user explicitly changes them.

## Global Scope

- This policy applies to all product areas and shared modules, including login/auth, payment, maps/location, editor, preview, and APIs.

## Completed External Integrations (Do Not Re-Ask)

Once an external integration is marked Completed here, do NOT ask the user to re-confirm credentials, URLs, provider choice, or wiring. Reuse the existing setup, and only flag issues if the integration actually fails at runtime.

| Area | Provider | Status | Notes |
| --- | --- | --- | --- |
| Simple login (social/OAuth) | Supabase Auth (Google, Kakao) | Completed | 시작: `app/login/page.tsx` → `app/auth/oauth/route.ts` (`provider=google` \| `kakao`) → 콜백 `app/auth/callback/route.ts`; 세션: `lib/supabase/middleware.ts`, `middleware.ts`. 카카오는 Kakao Developers Redirect URI 로 `https://<ref>.supabase.co/auth/v1/callback` 필수. |
| Auth session API | Supabase | Completed | `app/api/auth/me/route.ts`, `app/api/auth/logout/route.ts` |
| Admin login | Supabase | Completed | `app/admin/login/admin-login-form.tsx`, `app/admin/page.tsx` |
| Database | Supabase Postgres (via Prisma) | Completed | Env: `DATABASE_URL`, `DIRECT_URL`; schema: `prisma/schema.prisma` |
| Maps (static preview) | Naver Cloud Platform Maps | Completed | `app/api/naver-map-preview/route.ts`, `lib/naver-maps-credentials.ts` |
| Geocoding | Naver Cloud Platform Geocoding | Completed | `app/api/geocode/route.ts` |
| Address search | Domestic address API | Completed | `app/api/address-search/route.ts`, `components/AddressSearchDialog.tsx` |

## External Integration Policy (All Future Integrations)

Any external/third-party integration — including but not limited to additional login providers, payment (e.g. Toss/PortOne/Kakao Pay), messaging, analytics, storage, and maps — MUST be managed through this policy document.

Rules:

1. Source of truth: Every integration (provider, status, related files, env vars) must be registered in the "Completed External Integrations" table above once wired up.
2. No re-confirmation: If an integration already exists in the table with Completed status, do not ask the user about provider choice, keys, or basic setup.
3. Update on change: When an integration is added, swapped, or removed, update the table in the same change set as the code.
4. Env vars: All required environment variable names for each integration must be reflected in `.env.example` and referenced in the table's Notes column.
5. Failure handling: If an integration fails at runtime, report the exact error and the specific missing prerequisite; do not fall back to generic "please set this up" prompts when the table shows it is Completed.
6. Scope: This policy is global and applies across login/auth, payment, maps/location, messaging, storage, analytics, editor, preview, and APIs.

