import { formatCurrency } from "../../lib/utils";

/** Shared tooltip: text in text tokens, colored swatch carries identity. */
export default function ChartTooltip({ active, payload, label, currency = false, total = false }) {
  if (!active || !payload?.length) return null;
  const sum = payload.reduce((s, p) => s + (Number(p.value) || 0), 0);
  const fmt = (v) => (currency ? formatCurrency(v) : v);
  return (
    <div className="min-w-40 rounded-xl border border-border bg-surface px-3 py-2.5 text-xs shadow-xl">
      <p className="mb-1.5 font-semibold text-fg">{label}</p>
      <ul className="flex flex-col gap-1">
        {payload.map((p) => (
          <li key={p.dataKey} className="flex items-center justify-between gap-4 text-muted">
            <span className="flex items-center gap-2">
              <span className="size-2.5 rounded-sm" style={{ background: p.color }} aria-hidden="true" />
              {p.name}
            </span>
            <span className="font-semibold text-fg tabular-nums">{fmt(p.value)}</span>
          </li>
        ))}
      </ul>
      {total && payload.length > 1 && (
        <p className="mt-1.5 flex justify-between border-t border-border pt-1.5 font-semibold text-fg">
          <span>Total</span>
          <span className="tabular-nums">{fmt(sum)}</span>
        </p>
      )}
    </div>
  );
}
