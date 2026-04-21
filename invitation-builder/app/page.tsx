import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import { ClipboardList, ImageIcon, MonitorSmartphone } from "lucide-react";

const accentBtn =
  "inline-flex items-center justify-center rounded-lg bg-indigo-600 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-indigo-500 hover:shadow-md active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-600 focus-visible:ring-offset-2";

const accentBtnOutline =
  "inline-flex items-center justify-center rounded-lg border border-zinc-300 bg-white px-5 py-2.5 text-sm font-semibold text-zinc-900 shadow-sm transition hover:border-zinc-400 hover:bg-zinc-50 hover:shadow active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400 focus-visible:ring-offset-2";

const gatewayCardClass =
  "flex h-full flex-col rounded-2xl border border-zinc-200/80 bg-white p-6 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-zinc-300 hover:shadow-lg md:p-8";

export default function HomePage() {
  return (
    <>
      <AppHeader />
      <main className="min-h-[calc(100dvh-64px)] bg-zinc-50 text-zinc-900 antialiased">
        {/* 1. Hero */}
        <section className="border-b border-zinc-200/80 bg-white">
          <div className="mx-auto grid w-full max-w-6xl gap-10 px-4 py-12 md:grid-cols-2 md:items-center md:gap-12 md:px-6 lg:gap-16 lg:py-20">
            <div className="order-2 md:order-1">
              <p className="text-sm font-medium tracking-wide text-indigo-600">Dear Hour · 디어아워</p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900 md:text-4xl lg:text-[2.75rem] lg:leading-tight">
                PC와 모바일,
                <br className="hidden sm:block" />
                어디서든 끊김 없이 완벽하게.
              </h1>
              <p className="mt-5 text-base leading-relaxed text-zinc-600 md:text-lg">
                넓은 모니터로 편하게 디자인하고, 이동하는 지하철 안에서 스마트폰으로 즉시 텍스트를 수정하세요. 어떤 기기에서든 100% 반응형 에디터가
                지원됩니다.
              </p>
              <div className="mt-8">
                <Link href="/editor" className={accentBtn}>
                  지금 바로 무료로 시작하기
                </Link>
              </div>
            </div>

            {/* 노트북 + 스마트폰 목업 placeholder (크로스 플랫폼) */}
            <div className="order-1 md:order-2" aria-hidden="true">
              <div className="relative mx-auto w-full max-w-md md:max-w-lg">
                <div className="relative aspect-[16/10] w-full rounded-xl border border-zinc-200 bg-gradient-to-br from-zinc-50 to-zinc-200 shadow-md">
                  <div className="absolute inset-x-0 top-0 flex h-9 items-center gap-1.5 rounded-t-xl border-b border-zinc-200/80 bg-zinc-100/90 px-3">
                    <span className="size-2.5 rounded-full bg-zinc-300" />
                    <span className="size-2.5 rounded-full bg-zinc-300" />
                    <span className="size-2.5 rounded-full bg-zinc-300" />
                  </div>
                  <div className="flex h-full items-center justify-center pt-9 pb-4">
                    <p className="px-4 text-center text-sm font-medium text-zinc-400">노트북(PC) 화면 영역</p>
                  </div>
                </div>
                <div
                  className="absolute -bottom-1 right-0 z-10 flex w-[30%] max-w-[132px] flex-col rounded-[1.15rem] border border-zinc-300 bg-gradient-to-b from-white to-zinc-100 shadow-lg md:-right-2 md:max-w-[148px] lg:max-w-[156px]"
                  style={{ aspectRatio: "9 / 19" }}
                >
                  <div className="mx-auto mt-2 h-1 w-9 rounded-full bg-zinc-300" />
                  <div className="flex flex-1 flex-col items-center justify-center px-2 pb-6 pt-4">
                    <p className="text-center text-xs font-medium leading-snug text-zinc-400">스마트폰</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 2. 서비스 게이트웨이 */}
        <section className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6 md:py-20 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl">어떤 순간을 준비하고 계신가요?</h2>
            <p className="mt-3 text-sm text-zinc-600 md:text-base">행사에 맞는 공간으로 이동해 바로 제작을 시작하세요.</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3 md:gap-8">
            <article className={gatewayCardClass}>
              <h3 className="text-xl font-bold tracking-tight text-zinc-900 md:text-2xl">세상에서 가장 아름다운 시작</h3>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-zinc-600 md:text-base">
                스튜디오급 하이엔드 디자인, 커피 두 잔 값(8,900원)으로 완벽하게 끝내세요.
              </p>
              <div className="mt-8">
                <Link href="/editor" className={`${accentBtnOutline} w-full md:w-auto`}>
                  청첩장 무료로 만들어보기
                </Link>
              </div>
            </article>

            <article className={gatewayCardClass}>
              <h3 className="text-xl font-bold tracking-tight text-zinc-900 md:text-2xl">경황없는 순간, 가장 빠르고 정중하게</h3>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-zinc-600 md:text-base">
                노트북이 없어도 괜찮습니다. 장례식장에서 모바일로 5분 만에 즉각적인 조치가 가능합니다.
              </p>
              <div className="mt-8">
                <Link href="/obituary" className={`${accentBtnOutline} w-full md:w-auto`}>
                  부고장 빠르게 만들기
                </Link>
              </div>
            </article>

            <article className={gatewayCardClass}>
              <h3 className="text-xl font-bold tracking-tight text-zinc-900 md:text-2xl">우리 아이의 첫 번째 주인공 되는 날</h3>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-zinc-600 md:text-base">
                육아로 바쁜 엄마 아빠를 위해. 클릭 몇 번으로 완성되는 가장 사랑스러운 초대.
              </p>
              <div className="mt-8">
                <Link href="/first-birthday" className={`${accentBtnOutline} w-full md:w-auto`}>
                  돌잔치 초대장 만들기
                </Link>
              </div>
            </article>
          </div>
        </section>

        {/* 3. 코어 테크 */}
        <section className="border-y border-zinc-200/80 bg-white">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6 md:py-20 lg:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold text-indigo-600">Core</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-zinc-900 md:text-3xl">공통으로 담긴 기술력</h2>
              <p className="mt-3 text-sm text-zinc-600 md:text-base">한 번 만든 초대장이 모든 기기에서 동일한 품질로 전달됩니다.</p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
              <div className="flex flex-col items-center text-center md:items-start md:text-left">
                <div className="flex size-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <MonitorSmartphone className="size-6" aria-hidden />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-zinc-900">100% 완벽한 크로스 플랫폼</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 md:text-base">PC/모바일 실시간 동기화</p>
              </div>
              <div className="flex flex-col items-center text-center md:items-start md:text-left">
                <div className="flex size-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <ClipboardList className="size-6" aria-hidden />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-zinc-900">번거로운 취합은 그만</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 md:text-base">실시간 RSVP 및 원터치 계좌번호 복사</p>
              </div>
              <div className="flex flex-col items-center text-center md:items-start md:text-left">
                <div className="flex size-12 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
                  <ImageIcon className="size-6" aria-hidden />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-zinc-900">추억을 원본 그대로</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-600 md:text-base">하객들이 직접 올리는 20GB 무손실 갤러리</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. 하단 CTA + 푸터 */}
        <section className="bg-zinc-900 px-4 py-16 text-center text-white md:px-6 md:py-20">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">결혼 준비의 첫 단추, 디어아워와 가볍게 시작하세요.</h2>
            <div className="mt-8">
              <Link
                href="/editor"
                className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-zinc-900 shadow-sm transition hover:bg-zinc-100 hover:shadow-md active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-zinc-900"
              >
                무료로 체험해 보기
              </Link>
            </div>
          </div>
        </section>

        <footer className="border-t border-zinc-800 bg-zinc-950 px-4 py-8 text-center text-sm text-zinc-500 md:px-6">
          <p className="font-medium text-zinc-400">Dear Hour · 디어아워</p>
          <p className="mt-2">모바일 알림장 SaaS · 통합 메인 홈</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link href="/login" className="text-zinc-400 underline-offset-4 transition hover:text-white hover:underline">
              로그인
            </Link>
            <Link href="/editor" className="text-zinc-400 underline-offset-4 transition hover:text-white hover:underline">
              에디터
            </Link>
          </div>
          <p className="mt-6 text-xs text-zinc-600">© {new Date().getFullYear()} Dear Hour. All rights reserved.</p>
        </footer>
      </main>
    </>
  );
}
