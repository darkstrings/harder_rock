import { Link } from "react-router";
import { LogOut, Menu as MenuIcon } from "lucide-react";
import Avatar from "../ui/Avatar";
import Logo from "./Logo";
import ThemeToggle from "./ThemeToggle";
import { useLogout, useUser } from "../../features/auth/hooks";

export default function Topbar({ onMenu }) {
  const { user } = useUser();
  const { logout, isPending } = useLogout();

  return (
    <header className="sticky top-0 z-30 border-b border-border bg-bg/75 backdrop-blur-xl">
      <div className="flex h-16 items-center gap-3 px-4 sm:px-6 lg:px-10">
        <button
          type="button"
          onClick={onMenu}
          className="-ml-1 rounded-lg p-2 text-muted hover:bg-surface-2 hover:text-fg lg:hidden"
          aria-label="Open menu">
          <MenuIcon className="size-5" />
        </button>
        <Link to="/dashboard" className="lg:hidden" aria-label="Dashboard">
          <Logo className="w-24" />
        </Link>

        <div className="ml-auto flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:block">
            <ThemeToggle />
          </div>
          <Link
            to="/account"
            className="flex items-center gap-3 rounded-xl py-1 pr-3 pl-1 transition-colors hover:bg-surface-2">
            <Avatar src={user?.avatar} name={user?.fullName} className="size-8" />
            <span className="hidden text-sm font-medium md:inline">{user?.fullName}</span>
          </Link>
          <button
            type="button"
            onClick={() => logout()}
            disabled={isPending}
            className="rounded-lg p-2 text-muted hover:bg-surface-2 hover:text-fg"
            aria-label="Log out"
            title="Log out">
            <LogOut className="size-5" />
          </button>
        </div>
      </div>
    </header>
  );
}
