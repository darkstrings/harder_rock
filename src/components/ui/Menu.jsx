import { useEffect, useRef, useState } from "react";
import { EllipsisVertical } from "lucide-react";
import { cn } from "../../lib/utils";

/** Small dropdown menu. `items`: [{ label, icon: Icon, onClick, to, danger, hidden }] */
export default function Menu({ items, label = "Actions", as: LinkComp }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    if (!open) return;
    const close = (e) => !ref.current?.contains(e.target) && setOpen(false);
    const esc = (e) => e.key === "Escape" && setOpen(false);
    document.addEventListener("pointerdown", close);
    document.addEventListener("keydown", esc);
    return () => {
      document.removeEventListener("pointerdown", close);
      document.removeEventListener("keydown", esc);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        aria-label={label}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
        className="rounded-lg p-2 text-muted transition-colors hover:bg-surface-2 hover:text-fg">
        <EllipsisVertical className="size-4" />
      </button>
      {open && (
        <ul
          role="menu"
          className="absolute right-0 z-30 mt-1 min-w-48 animate-fade-up overflow-hidden rounded-xl border border-border bg-surface p-1 shadow-xl">
          {items
            .filter((i) => !i.hidden)
            .map(({ label, icon: Icon, onClick, to, danger }) => {
              const cls = cn(
                "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-left text-sm transition-colors hover:bg-surface-2",
                danger ? "text-danger" : "text-fg",
              );
              const content = (
                <>
                  {Icon && <Icon className="size-4 opacity-70" />}
                  {label}
                </>
              );
              return (
                <li key={label} role="none">
                  {to && LinkComp ? (
                    <LinkComp role="menuitem" to={to} className={cls} onClick={() => setOpen(false)}>
                      {content}
                    </LinkComp>
                  ) : (
                    <button
                      role="menuitem"
                      type="button"
                      className={cls}
                      onClick={() => {
                        setOpen(false);
                        onClick?.();
                      }}>
                      {content}
                    </button>
                  )}
                </li>
              );
            })}
        </ul>
      )}
    </div>
  );
}
