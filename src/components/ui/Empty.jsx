import { Disc3 } from "lucide-react";

export default function Empty({ title = "Nothing here yet", message, action }) {
  return (
    <div className="card flex flex-col items-center justify-center gap-3 px-6 py-16 text-center">
      <Disc3 className="size-10 text-subtle" aria-hidden="true" />
      <h3 className="font-semibold">{title}</h3>
      {message && <p className="max-w-sm text-sm text-muted">{message}</p>}
      {action}
    </div>
  );
}
