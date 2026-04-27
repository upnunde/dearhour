# Agent Working Policy — DearHour (모바일 청첩장 서비스)

> 이 문서는 AI 에이전트(Claude, Cursor, Copilot 등)가 이 프로젝트에서 작업할 때 따라야 하는 정책과 코딩 기준을 정의합니다.

---

## 1. 프로젝트 개요

| 항목 | 값 |
|------|-----|
| **프로젝트명** | DearHour (dearhour) |
| **버전** | 0.2.0-dev |
| **설명** | 모바일 청첩장/초대장 빌더 서비스 |
| **기술 스택** | Next.js 16, React 19, TypeScript 5, Tailwind CSS 4, Prisma 6, Supabase, Zustand |

---

## 2. 고정 리포지토리 및 배포 대상

| 항목 | URL |
|------|-----|
| **Git Repository** | `https://github.com/upnunde/dearhour.git` |
| **Vercel Project** | `https://vercel.com/upnunde-4567s-projects/dearhour` |

위 URL은 기본값으로 간주하며, 사용자가 명시적으로 변경하지 않는 한 그대로 사용합니다.

---

## 3. Git 작업 정책

### 3.1 Push 기본 동작
- 사용자가 커밋/푸시 또는 작업 완료를 요청하면, **확인 없이 즉시 `git push` 실행**
- 푸시 실패 시 정확한 에러와 누락된 전제조건(예: remote/auth 누락)을 즉시 보고
- 추가 확인 프롬프트로 푸시 실행을 차단하지 않음

### 3.2 커밋 메시지 규칙
```
<type>(<scope>): <subject>

<body>
```

| Type | 설명 |
|------|------|
| `feat` | 새로운 기능 추가 |
| `fix` | 버그 수정 |
| `refactor` | 코드 리팩토링 (기능 변경 없음) |
| `style` | 코드 포맷팅, 세미콜론 누락 등 |
| `docs` | 문서 변경 |
| `chore` | 빌드, 패키지 매니저 설정 등 |
| `perf` | 성능 개선 |

**예시:**
```
feat(mypage): 마이페이지 IA 2-depth 구조로 리팩토링

- Depth 1: 계정 메인 (제작관리, 나의정보, 결제, 고객지원)
- Depth 2: 개별 청첩장 관리 대시보드
- URL 기반 라우팅 구현 (/mypage?menu=...&sub=...)
```

### 3.3 브랜치 전략
- `main`: 프로덕션 브랜치
- `feature/*`: 기능 개발
- `fix/*`: 버그 수정
- `refactor/*`: 리팩토링

---

## 4. 폴더 구조 및 아키텍처

```
invitation-builder/
├── app/                    # Next.js App Router
│   ├── api/               # API Routes
│   ├── admin/             # 관리자 페이지
│   ├── auth/              # 인증 관련 라우트
│   ├── editor/            # 에디터 페이지
│   ├── login/             # 로그인 페이지
│   ├── mypage/            # 마이페이지
│   ├── payment/           # 결제 페이지
│   ├── preview/           # 청첩장 미리보기
│   ├── layout.tsx         # 루트 레이아웃
│   ├── page.tsx           # 홈페이지
│   └── globals.css        # 전역 스타일
├── components/            # 공유 컴포넌트
├── features/              # 기능별 모듈 (Feature-Sliced Design)
│   └── invitation-builder/
│       ├── model/         # 타입, 기본값, 설정
│       ├── panels/        # 편집 패널 컴포넌트
│       ├── preview/       # 프리뷰 컴포넌트
│       └── services/      # API 클라이언트
├── lib/                   # 유틸리티, 헬퍼 함수
│   ├── supabase/          # Supabase 클라이언트
│   ├── payments/          # 결제 관련 유틸
│   └── *.ts               # 기타 유틸리티
├── store/                 # Zustand 스토어
├── prisma/                # Prisma 스키마 및 마이그레이션
├── public/                # 정적 파일
└── scripts/               # 유틸리티 스크립트
```

