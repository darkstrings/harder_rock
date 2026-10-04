import { useSearchParams } from "react-router";
import { cn } from "../../lib/utils";

/** Segmented control bound to a URL search param (keeps filters shareable/bookmarkable). */
export default function Segmented({ param, options, label }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const current = searchParams.get(param) || options[0].value;

  function select(value) {
    const next = new URLSearchParams(searchParams);
    next.set(param, value);
    next.delete("page");
    setSearchParams(next, { replace: true });
  }

  return (
    <div
      role="radiogroup"
      aria-label={label}
      className="inline-flex max-w-full overflow-x-auto rounded-xl border border-border bg-surface p-1 shadow-sm">
      {options.map((o) => {
        const active = o.value === current;
        return (
          <button
            key={o.value}
            type="button"
            role="radio"
            aria-checked={active}
            onClick={() => select(o.value)}
            className={cn(
              "rounded-lg px-3 py-1.5 text-sm font-medium whitespace-nowrap transition-colors",
              active ? "bg-accent text-accent-fg shadow-sm" : "text-muted hover:bg-surface-2 hover:text-fg",
            )}>
            {o.label}
          </button>
        );
      })}
    </div>
  );
}
