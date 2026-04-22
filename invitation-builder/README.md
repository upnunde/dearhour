This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Auth + DB Setup (Supabase + Prisma)

1. Copy env template

```bash
cp .env.example .env.local
```

2. Fill these values in `.env.local`

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `DATABASE_URL`
- `DIRECT_URL`

3. Generate Prisma client

```bash
DATABASE_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" DIRECT_URL="postgresql://placeholder:placeholder@localhost:5432/placeholder" npx prisma generate
```

4. Create database tables

```bash
npx prisma db push
```

5. Configure Supabase Auth providers (Google/Kakao/Apple), then set callback URL to:

`<APP_URL>/auth/callback`

### Kakao login (Kakao Developers + Supabase)

앱 라우트는 이미 `/auth/oauth?provider=kakao` → Supabase `signInWithOAuth({ provider: "kakao" })` 로 연결되어 있습니다. **카카오 개발자 콘솔과 Supabase에서 아래만 맞추면 됩니다.**

1. [Kakao Developers](https://developers.kakao.com) → 내 애플리케이션 → (앱 선택 또는 생성)
2. **제품 설정 → 카카오 로그인** 활성화
3. **카카오 로그인 → Redirect URI** 에 다음을 등록 (Supabase가 구글과 동일하게 OAuth를 받는 주소입니다):

   `https://<SUPABASE_PROJECT_REF>.supabase.co/auth/v1/callback`

   `<SUPABASE_PROJECT_REF>` 는 Supabase 대시보드 URL(`https://xxxxx.supabase.co`)의 `xxxxx` 와 같습니다.

4. **앱 키**: REST API 키를 Supabase Kakao 제공자의 **Client ID** 로 사용합니다. **Client Secret** 은 카카오 로그인 보안에서 발급·활성화한 값을 Supabase에 넣습니다(카카오 콘솔 안내에 따름).
5. [Supabase Dashboard](https://supabase.com/dashboard) → **Authentication → Providers → Kakao** → Enable 후 Client ID / Secret 저장
6. Supabase **Authentication → URL Configuration** 의 Redirect URLs 에 앱 콜백이 이미 있다면 유지: `https://<your-domain>/auth/callback` (로컬은 `http://localhost:3000/auth/callback` 등 실제 origin)

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
