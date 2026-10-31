"use client";

import React, { useEffect, useId, useRef, useState } from "react";

interface TooltipProps {
  /** Isi tooltip. */
  content: React.ReactNode;
  /** Elemen pemicu; dibungkus tombol agar bisa difokus dengan keyboard. */
  children: React.ReactNode;
  /** Klik membuka/menutup tooltip (selain hover dan fokus). */
  clickToggle?: boolean;
  align?: "left" | "right" | "center";
  side?: "top" | "bottom";
  width?: string;
  label?: string;
  triggerClassName?: string;
}

// Tooltip ringan: muncul saat hover, fokus keyboard, atau (opsional) klik. Esc menutup.
export default function Tooltip({
  content,
  children,
  clickToggle = false,
  align = "center",
  side = "bottom",
  width = "w-72",
  label,
  triggerClassName = "",
}: TooltipProps) {
  const id = useId();
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [pinned, setPinned] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const open = hover || focus || pinned;

  useEffect(() => {
    if (!pinned) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setPinned(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, [pinned]);

  const pos =
    align === "left" ? "left-0" : align === "right" ? "right-0" : "left-1/2 -translate-x-1/2";
  const vert = side === "top" ? "bottom-full mb-2" : "top-full mt-2";

  return (
    <span
      ref={ref}
      className="relative inline-flex"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <button
        type="button"
        aria-describedby={open ? id : undefined}
        aria-label={label}
        aria-expanded={clickToggle ? pinned : undefined}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onClick={(e) => {
          e.stopPropagation();
          if (clickToggle) setPinned((p) => !p);
        }}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            setPinned(false);
            setFocus(false);
            (e.currentTarget as HTMLButtonElement).blur();
          }
        }}
        className={`inline-flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-[#b80035]/30 rounded-full ${triggerClassName}`}
      >
        {children}
      </button>
      {open && (
        <span
          id={id}
          role="tooltip"
          className={`absolute z-40 ${vert} ${pos} ${width} bg-[#0b1c30] text-white text-[12px] leading-relaxed font-normal normal-case tracking-normal text-left p-3 rounded-lg shadow-xl whitespace-normal`}
        >
          {content}
        </span>
      )}
    </span>
  );
}
