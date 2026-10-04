import { useSearchParams } from "react-router";
import { ArrowDownUp } from "lucide-react";

export default function SortSelect({ options, param = "sortBy" }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const value = searchParams.get(param) || options[0].value;

  function onChange(e) {
    const next = new URLSearchParams(searchParams);
    next.set(param, e.target.value);
    next.delete("page");
    setSearchParams(next, { replace: true });
  }

  return (
    <label className="relative inline-flex items-center">
      <span className="sr-only">Sort</span>
      <ArrowDownUp className="pointer-events-none absolute left-3 size-4 text-muted" aria-hidden="true" />
      <select value={value} onChange={onChange} className="field h-10 appearance-none py-0 pr-8 pl-9">
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      <span className="pointer-events-none absolute right-3 text-xs text-muted" aria-hidden="true">
        ▾
      </span>
    </label>
  );
}