### 4.1 파일 배치 원칙

| 파일 유형 | 위치 | 규칙 |
|----------|------|------|
| 페이지 컴포넌트 | `app/[route]/page.tsx` | 서버 컴포넌트 기본 |
| 클라이언트 컴포넌트 | `app/[route]/*-client.tsx` | `"use client"` 명시 |
| API 라우트 | `app/api/[endpoint]/route.ts` | HTTP 메서드별 export |
| 공유 컴포넌트 | `components/` | 2개 이상 페이지에서 사용 |
| 기능 전용 컴포넌트 | `features/[feature]/` | 해당 기능에서만 사용 |
| 유틸리티 함수 | `lib/` | 순수 함수 우선 |
| 전역 상태 | `store/` | Zustand 스토어 |

---

## 5. TypeScript 규칙

### 5.1 타입 정의
```typescript
// ✅ 좋은 예: 명시적 타입 정의
interface InvitationCardData {
  id: string;
  title: string;
  content: InvitationContent;
  status: "draft" | "paid" | "published";
  createdAt: Date;
}

// ❌ 나쁜 예: any 사용
const data: any = fetchData();
```

### 5.2 타입 vs 인터페이스
- **Interface**: 객체 형태, 확장 가능한 타입에 사용
- **Type**: 유니온, 인터섹션, 유틸리티 타입에 사용

```typescript
// Interface: 확장 가능한 객체 구조
interface BaseInvitation {
  id: string;
  title: string;
}

interface WeddingInvitation extends BaseInvitation {
  groomName: string;
  brideName: string;
}

// Type: 유니온, 리터럴 타입
type InvitationStatus = "draft" | "paid" | "published";
type InvitationSide = "groom" | "bride";
```

### 5.3 Null/Undefined 처리
```typescript
// ✅ Optional chaining 사용
const userName = user?.profile?.name ?? "익명";

// ✅ 타입 가드 사용
function isValidInvitation(inv: unknown): inv is InvitationCardData {
  return typeof inv === "object" && inv !== null && "id" in inv;
}
```

### 5.4 금지 사항
- `any` 타입 사용 금지 (불가피한 경우 `unknown` 사용 후 타입 가드)
- `// @ts-ignore` 사용 금지 (반드시 타입 문제 해결)
- Non-null assertion (`!`) 남용 금지

---

## 6. React 컴포넌트 규칙

### 6.1 컴포넌트 선언
```typescript
// ✅ 함수 선언문 + Props 타입 분리
interface MyComponentProps {
  title: string;
  children: React.ReactNode;
  onAction?: () => void;
}

export function MyComponent({ title, children, onAction }: MyComponentProps) {
  return (
    <div>
      <h1>{title}</h1>
      {children}
    </div>
  );
}
```

### 6.2 Server vs Client 컴포넌트

| 구분 | Server Component | Client Component |
|------|------------------|------------------|
| 기본값 | ✅ 기본 | `"use client"` 필요 |
| 데이터 페칭 | `async/await` 직접 사용 | `useEffect` 또는 SWR |
| 사용 시점 | 정적 콘텐츠, SEO | 인터랙션, 상태, 브라우저 API |
| 훅 사용 | ❌ 불가 | ✅ 가능 |

```typescript
// Server Component (기본)
// app/mypage/page.tsx
export default async function MyPage() {
  const data = await prisma.invitation.findMany();
  return <MyPageClient invitations={data} />;
}

// Client Component
// app/mypage/mypage-client.tsx
"use client";

import { useState } from "react";

export function MyPageClient({ invitations }: Props) {
  const [selected, setSelected] = useState<string | null>(null);
  // ...
}
```

### 6.3 훅 사용 규칙
```typescript
// ✅ 의존성 배열 완전하게 명시
const memoizedValue = useMemo(() => computeExpensive(a, b), [a, b]);

// ✅ useCallback으로 함수 메모이제이션
const handleClick = useCallback(() => {
  doSomething(id);
}, [id]);

// ✅ 커스텀 훅은 use 접두사
function useInvitationData(id: string) {
  const [data, setData] = useState<Invitation | null>(null);
  // ...
  return { data, isLoading };
}
```

