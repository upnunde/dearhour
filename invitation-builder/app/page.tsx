import Link from "next/link";
import AppHeader from "@/components/AppHeader";
import { ClipboardList, ImageIcon, MonitorSmartphone } from "lucide-react";

const accentBtn =
  "inline-flex items-center justify-center rounded-lg bg-amber-700 px-6 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-amber-600 hover:shadow-md active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2";

const accentBtnOutline =
  "inline-flex items-center justify-center rounded-lg border border-stone-300 bg-white px-5 py-2.5 text-sm font-semibold text-stone-800 shadow-sm transition hover:-translate-y-0.5 hover:border-stone-400 hover:bg-stone-50 hover:shadow-md active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-amber-700 focus-visible:ring-offset-2";

const gatewayCardClass =
  "flex h-full flex-col rounded-2xl border border-stone-200 bg-white/90 p-6 shadow-sm backdrop-blur-sm transition duration-300 hover:-translate-y-1 hover:border-stone-300 hover:shadow-xl md:p-8";

export default function HomePage() {
  return (
    <>
      <AppHeader />
      <main className="min-h-[calc(100dvh-64px)] bg-stone-50 text-stone-900 antialiased">
        {/* 1. Hero */}
        <section className="border-b border-stone-200 bg-gradient-to-b from-amber-50/80 via-stone-50 to-stone-100/40">
          <div className="mx-auto w-full max-w-6xl px-4 py-12 md:px-6 lg:py-20">
            <div className="mx-auto max-w-3xl">
              <p className="text-sm font-medium tracking-wide text-amber-700">Dear Hour · 디어아워</p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight text-stone-900 md:text-4xl lg:text-[2.75rem] lg:leading-tight">
                가장 소중한 시간(Dear Hour),
                <br className="hidden md:block" />
                변하지 않는 진심으로 담아냅니다.
              </h1>
              <p className="mt-5 text-base leading-relaxed text-stone-600 md:text-lg">
                누군가를 초대하고 알리는 일은 인생의 가장 빛나는 순간을 나누는 일입니다. 사랑하는 사람들을 모시는 귀한 발걸음, 당신의 그 소중한 시간을
                가장 품격 있는 모바일 알림장으로 전하세요.
              </p>
              <div className="mt-8">
                <Link href="/editor" className={accentBtn}>
                  내 알림장 무료로 시작하기
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* 2. 서비스 게이트웨이 */}
        <section className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6 md:py-20 lg:py-24">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-stone-900 md:text-3xl">어떤 순간을 준비하고 계신가요?</h2>
            <p className="mt-3 text-sm text-stone-600 md:text-base">행사에 맞는 공간으로 이동해 바로 제작을 시작하세요.</p>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-3 md:gap-8">
            <article className={gatewayCardClass}>
              <h3 className="text-xl font-bold tracking-tight text-stone-900 md:text-2xl">세상에서 가장 아름다운 시작</h3>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-stone-600 md:text-base">
                스튜디오급 하이엔드 디자인, 커피 두 잔 값(8,900원)으로 완벽하게 끝내세요.
              </p>
              <div className="mt-8">
                <Link href="/editor" className={`${accentBtnOutline} w-full md:w-auto`}>
                  청첩장 무료로 만들어보기
                </Link>
              </div>
            </article>

            <article className={gatewayCardClass}>
              <h3 className="text-xl font-bold tracking-tight text-stone-900 md:text-2xl">경황없는 순간, 가장 빠르고 정중하게</h3>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-stone-600 md:text-base">
                장례식장에서도 모바일로 5분 만에 즉각적인 조치가 가능합니다.
              </p>
              <div className="mt-8">
                <Link href="/obituary" className={`${accentBtnOutline} w-full md:w-auto`}>
                  부고장 빠르게 만들기
                </Link>
              </div>
            </article>

            <article className={gatewayCardClass}>
              <h3 className="text-xl font-bold tracking-tight text-stone-900 md:text-2xl">우리 아이의 첫 번째 주인공 되는 날</h3>
              <p className="mt-4 flex-1 text-sm leading-relaxed text-stone-600 md:text-base">
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
        <section className="border-y border-stone-200 bg-white/80">
          <div className="mx-auto w-full max-w-6xl px-4 py-16 md:px-6 md:py-20 lg:py-24">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-sm font-semibold text-amber-700">Core</p>
              <h2 className="mt-2 text-2xl font-bold tracking-tight text-stone-900 md:text-3xl">공통으로 담긴 기술력</h2>
              <p className="mt-3 text-sm text-stone-600 md:text-base">한 번 만든 알림장이 모든 기기에서 동일한 품질로 전달됩니다.</p>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
              <div className="flex flex-col items-center text-center md:items-start md:text-left">
                <div className="flex size-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                  <MonitorSmartphone className="size-6" aria-hidden />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-stone-900">어디서든 완벽한 크로스 플랫폼</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600 md:text-base">PC로 편하게 디자인하고 모바일로 즉시 수정</p>
              </div>
              <div className="flex flex-col items-center text-center md:items-start md:text-left">
                <div className="flex size-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                  <ClipboardList className="size-6" aria-hidden />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-stone-900">번거로운 취합은 그만</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600 md:text-base">실시간 RSVP 및 원터치 계좌번호 복사</p>
              </div>
              <div className="flex flex-col items-center text-center md:items-start md:text-left">
                <div className="flex size-12 items-center justify-center rounded-xl bg-amber-50 text-amber-700">
                  <ImageIcon className="size-6" aria-hidden />
                </div>
                <h3 className="mt-5 text-lg font-semibold text-stone-900">추억을 원본 그대로</h3>
                <p className="mt-2 text-sm leading-relaxed text-stone-600 md:text-base">하객들이 직접 올리는 20GB 무손실 사진 갤러리</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. 하단 CTA + 푸터 */}
        <section className="bg-gradient-to-b from-stone-800 to-stone-900 px-4 py-16 text-center text-white md:px-6 md:py-20">
          <div className="mx-auto max-w-2xl">
            <h2 className="text-2xl font-bold tracking-tight md:text-3xl">인생의 중요한 첫 단추, 디어아워와 가볍게 시작하세요.</h2>
            <div className="mt-8">
              <Link
                href="/editor"
                className="inline-flex items-center justify-center rounded-lg bg-white px-6 py-3 text-sm font-semibold text-stone-900 shadow-sm transition hover:bg-amber-50 hover:shadow-md active:translate-y-px focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-stone-900"
              >
                무료로 체험해 보기
              </Link>
            </div>
          </div>
        </section>

        <footer className="border-t border-stone-800 bg-stone-950 px-4 py-8 text-center text-sm text-stone-500 md:px-6">
          <p className="font-medium text-stone-300">Dear Hour · 디어아워</p>
          <p className="mt-2">모바일 알림장 SaaS · 통합 메인 홈</p>
          <div className="mt-4 flex flex-wrap items-center justify-center gap-x-6 gap-y-2">
            <Link href="/login" className="text-stone-400 underline-offset-4 transition hover:text-white hover:underline">
              로그인
            </Link>
            <Link href="/editor" className="text-stone-400 underline-offset-4 transition hover:text-white hover:underline">
              에디터
            </Link>
          </div>
          <p className="mt-6 text-xs text-stone-600">© {new Date().getFullYear()} Dear Hour. All rights reserved.</p>
        </footer>
      </main>
    </>
  );
}
