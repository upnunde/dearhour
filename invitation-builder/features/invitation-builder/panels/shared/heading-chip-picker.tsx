"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";

type HeadingChipPickerProps = {
  value: string;
  options: readonly string[];
  onChange: (next: string) => void;
  placeholder?: string;
  maxLength?: number;
};

export function HeadingChipPicker({
  value,
  options,
  onChange,
  placeholder,
  maxLength,
}: HeadingChipPickerProps) {
  const trimmed = value.trim();
  const isPreset = options.includes(trimmed);
  const [customMode, setCustomMode] = useState<boolean>(trimmed !== "" && !isPreset);

  return (
    <div className="flex min-w-0 flex-1 flex-col gap-2">
      <div className="flex flex-wrap gap-2 w-full">
        {options.map((option) => {
          const active = !customMode && (trimmed === option || (!trimmed && option === options[0]));
          return (
            <button
              key={option}
              type="button"
              className={`h-8 px-3 rounded-lg inline-flex items-center text-sm font-medium border transition-colors ${
                active
                  ? "bg-transparent text-on-surface-10 border-[color:var(--on-surface-10)] hover:bg-slate-50"
                  : "bg-[color:var(--surface-disabled)] text-[color:var(--on-surface-30)] opacity-70 border-transparent hover:bg-slate-50"
              }`}
              onClick={() => {
                setCustomMode(false);
                onChange(option);
              }}
            >
              {option}
            </button>
          );
        })}
        <button
          type="button"
          className={`h-8 px-3 rounded-lg inline-flex items-center text-sm font-medium border transition-colors ${
            customMode
              ? "bg-transparent text-on-surface-10 border-[color:var(--on-surface-10)] hover:bg-slate-50"
              : "bg-[color:var(--surface-disabled)] text-[color:var(--on-surface-30)] opacity-70 border-transparent hover:bg-slate-50"
          }`}
          onClick={() => {
            setCustomMode(true);
            if (options.includes(trimmed)) onChange("");
          }}
        >
          직접입력
        </button>
      </div>
      {customMode && (
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="shadow-none"
          maxLength={maxLength}
        />
      )}
    </div>
  );
}
