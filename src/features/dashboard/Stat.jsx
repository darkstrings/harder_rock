import { cn } from "../../lib/utils";

const tones = {
  accent: "bg-accent-soft text-accent",
  green: "bg-ok-soft text-ok",
  blue: "bg-info-soft text-info",
  yellow: "bg-warn-soft text-warn",
};

export default function Stat({ icon: Icon, title, value, hint, tone = "accent" }) {
  return (
    <div className="card flex items-center gap-4 p-5">
      <div className={cn("grid size-12 shrink-0 place-items-center rounded-xl", tones[tone])}>
        <Icon className="size-6" aria-hidden="true" />
      </div>
      <div className="min-w-0">
        <p className="text-xs font-semibold tracking-wider text-muted uppercase">{title}</p>
        <p className="font-display text-4xl leading-tight tracking-wide tabular-nums">{value}</p>
        {hint && <p className="truncate text-xs text-subtle">{hint}</p>}
      </div>
    </div>
  );
}
