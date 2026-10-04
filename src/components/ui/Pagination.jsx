import { useSearchParams } from "react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { PAGE_SIZE } from "../../lib/constants";
import Button from "./Button";

export default function Pagination({ count }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page")) || 1;
  const pageCount = Math.ceil(count / PAGE_SIZE);

  function go(p) {
    const next = new URLSearchParams(searchParams);
    next.set("page", p);
    setSearchParams(next);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (pageCount <= 1)
    return <p className="px-1 text-sm text-muted">{count === 1 ? "1 result" : `${count} results`}</p>;

  return (
    <nav className="flex items-center justify-between gap-4" aria-label="Pagination">
      <p className="text-sm text-muted">
        <span className="font-semibold text-fg">{(page - 1) * PAGE_SIZE + 1}</span>–
        <span className="font-semibold text-fg">{Math.min(page * PAGE_SIZE, count)}</span> of{" "}
        <span className="font-semibold text-fg">{count}</span>
      </p>
      <div className="flex gap-2">
        <Button variant="secondary" size="sm" onClick={() => go(page - 1)} disabled={page <= 1}>
          <ChevronLeft /> <span className="hidden sm:inline">Previous</span>
        </Button>
        <Button variant="secondary" size="sm" onClick={() => go(page + 1)} disabled={page >= pageCount}>
          <span className="hidden sm:inline">Next</span> <ChevronRight />
        </Button>
      </div>
    </nav>
  );
}
