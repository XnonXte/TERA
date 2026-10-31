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
  /** "fixed": posisi dihitung dari tombol, agar tidak terpotong wadah yang overflow (mis. tabel). */
  strategy?: "absolute" | "fixed";
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
  strategy = "absolute",
}: TooltipProps) {
  const id = useId();
  const [hover, setHover] = useState(false);
  const [focus, setFocus] = useState(false);
  const [pinned, setPinned] = useState(false);
  const ref = useRef<HTMLSpanElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const [fixedPos, setFixedPos] = useState<{ top: number; left: number; up: boolean } | null>(null);
  const open = hover || focus || pinned;

  useEffect(() => {
    if (!open || strategy !== "fixed") return;
    const place = () => {
      const r = btnRef.current?.getBoundingClientRect();
      if (!r) return;
      const up = r.bottom + 220 > window.innerHeight;
      setFixedPos({ top: up ? r.top - 8 : r.bottom + 8, left: Math.min(r.left, window.innerWidth - 300), up });
    };
    place();
    window.addEventListener("scroll", place, true);
    window.addEventListener("resize", place);
    return () => {
      window.removeEventListener("scroll", place, true);
      window.removeEventListener("resize", place);
    };
  }, [open, strategy]);

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
        ref={btnRef}
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
      {open && strategy === "fixed" && fixedPos && (
        <span
          id={id}
          role="tooltip"
          style={{ top: fixedPos.top, left: fixedPos.left, transform: fixedPos.up ? "translateY(-100%)" : undefined }}
          className={`fixed z-50 ${width} bg-[#0b1c30] text-white text-[12px] leading-relaxed font-normal normal-case tracking-normal text-left p-3 rounded-lg shadow-xl whitespace-normal`}
        >
          {content}
        </span>
      )}
      {open && strategy === "absolute" && (
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
