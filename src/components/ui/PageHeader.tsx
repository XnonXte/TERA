import React from "react";

interface PageHeaderProps {
  badge?: string;
  title: string;
  description?: string;
  actions?: React.ReactNode;
}

export default function PageHeader({
  badge,
  title,
  description,
  actions,
}: PageHeaderProps) {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#e5eeff]">
      <div>
        {badge && (
          <div className="text-[11px] font-bold text-[#b80035] tracking-widest uppercase mb-1">
            {badge}
          </div>
        )}
        <h1 className="text-[26px] font-bold text-[#0b1c30] tracking-tight">
          {title}
        </h1>
        {description && (
          <p className="text-[14px] text-[#5c5e64] mt-1 max-w-3xl leading-relaxed">
            {description}
          </p>
        )}
      </div>
      {actions && (
        <div className="flex items-center gap-3 shrink-0">{actions}</div>
      )}
    </div>
  );
}
