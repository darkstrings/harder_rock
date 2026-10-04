import { cn } from "../../lib/utils";
import { STATUS_LABEL } from "../../lib/bookings";

const tones = {
  green: "bg-ok-soft text-ok",
  blue: "bg-info-soft text-info",
  yellow: "bg-warn-soft text-warn",
  red: "bg-danger-soft text-danger",
  accent: "bg-accent-soft text-accent",
  solid: "bg-accent text-accent-fg",
  neutral: "bg-neutral-soft text-muted",
};

export default function Badge({ tone = "neutral", className, children }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap",
        tones[tone],
        className,
      )}>
      {children}
    </span>
  );
}

const statusTone = { unconfirmed: "blue", "checked-in": "green", "checked-out": "neutral" };

export function StatusBadge({ status }) {
  return (
    <Badge tone={statusTone[status]}>
      <span className="size-1.5 rounded-full bg-current" aria-hidden="true" />
      {STATUS_LABEL[status] ?? status}
    </Badge>
  );
}
