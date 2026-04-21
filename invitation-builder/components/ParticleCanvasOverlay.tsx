"use client";

import React, { useEffect, useMemo, useRef } from "react";

/** 레거시(snow/sparkle 제거) 값은 none으로 취급 */
type ParticleEffect = "none" | "cherryBlossom" | "yellowPetal" | "daisyPetal" | "heart";

const PETAL_EFFECTS = ["cherryBlossom", "yellowPetal", "daisyPetal"] as const;

/** 하트: 기존 반올림 개수 `round(17*1.2)` 대비 +30% */
const HEART_COUNT_MULT = 1.3;
const HEART_BASE_SEED = Math.round(17 * 1.2);
/** 하트: 매 프레임 위치 이동(낙하·흔들림) 속도 +20% */
const HEART_MOVE_SPEED_MULT = 1.2;

/** 데이지꽃 날림: 꽃잎 기본 개수(22) 대비 −30% */
const DAISY_PETAL_COUNT_MULT = 0.7;
/** 데이지꽃 날림: 꽃잎 기본 스케일(0.675) 대비 +10% */
const DAISY_PETAL_SIZE_MULT = 1.1;
const PETAL_BASE_SEED = 22;

function isPetalEffect(e: string): e is (typeof PETAL_EFFECTS)[number] {
  return (PETAL_EFFECTS as readonly string[]).includes(e);
}

function normalizeParticleEffect(raw: string | undefined | null): ParticleEffect {
  const v = String(raw ?? "none").trim();
  if (v === "snow" || v === "sparkle") return "none";
  if (v === "none") return "none";
  if (v === "cherryBlossom" || v === "yellowPetal" || v === "daisyPetal" || v === "heart") return v;
  return "none";
}

