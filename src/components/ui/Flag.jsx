import { cn } from "../../lib/utils";

export default function Flag({ code, country, className }) {
  if (!code) return null;
  return (
    <img
      src={`https://flagcdn.com/${code.toLowerCase()}.svg`}
      alt={country ? `Flag of ${country}` : ""}
      title={country}
      loading="lazy"
      onError={(e) => (e.currentTarget.style.visibility = "hidden")}
      className={cn("h-3.5 w-5 shrink-0 rounded-[3px] object-cover shadow-sm ring-1 ring-black/10", className)}
    />
  );
}