### 6.4 이벤트 핸들러 네이밍
```typescript
// 핸들러 함수: handle + 동작
const handleSubmit = () => { ... };
const handleInputChange = () => { ... };

// Props로 전달: on + 동작
<Button onClick={handleSubmit} />
<Input onChange={handleInputChange} />
```

---

## 7. Next.js App Router 규칙

### 7.1 라우트 파일 구조
```
app/
├── page.tsx              # 홈 (/)
├── layout.tsx            # 루트 레이아웃
├── mypage/
│   ├── page.tsx          # /mypage (서버 컴포넌트)
│   └── mypage-client.tsx # 클라이언트 로직 분리
├── preview/
│   └── [invitationId]/
│       └── page.tsx      # /preview/:invitationId
└── api/
    └── invitations/
        ├── route.ts      # GET /api/invitations
        └── [id]/
            └── route.ts  # GET/PATCH/DELETE /api/invitations/:id
```

### 7.2 API Route 작성
```typescript
// app/api/invitations/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// GET /api/invitations
export async function GET(request: NextRequest) {
  try {
    const invitations = await prisma.invitation.findMany();
    return NextResponse.json(invitations);
  } catch (error) {
    console.error("[GET /api/invitations]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST /api/invitations
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // 유효성 검사
    if (!body.title) {
      return NextResponse.json(
        { error: "Title is required" },
        { status: 400 }
      );
    }
    const invitation = await prisma.invitation.create({ data: body });
    return NextResponse.json(invitation, { status: 201 });
  } catch (error) {
    console.error("[POST /api/invitations]", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
```

### 7.3 동적 라우트 파라미터
```typescript
// app/api/invitations/[id]/route.ts
interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  const { id } = await params;
  // ...
}
```

---

## 8. Tailwind CSS 규칙

### 8.1 클래스 순서 (권장)
1. 레이아웃 (display, position, flex, grid)
2. 박스 모델 (width, height, margin, padding)
3. 타이포그래피 (font, text, leading)
4. 색상 (background, color, border)
5. 효과 (shadow, opacity, transition)

```tsx
// ✅ 일관된 순서
<div className="flex flex-col items-center w-full max-w-md p-6 text-center bg-white rounded-2xl border border-gray-200 shadow-sm">
```

### 8.2 반응형 디자인
```tsx
// 모바일 퍼스트 접근
<div className="px-4 md:px-6 lg:px-8">
  <h1 className="text-xl md:text-2xl lg:text-3xl">
```

### 8.3 커스텀 값
```tsx
// Tailwind 기본 클래스 우선 사용
<div className="p-4">  // ✅ 기본 클래스

// 특수한 경우에만 arbitrary value
<div className="p-[18px]">  // ⚠️ 필요한 경우에만
```

### 8.4 색상 사용
```tsx
// 프로젝트 색상 팔레트 사용
<div className="bg-gray-50 text-gray-900">      // 배경, 텍스트
<div className="border-gray-200">               // 테두리
<button className="bg-black text-white">        // 주요 버튼
<button className="bg-gray-100 text-gray-700">  // 보조 버튼
```

---

## 9. 상태 관리 (Zustand)

### 9.1 스토어 정의
```typescript
// store/invitation-store.ts
import { create } from "zustand";

interface InvitationState {
  cardData: InvitationCardData;
  isDirty: boolean;
  setCardData: (data: Partial<InvitationCardData>) => void;
  resetCardData: () => void;
}

export const useInvitationStore = create<InvitationState>((set) => ({
  cardData: defaultCardData,
  isDirty: false,
  setCardData: (data) =>
    set((state) => ({
      cardData: { ...state.cardData, ...data },
      isDirty: true,
    })),
  resetCardData: () =>
    set({ cardData: defaultCardData, isDirty: false }),
}));
```

