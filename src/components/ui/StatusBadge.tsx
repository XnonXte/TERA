import React from "react";
import { CheckCircle2, AlertCircle, Clock } from "lucide-react";

export type BadgeVariant =
  | "valid"
  | "warning"
  | "error"
  | "critical"
  | "approved"
  | "pending"
  | "rejected"
  | "unresolved";

interface StatusBadgeProps {
  status: BadgeVariant | string;
  label?: string;
  size?: "sm" | "md";
  showIcon?: boolean;
}

export default function StatusBadge({
  status,
  label,
  size = "md",
  showIcon = true,
}: StatusBadgeProps) {
  const norm = status.toLowerCase();

  let bg = "bg-gray-100 text-gray-700 border-gray-200";
  let icon = null;
  let text = label || status;

  if (norm === "valid" || norm === "approved") {
    bg = "bg-[#ecfdf5] text-[#059669] border-[#a7f3d0]";
    icon = <CheckCircle2 className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />;
    if (!label) {
      if (norm === "valid") text = "Valid";
      else if (norm === "approved") text = "Approved";
    }
  } else if (norm === "warning" || norm === "pending" || norm === "pending_review") {
    bg = "bg-[#fffbeb] text-[#d97706] border-[#fde68a]";
    icon = <Clock className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />;
    if (!label) {
      if (norm === "warning") text = "Warning";
      else if (norm === "pending_review" || norm === "pending") text = "Under Review";
    }
  } else if (norm === "error" || norm === "critical" || norm === "rejected" || norm === "unresolved") {
    bg = "bg-[#fff1f2] text-[#b80035] border-[#ffdad6]";
    icon = <AlertCircle className={size === "sm" ? "w-3 h-3" : "w-3.5 h-3.5"} />;
    if (!label) {
      if (norm === "error" || norm === "critical") text = "Critical";
      else if (norm === "rejected") text = "Rejected";
      else if (norm === "unresolved") text = "Unresolved";
    }
  }

  return (
    <span
      className={`inline-flex items-center gap-1.5 font-medium rounded-full border ${bg} ${
        size === "sm" ? "px-2 py-0.5 text-[11px]" : "px-2.5 py-1 text-[12px]"
      }`}
    >
      {showIcon && icon}
      <span>{text}</span>
    </span>
  );
}
