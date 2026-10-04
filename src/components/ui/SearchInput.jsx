import { useEffect, useState } from "react";
import { useSearchParams } from "react-router";
import { Search, X } from "lucide-react";

/** Debounced search box bound to the `q` URL param. */
export default function SearchInput({ placeholder = "Search…" }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const [value, setValue] = useState(searchParams.get("q") ?? "");

  useEffect(() => {
    const t = setTimeout(() => {
      const current = searchParams.get("q") ?? "";
      if (current === value) return;
      const next = new URLSearchParams(searchParams);
      if (value) next.set("q", value);
      else next.delete("q");
      next.delete("page");
      setSearchParams(next, { replace: true });
    }, 250);
    return () => clearTimeout(t);
  }, [value, searchParams, setSearchParams]);

  return (
    <label className="relative flex w-full items-center sm:w-72">
      <span className="sr-only">Search</span>
      <Search className="pointer-events-none absolute left-3 size-4 text-muted" aria-hidden="true" />
      <input
        type="search"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="field h-10 pr-9 pl-9 [&::-webkit-search-cancel-button]:hidden"
      />
      {value && (
        <button
          type="button"
          onClick={() => setValue("")}
          className="absolute right-2 rounded p-1 text-muted hover:text-fg"
          aria-label="Clear search">
          <X className="size-4" />
        </button>
      )}
    </label>
  );
}