### 9.2 사용 규칙
- 전역 상태는 Zustand 스토어 사용
- 로컬 상태는 `useState` 사용
- 서버 상태는 서버 컴포넌트에서 직접 페칭

---

## 10. 데이터베이스 (Prisma)

### 10.1 스키마 규칙
```prisma
// prisma/schema.prisma

model Invitation {
  id          String   @id @default(cuid())
  userId      String
  title       String
  content     Json
  status      String   @default("draft")
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt

  // Relations
  user        User     @relation(fields: [userId], references: [id])
  rsvpSubmissions RsvpSubmission[]

  @@index([userId])
}
```

### 10.2 마이그레이션 실행
```bash
# 개발 환경 - 스키마 직접 푸시
set -a && . ./.env.local && set +a && npx prisma db push

# 프로덕션 환경 - 마이그레이션 생성 및 적용
set -a && . ./.env.local && set +a && npx prisma migrate dev --name add_rsvp_table
```

### 10.3 쿼리 작성
```typescript
// ✅ select로 필요한 필드만 조회
const invitations = await prisma.invitation.findMany({
  where: { userId },
  select: {
    id: true,
    title: true,
    status: true,
    createdAt: true,
  },
  orderBy: { createdAt: "desc" },
});

// ✅ 트랜잭션 사용
await prisma.$transaction([
  prisma.invitation.update({ where: { id }, data: { status: "paid" } }),
  prisma.payment.create({ data: paymentData }),
]);
```

---

## 11. 인증 (Supabase Auth)

### 11.1 클라이언트 사용
```typescript
// lib/supabase/client.ts - 클라이언트 사이드
import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// lib/supabase/server.ts - 서버 사이드
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function createClient() {
  const cookieStore = await cookies();
  return createServerClient(/* ... */);
}
```

### 11.2 인증 상태 확인
```typescript
// 서버 컴포넌트에서
const supabase = await createClient();
const { data: { user } } = await supabase.auth.getUser();

if (!user) {
  redirect("/login");
}
```

---

## 12. 에러 처리

### 12.1 API 에러 응답
```typescript
// 표준 에러 응답 형식
interface ApiError {
  error: string;
  code?: string;
  details?: unknown;
}

// 에러 응답 헬퍼
function errorResponse(message: string, status: number, code?: string) {
  return NextResponse.json({ error: message, code }, { status });
}

// 사용 예
if (!user) {
  return errorResponse("Unauthorized", 401, "AUTH_REQUIRED");
}
```

### 12.2 클라이언트 에러 처리
```typescript
// ✅ try-catch와 사용자 친화적 메시지
try {
  const res = await fetch("/api/invitations", { method: "POST", body });
  if (!res.ok) {
    const { error } = await res.json();
    throw new Error(error || "저장에 실패했습니다.");
  }
} catch (error) {
  alert(error instanceof Error ? error.message : "오류가 발생했습니다.");
}
```

---

## 13. 보안 가이드라인

### 13.1 필수 검증
- **인증**: 보호된 API는 반드시 사용자 인증 확인
- **권한**: 리소스 접근 시 소유자 확인 (`invitation.userId === user.id`)
- **입력**: 모든 사용자 입력 유효성 검사

### 13.2 환경 변수
```bash
# 클라이언트 노출 가능 (NEXT_PUBLIC_ 접두사)
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...

# 서버 전용 (접두사 없음)
DATABASE_URL=...
TOSS_PAYMENTS_WIDGET_SECRET_KEY=...
```

### 13.3 Rate Limiting
```typescript
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: NextRequest) {
  const ip = request.headers.get("x-forwarded-for") ?? "unknown";
  const allowed = checkRateLimit(`rsvp:${ip}`, 30, 60_000); // 분당 30회
  
  if (!allowed) {
    return NextResponse.json(
      { error: "Too many requests" },
      { status: 429 }
    );
  }
  // ...
}
```

---

