import React from "react";
import { TrendingUp, TrendingDown, Minus, Info } from "lucide-react";
import Tooltip from "@/components/ui/Tooltip";

interface KpiCardProps {
  label: string;
  value: string | number;
  unit?: string;
  delta?: {
    value: string;
    isPositiveGood?: boolean; // in carbon, negative is often good!
    isNeutral?: boolean;
    label?: string;
  };
  subtitle?: string;
  badge?: {
    text: string;
    variant?: "default" | "red" | "green" | "amber" | "blue";
  };
  icon?: React.ReactNode;
  /** Teks tambahan (mis. sumber) di bawah baris subjudul; boleh lebih dari satu baris. */
  footnote?: React.ReactNode;
  /** Keterangan tambahan di tooltip ikon ⓘ di samping label. */
  info?: React.ReactNode;
  onClick?: () => void;
  className?: string;
}

export default function KpiCard({
  label,
  value,
  unit,
  delta,
  subtitle,
  badge,
  icon,
  footnote,
  info,
  onClick,
  className = "",
}: KpiCardProps) {
  const getDeltaColor = () => {
    if (!delta) return "";
    if (delta.isNeutral) return "text-[#5c5e64] bg-[#eff4ff]";
    const isIncrease = delta.value.startsWith("+");
    // If increase is bad (e.g. higher emissions)
    if (delta.isPositiveGood) {
      return isIncrease
        ? "text-[#059669] bg-[#ecfdf5]"
        : "text-[#b80035] bg-[#fff1f2]";
    } else {
      return isIncrease
        ? "text-[#b80035] bg-[#fff1f2]"
        : "text-[#059669] bg-[#ecfdf5]";
    }
  };

  const getDeltaIcon = () => {
    if (!delta || delta.isNeutral) return <Minus className="w-3 h-3" />;
    return delta.value.startsWith("+") ? (
      <TrendingUp className="w-3 h-3" />
    ) : (
      <TrendingDown className="w-3 h-3" />
    );
  };

  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-xl border border-[#e5eeff] p-5 shadow-sm transition-all hover:shadow-md ${
        onClick ? "cursor-pointer" : ""
      } ${className}`}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="flex items-center gap-1 min-w-0">
          <span className="text-[11px] font-semibold text-[#5c5e64] uppercase tracking-wider truncate">
            {label}
          </span>
          {info && (
            <Tooltip content={info} align="left" label={`Keterangan ${label}`}>
              <Info className="w-3.5 h-3.5 text-[#5c5e64] hover:text-[#0b1c30]" />
            </Tooltip>
          )}
        </span>
        {icon && (
          <div className="w-8 h-8 rounded-lg bg-[#f8f9ff] border border-[#e5eeff] flex items-center justify-center text-[#5c5e64]">
            {icon}
          </div>
        )}
      </div>

      <div className="flex items-baseline gap-1.5 my-1">
        <span className="text-[26px] font-bold text-[#0b1c30] tracking-tight leading-none">
          {value}
        </span>
        {unit && (
          <span className="text-[13px] font-medium text-[#5c5e64]">{unit}</span>
        )}
      </div>

      {(delta || badge || subtitle) && (
        <div className="flex items-center flex-wrap gap-2 mt-3 pt-2 border-t border-[#f1f5f9]">
          {delta && (
            <span
              className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-bold ${getDeltaColor()}`}
            >
              {getDeltaIcon()}
              <span>{delta.value}</span>
              {delta.label && <span className="font-normal text-[#5c5e64]">{delta.label}</span>}
            </span>
          )}

          {badge && (
            <span
              className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${
                badge.variant === "red"
                  ? "bg-[#fff1f2] text-[#b80035]"
                  : badge.variant === "amber"
                  ? "bg-[#fffbeb] text-[#d97706]"
                  : badge.variant === "green"
                  ? "bg-[#ecfdf5] text-[#059669]"
                  : "bg-[#e5eeff] text-[#0b1c30]"
              }`}
            >
              {badge.text}
            </span>
          )}

          {subtitle && (
            <span className="text-[12px] text-[#5c5e64] truncate">
              {subtitle}
            </span>
          )}
        </div>
      )}

      {footnote && <div className="text-[11px] text-[#5c5e64] mt-2 leading-snug">{footnote}</div>}
    </div>
  );
}
