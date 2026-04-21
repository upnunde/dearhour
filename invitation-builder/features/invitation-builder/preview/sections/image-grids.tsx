"use client";

import React, { useRef } from "react";
import { Move, Pencil, Trash2 } from "lucide-react";
import { isServiceProvidedThumbnailUrl } from "@/lib/service-provided-image-url";
import { useSortable } from "@/lib/useSortable";
import { cn } from "@/lib/utils";

type MultiImageGridProps = {
  images: string[];
  onReorder: (next: string[]) => void;
  onSlotClick: (index: number, hasImg: boolean) => void;
  onEdit: (index: number, src: string) => void;
  onDelete: (index: number) => void;
  touchMode?: boolean;
};

export function MultiImageGrid({
  images,
  onReorder,
  onSlotClick,
  onEdit,
  onDelete,
  touchMode = false,
}: MultiImageGridProps) {
  const normalized = Array.from({ length: 4 }, (_, i) => images[i] || "");
  const slots = normalized.map((src, i) => ({
    id: src ? `img-${src}` : `empty-${i}`,
    src,
  }));

  const sortable = useSortable({
    items: slots,
    onReorder: (reordered) => {
      const next = reordered.map((slot) => slot.src);
      onReorder(next);
    },
  });
  const allowReorder = !touchMode;

  return (
    <div className="flex gap-2 flex-wrap w-full bg-[color:var(--surface-20)] p-4 rounded-lg">
      {slots.map((slot, realIndex) => {
        const hasImg = !!slot.src;
        const sortableProps = allowReorder
          ? sortable.getItemProps(slot.id)
          : {
              handleProps: {
                onPointerDown: () => {},
                style: {},
                "aria-label": "이미지 이동 비활성화",
              },
              wrapperProps: {
                onPointerEnter: () => {},
                style: {},
                className: "",
                ref: () => {},
              },
            };
        const { handleProps, wrapperProps } = sortableProps;
        return (
          <div
            key={slot.id}
            {...wrapperProps}
            className={`${wrapperProps.className} relative w-[100px] min-w-[80px] aspect-[3/4] group`}
          >
            <button
              type="button"
              className={[
                "w-full h-full rounded-lg border bg-white flex items-center justify-center text-3xl text-on-surface-30 bg-center bg-cover bg-clip-border bg-origin-border",
                hasImg ? "border-transparent" : "border-dashed border-border hover:bg-slate-50",
              ].join(" ")}
              style={hasImg ? { backgroundImage: `url(${slot.src})` } : undefined}
              onClick={() => onSlotClick(realIndex, hasImg)}
              aria-label={`이미지 ${realIndex + 1} 추가`}
            >
              {hasImg ? "" : "+"}
            </button>
            {hasImg && (allowReorder || !isServiceProvidedThumbnailUrl(slot.src)) && (
              <div
                className={cn(
                  "absolute right-1 top-1 flex flex-col gap-1 transition-opacity",
                  touchMode ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                )}
              >
                {!isServiceProvidedThumbnailUrl(slot.src) && (
                  <>
                    <button
                      type="button"
                      className="w-7 h-7 rounded-lg bg-white/95 border border-border shadow-sm flex items-center justify-center text-on-surface-20 hover:bg-white"
                      aria-label="이미지 수정"
                      onClick={(e) => {
                        e.stopPropagation();
                        onEdit(realIndex, slot.src);
                      }}
                    >
                      <Pencil className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      className="w-7 h-7 rounded-lg bg-white/95 border border-border shadow-sm flex items-center justify-center text-on-surface-20 hover:bg-white"
                      aria-label="이미지 삭제"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDelete(realIndex);
                      }}
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
                {allowReorder && (
                  <button
                    type="button"
                    {...handleProps}
                    className="w-7 h-7 rounded-lg bg-white/95 border border-border shadow-sm flex items-center justify-center text-on-surface-20 hover:bg-white cursor-grab active:cursor-grabbing"
                    aria-label="이미지 이동"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Move className="w-4 h-4" />
                  </button>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

type GalleryImageGridProps = {
  images: string[];
  onChange: (next: string[]) => void;
  onEdit?: (index: number, src: string) => void;
  imageRatio?: "square" | "portrait";
  max?: number;
  touchMode?: boolean;
};

export function GalleryImageGrid({
  images,
  onChange,
  onEdit,
  imageRatio,
  max = 50,
  touchMode = false,
}: GalleryImageGridProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const normalized = images.slice(0, max);
  const slots = normalized.map((src, i) => ({ id: src ? `g-${src}` : `empty-${i}`, src }));

  const sortable = useSortable({
    items: slots,
    onReorder: (reordered) => onChange(reordered.map((item) => item.src)),
  });
  const allowReorder = !touchMode;
  const thumbAspectClass = imageRatio === "square" ? "aspect-square" : "aspect-[3/4]";
  const thumbMinWidthClass = imageRatio === "square" ? "" : "min-w-[80px]";

  return (
    <div className="w-full flex flex-col gap-2">
      <div className="pr-1">
        <div className="flex gap-2 flex-wrap w-full bg-[color:var(--surface-20)] p-4 rounded-lg max-h-[420px] overflow-y-auto">
          {slots.map((slot, i) => {
            const sortableProps = allowReorder
              ? sortable.getItemProps(slot.id)
              : {
                  handleProps: {
                    onPointerDown: () => {},
                    style: {},
                    "aria-label": "이미지 이동 비활성화",
                  },
                  wrapperProps: {
                    onPointerEnter: () => {},
                    style: {},
                    className: "",
                    ref: () => {},
                  },
                };
            const { handleProps, wrapperProps } = sortableProps;
            return (
              <div
                key={`${slot.id}-${i}`}
                {...wrapperProps}
                className={`${wrapperProps.className} relative w-[100px] ${thumbMinWidthClass} ${thumbAspectClass} group`}
              >
                <button
                  type="button"
                  className="w-full h-full rounded-lg border border-transparent bg-center bg-cover bg-clip-border bg-origin-border"
                  style={{ backgroundImage: `url(${slot.src})` }}
                  onClick={() => {
                    const el = document.getElementById(`gallery-image-${i}`) as HTMLInputElement | null;
                    el?.click();
                  }}
                  aria-label={`갤러리 이미지 ${i + 1} 수정`}
                />
                {!!slot.src && (allowReorder || !isServiceProvidedThumbnailUrl(slot.src)) && (
                  <div
                    className={cn(
                      "absolute right-1 top-1 flex flex-col gap-1 transition-opacity",
                      touchMode ? "opacity-100" : "opacity-0 group-hover:opacity-100",
                    )}
                  >
                    {!isServiceProvidedThumbnailUrl(slot.src) && (
                      <>
                        <button
                          type="button"
                          className="w-7 h-7 rounded-lg bg-white/95 border border-border shadow-sm flex items-center justify-center text-on-surface-20 hover:bg-white"
                          aria-label="이미지 수정"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (onEdit && slot.src) {
                              onEdit(i, slot.src);
                              return;
                            }
                            const el = document.getElementById(`gallery-image-${i}`) as HTMLInputElement | null;
                            el?.click();
                          }}
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          className="w-7 h-7 rounded-lg bg-white/95 border border-border shadow-sm flex items-center justify-center text-on-surface-20 hover:bg-white"
                          aria-label="이미지 삭제"
                          onClick={(e) => {
                            e.stopPropagation();
                            const next = [...normalized];
                            next.splice(i, 1);
                            onChange(next);
                          }}
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    {allowReorder && (
                      <button
                        type="button"
                        {...handleProps}
                        className="w-7 h-7 rounded-lg bg-white/95 border border-border shadow-sm flex items-center justify-center text-on-surface-20 hover:bg-white cursor-grab active:cursor-grabbing"
                        onClick={(e) => e.stopPropagation()}
                        aria-label="이미지 이동"
                      >
                        <Move className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}

          {normalized.length < max && (
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className={`relative w-[100px] ${thumbMinWidthClass} ${thumbAspectClass} rounded-lg border border-dashed border-border bg-white hover:bg-slate-50 active:bg-slate-50 flex items-center justify-center text-3xl text-on-surface-30 bg-center bg-cover bg-clip-border bg-origin-border`}
              aria-label="갤러리 이미지 추가"
            >
              +
            </button>
          )}
        </div>
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        className="hidden"
        onChange={(e) => {
          const files = Array.from(e.target.files ?? []);
          if (!files.length) return;
          const next = [...normalized];
          const remain = Math.max(0, max - next.length);
          files.slice(0, remain).forEach((file) => next.push(URL.createObjectURL(file)));
          onChange(next);
          e.currentTarget.value = "";
        }}
      />

      {slots.map((_, i) => (
        <input
          key={`gallery-image-input-${i}`}
          id={`gallery-image-${i}`}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (!file) return;
            const next = [...normalized];
            next[i] = URL.createObjectURL(file);
            onChange(next);
            e.currentTarget.value = "";
          }}
        />
      ))}
    </div>
  );
}