## 14. 성능 최적화

### 14.1 이미지 최적화
```tsx
import Image from "next/image";

// ✅ Next.js Image 컴포넌트 사용
<Image
  src="/hero.jpg"
  alt="Hero image"
  width={800}
  height={600}
  priority  // LCP 이미지에 사용
/>
```

### 14.2 코드 분할
```tsx
// 동적 import로 번들 분할
const HeavyComponent = dynamic(() => import("./HeavyComponent"), {
  loading: () => <Skeleton />,
});
```

### 14.3 메모이제이션
```tsx
// 비용이 큰 계산에 useMemo
const filteredItems = useMemo(
  () => items.filter((item) => item.status === filter),
  [items, filter]
);

// 콜백 함수에 useCallback
const handleSort = useCallback((key: string) => {
  setSortKey(key);
}, []);
```

---

## 15. 완료된 외부 연동 (재확인 금지)

아래 테이블에 `Completed`로 표시된 연동은 **재확인하지 않습니다**. 기존 설정을 재사용하고, 런타임에서 실제로 실패하는 경우에만 문제를 보고합니다.

| 영역 | 제공자 | 상태 | 비고 |
|------|--------|------|------|
| 소셜 로그인 | Supabase Auth (Google, Kakao) | Completed | `app/login/page.tsx` → `app/auth/oauth/route.ts` → `app/auth/callback/route.ts` |
| 인증 세션 API | Supabase | Completed | `app/api/auth/me/route.ts`, `app/api/auth/logout/route.ts` |
| 관리자 로그인 | Supabase | Completed | `app/admin/login/admin-login-form.tsx` |
| 데이터베이스 | Supabase Postgres (Prisma) | Completed | Env: `DATABASE_URL`, `DIRECT_URL` |
| 지도 (정적 프리뷰) | Naver Cloud Platform Maps | Completed | `app/api/naver-map-preview/route.ts` |
| 지오코딩 | Naver Cloud Platform Geocoding | Completed | `app/api/geocode/route.ts` |
| 주소 검색 | 국내 주소 API | Completed | `app/api/address-search/route.ts` |
| 결제 | Toss Payments (결제위젯 v2) | Completed | `app/payment/page.tsx`, `app/api/payments/toss/*/route.ts` |

---

## 16. 외부 연동 정책 (향후 연동)

모든 외부/서드파티 연동은 이 정책 문서를 통해 관리합니다.

### 규칙:
1. **진실의 원천**: 모든 연동은 위 테이블에 등록해야 함
2. **재확인 금지**: `Completed` 상태의 연동은 재확인하지 않음
3. **변경 시 업데이트**: 연동 추가/변경/제거 시 같은 변경 세트에서 테이블 업데이트
4. **환경 변수**: 필요한 환경 변수는 `.env.example`에 반영
5. **실패 처리**: 런타임 실패 시 정확한 에러와 누락된 전제조건 보고

---

## 17. 코드 품질 체크리스트

### PR 생성 전 확인사항:
- [ ] `npm run lint` 통과
- [ ] `npm run build` 성공
- [ ] TypeScript 에러 없음
- [ ] 새로운 환경 변수는 `.env.example`에 추가
- [ ] 새로운 외부 연동은 이 문서의 테이블에 추가
- [ ] 콘솔 로그 제거 (디버깅용 `console.log`)
- [ ] 하드코딩된 값 상수화

### 금지사항:
- `any` 타입 사용
- `// @ts-ignore` 주석
- 인라인 스타일 (Tailwind 클래스 사용)
- 미사용 import/변수
- 중복 코드 (DRY 원칙)

---

## 18. 문서 업데이트 정책

이 `AGENTS.md` 문서는 다음 상황에서 업데이트해야 합니다:

1. 새로운 외부 연동 추가/변경/제거
2. 프로젝트 아키텍처 변경
3. 새로운 코딩 컨벤션 도입
4. 기존 정책의 수정

**마지막 업데이트**: 2026-04-27
