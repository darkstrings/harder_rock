import { resolveImage } from "../../lib/images";
import { cn, initials } from "../../lib/utils";

export default function Avatar({ src, name, className }) {
  const url = resolveImage(src);
  return url ? (
    <img src={url} alt="" className={cn("size-9 shrink-0 rounded-full object-cover ring-2 ring-border", className)} />
  ) : (
    <span
      aria-hidden="true"
      className={cn(
        "grid size-9 shrink-0 place-items-center rounded-full bg-accent-soft text-xs font-bold text-accent ring-2 ring-border",
        className,
      )}>
      {initials(name) || "?"}
    </span>
  );
}