function petalSpritePoolFor(effect: (typeof PETAL_EFFECTS)[number]): string[] {
  switch (effect) {
    case "cherryBlossom":
      return ["/petal01.svg", "/petal02.svg", "/petal03.svg"];
    case "yellowPetal":
      return ["/petal-b01.svg", "/petal-b02.svg", "/petal-b03.svg"];
    case "daisyPetal":
      return ["/petal-c01.svg", "/petal-c02.svg", "/petal-c03.svg"];
    default:
      return ["/petal01.svg", "/petal02.svg", "/petal03.svg"];
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.max(min, Math.min(max, n));
}

// 하트 곡선을 정규화된 포인트(0..1)로 미리 계산해 성능 부담을 줄입니다.
function makeHeartPoints(samples = 220) {
  const pts: Array<{ x: number; y: number }> = [];
  for (let i = 0; i <= samples; i += 1) {
    const t = (i / samples) * Math.PI * 2;
    const x = 16 * Math.pow(Math.sin(t), 3);
    const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
    pts.push({ x, y });
  }
  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  for (const p of pts) {
    minX = Math.min(minX, p.x);
    maxX = Math.max(maxX, p.x);
    minY = Math.min(minY, p.y);
    maxY = Math.max(maxY, p.y);
  }
  const w = maxX - minX || 1;
  const h = maxY - minY || 1;
  return pts.map((p) => ({
    x: (p.x - minX) / w - 0.5,
    y: (p.y - minY) / h - 0.5,
  }));
}

export default function ParticleCanvasOverlay({
  effect,
  themeColor,
}: {
  effect: ParticleEffect | string;
  themeColor?: string;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const petalImageRefs = useRef<HTMLImageElement[]>([]);

  const heartPoints = useMemo(() => makeHeartPoints(240), []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const parent = canvas.parentElement;
    if (!parent) return;

    const targetEffect = normalizeParticleEffect(String(effect));
    if (targetEffect === "none") {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }

    const state = {
      running: true,
      w: 0,
      h: 0,
      dpr: Math.max(1, Math.min(2, window.devicePixelRatio || 1)),
      particles: [] as Array<{
        x: number;
        y: number;
        vx: number;
        vy: number;
        flow: number;
        size: number;
        rot: number;
        vr: number;
        alpha: number;
        life: number;
        kind: "petal" | "heart";
        hue: number;
        tw: number;
        spriteIndex: number;
      }>,
    };

    const resize = () => {
      const rect = parent.getBoundingClientRect();
      state.w = Math.max(1, Math.floor(rect.width));
      state.h = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(state.w * state.dpr);
      canvas.height = Math.floor(state.h * state.dpr);
      canvas.style.width = `${state.w}px`;
      canvas.style.height = `${state.h}px`;
      ctx.setTransform(state.dpr, 0, 0, state.dpr, 0, 0);
    };

    resize();

    const onResize = () => resize();
    const ro = new ResizeObserver(() => onResize());
    ro.observe(parent);

    const seedCount =
      targetEffect === "heart"
        ? Math.max(1, Math.round(HEART_BASE_SEED * HEART_COUNT_MULT))
        : targetEffect === "daisyPetal"
          ? Math.max(1, Math.round(PETAL_BASE_SEED * DAISY_PETAL_COUNT_MULT))
          : PETAL_BASE_SEED;

    const rand = (min: number, max: number) => min + Math.random() * (max - min);

    const kind: "petal" | "heart" = targetEffect === "heart" ? "heart" : "petal";

    const petalSpritePool = isPetalEffect(targetEffect) ? petalSpritePoolFor(targetEffect) : petalSpritePoolFor("cherryBlossom");

    const exposureSizeMultiplier = targetEffect === "heart" ? 1.2 : 1;
    const heartSizeBoost = targetEffect === "heart" ? 1.3 * 1.2 : 1;
    const heartVyMult = targetEffect === "heart" ? 1.2 : 1;

    const petalSizeScale = isPetalEffect(targetEffect)
      ? 0.675 * (targetEffect === "daisyPetal" ? DAISY_PETAL_SIZE_MULT : 1)
      : 1;
    const isDaisyPetal = targetEffect === "daisyPetal";

    const randomPetalSpawn = () => ({
      x: rand(state.w * 1.02, state.w * 1.45),
      y: rand(-state.h * 0.35, state.h * 1.2),
    });
    const randomHeartSpawn = (initial = false) => ({
      x: rand(-state.w * 0.25, state.w * 1.25),
      y: initial ? rand(-state.h * 1.2, state.h * 1.05) : rand(-state.h * 0.45, -24),
    });

    for (let i = 0; i < seedCount; i += 1) {
      const size =
        rand(3, 7) * (targetEffect === "heart" ? 1.2 : petalSizeScale) * heartSizeBoost;
      const isPetal = kind === "petal";
      const spawn = isPetal ? randomPetalSpawn() : null;
      const heartSpawn = isPetal ? null : randomHeartSpawn(true);
      state.particles.push({
        x: isPetal ? spawn!.x : heartSpawn!.x,
        y: isPetal ? spawn!.y : heartSpawn!.y,
        vx: isPetal ? rand(-1.35, -0.55) : rand(-0.35, 0.35),
        vy: isPetal ? rand(0.22, 0.78) : rand(0.22, 0.62) * heartVyMult,
        flow: rand(0.8, 1.3),
        size: size * exposureSizeMultiplier,
        rot: rand(0, Math.PI * 2),
        vr: kind === "heart" ? rand(-0.008, 0.008) : rand(-0.02, 0.02) * 1.7,
        alpha: isDaisyPetal ? 1 : rand(0.25, 0.9),
        life: rand(0.6, 1.0),
        kind,
        hue: rand(320, 360),
        tw: rand(0, Math.PI * 2),
        spriteIndex: Math.floor(Math.random() * petalSpritePool.length),
      });
    }

    let last = performance.now();

    const drawPetal = (p: (typeof state.particles)[number]) => {
      const sprite = petalImageRefs.current[p.spriteIndex];
      if (sprite && sprite.complete && sprite.naturalWidth > 0 && sprite.naturalHeight > 0) {
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rot);
        const w = p.size * 4.8;
        const h = p.size * 4.2;
        ctx.globalAlpha = clamp(p.alpha, 0.2, 1);
        ctx.drawImage(sprite, -w / 2, -h / 2, w, h);
        ctx.restore();
        return;
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);

      const w = p.size * 1.25;
      const h = p.size * 0.95;

      const base = `hsla(${p.hue}, 78%, 80%, ${p.alpha})`;
      const edge = `hsla(${p.hue}, 72%, 66%, ${p.alpha * 0.9})`;
      const highlight = `hsla(${p.hue}, 95%, 92%, ${Math.min(1, p.alpha * 0.7)})`;

      const g = ctx.createLinearGradient(0, -h, 0, h);
      g.addColorStop(0, highlight);
      g.addColorStop(0.45, base);
      g.addColorStop(1, edge);
      ctx.fillStyle = g;

      ctx.beginPath();
      ctx.moveTo(0, -h);
      ctx.bezierCurveTo(w * 0.9, -h * 0.6, w, h * 0.45, 0, h);
      ctx.bezierCurveTo(-w, h * 0.45, -w * 0.9, -h * 0.6, 0, -h);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = `hsla(${p.hue}, 70%, 60%, ${p.alpha * 0.45})`;
      ctx.lineWidth = Math.max(0.6, p.size * 0.08);
      ctx.beginPath();
      ctx.moveTo(0, -h * 0.82);
      ctx.lineTo(0, h * 0.72);
      ctx.stroke();

      ctx.restore();
    };

    if (isPetalEffect(targetEffect)) {
      petalImageRefs.current = petalSpritePool.map((src) => {
        const img = new Image();
        img.src = src;
        return img;
      });
    } else {
      petalImageRefs.current = [];
    }

    const drawHeart = (p: (typeof state.particles)[number]) => {
      const color = themeColor?.trim() ? themeColor : "rgba(255, 105, 180, 1)";
      ctx.fillStyle = color;
      ctx.globalAlpha = clamp(p.alpha, 0.2, 1);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.rot);
      const s = p.size * 0.35;
      ctx.beginPath();
      for (let i = 0; i < heartPoints.length; i += 1) {
        const pt = heartPoints[i];
        const x = pt.x * s * 2.2;
        const y = -pt.y * s * 2.2;
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
      ctx.globalAlpha = 1;
    };

    const tick = (now: number) => {
      if (!state.running) return;
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;

      ctx.clearRect(0, 0, state.w, state.h);

      for (const p of state.particles) {
        if (p.kind === "petal") {
          const windX = Math.sin(p.tw * 0.9 + p.y * 0.008) * 0.42 * p.flow;
          const swayY = Math.sin(p.tw * 1.35 + p.x * 0.01) * 0.12 * p.flow;
          p.x += (p.vx + windX) * (dt * 60) * p.flow;
          p.y += (p.vy + swayY) * (dt * 60) * p.flow;
        } else {
          const m = HEART_MOVE_SPEED_MULT;
          p.x += p.vx * (dt * 60) * m * p.flow;
          p.y += p.vy * (dt * 60) * m * p.flow;
        }
        p.rot += p.vr * (dt * 60);
        p.tw += dt * (p.kind === "heart" ? 1.6 : 3.2);

        const isOutForPetal = p.kind === "petal" && (p.x < -p.size * 3 || p.y > state.h + p.size * 2);

        if (isOutForPetal || p.y > state.h + p.size * 2) {
          if (p.kind === "petal") {
            const spawn = randomPetalSpawn();
            p.x = spawn.x;
            p.y = spawn.y;
          } else {
            const spawn = randomHeartSpawn(false);
            p.x = spawn.x;
            p.y = spawn.y;
          }
          p.alpha = isDaisyPetal ? 1 : rand(0.25, 0.9);
          p.size =
            rand(3, 7) * (targetEffect === "heart" ? 1.2 : petalSizeScale) * heartSizeBoost * exposureSizeMultiplier;
          p.flow = rand(0.8, 1.3);
          p.rot = rand(0, Math.PI * 2);
          p.vx = p.kind === "petal" ? rand(-1.35, -0.55) : rand(-0.35, 0.35);
          p.vy =
            p.kind === "petal" ? rand(0.22, 0.78) : rand(0.22, 0.62) * heartVyMult;
          p.vr = p.kind === "heart" ? rand(-0.008, 0.008) : rand(-0.02, 0.02) * 1.7;
          p.life = rand(0.6, 1.0);
          p.hue = rand(320, 360);
          p.spriteIndex = Math.floor(Math.random() * petalSpritePool.length);
        }

        if (p.kind === "petal") {
          drawPetal(p);
        } else {
          drawHeart(p);
        }
      }

      rafRef.current = window.requestAnimationFrame(tick);
    };

    rafRef.current = window.requestAnimationFrame(tick);

    return () => {
      state.running = false;
      if (rafRef.current) window.cancelAnimationFrame(rafRef.current);
      ro.disconnect();
    };
  }, [effect, heartPoints, themeColor]);

  return <canvas ref={canvasRef} className="absolute inset-0 z-10 pointer-events-none" />;
}
