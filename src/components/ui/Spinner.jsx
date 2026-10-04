import { cn } from "../../lib/utils";

export default function Spinner({ className }) {
  return (
    <span
      role="status"
      aria-label="Loading"
      className={cn("inline-block size-6 animate-spin rounded-full border-2 border-current border-r-transparent", className)}
    />
  );
}

/** Animated "equalizer" loader for full-page/section loading. */
export function PageSpinner({ label = "Tuning up…" }) {
  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center gap-4 text-muted" role="status">
      <div className="flex h-8 items-end gap-1" aria-hidden="true">
        {[0, 1, 2, 3, 4].map((i) => (
          <span
            key={i}
            className="w-1.5 rounded-full bg-accent"
            style={{ animation: `eq 0.9s ${i * 0.12}s ease-in-out infinite alternate`, height: "30%" }}
          />
        ))}
      </div>
      <p className="text-sm">{label}</p>
      <style>{`@keyframes eq { to { height: 100%; } }`}</style>
    </div>
  );
}
