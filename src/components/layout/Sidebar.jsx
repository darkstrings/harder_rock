import { NavLink } from "react-router";
import { BedDouble, CalendarDays, LayoutDashboard, Settings, Users, X } from "lucide-react";
import Logo from "./Logo";
import { IS_DEMO } from "../../lib/constants";
import { cn } from "../../lib/utils";

const links = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/bookings", label: "Bookings", icon: CalendarDays },
  { to: "/cabins", label: "Cabins", icon: BedDouble },
  { to: "/users", label: "Staff", icon: Users },
  { to: "/settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ open, onClose }) {
  return (
    <>
      {/* mobile backdrop */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-black/60 backdrop-blur-sm transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-72 flex-col border-r border-border bg-surface transition-transform duration-300",
          "lg:z-20 lg:w-64 lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
        aria-label="Main navigation">
        <div className="flex items-center justify-between px-6 pt-6 pb-8">
          <Logo className="w-36" />
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg p-2 text-muted hover:bg-surface-2 hover:text-fg lg:hidden"
            aria-label="Close menu">
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex-1 px-3">
          <ul className="flex flex-col gap-1">
            {links.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    cn(
                      "group relative flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors",
                      isActive ? "bg-accent-soft text-fg" : "text-muted hover:bg-surface-2 hover:text-fg",
                    )
                  }>
                  {({ isActive }) => (
                    <>
                      <span
                        className={cn(
                          "absolute top-2 bottom-2 left-0 w-1 rounded-full bg-accent transition-opacity",
                          isActive ? "opacity-100" : "opacity-0",
                        )}
                        aria-hidden="true"
                      />
                      <Icon className={cn("size-5", isActive ? "text-accent" : "text-subtle group-hover:text-fg")} />
                      {label}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav>

        <div className="m-4 rounded-xl border border-dashed border-border-strong p-4 text-xs text-muted">
          <p className="font-semibold text-fg">{IS_DEMO ? "Demo mode" : "Live data"}</p>
          <p className="mt-1">
            {IS_DEMO
              ? "Data lives in your browser. Reset it any time in Settings."
              : "Connected to Firebase."}
          </p>
        </div>
      </aside>
    </>
  );
}
