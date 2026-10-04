import { useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import ThemeToggle from "./ThemeToggle";

export default function AppLayout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="min-h-dvh">
      <div className="no-print">
        <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      </div>
      <div className="lg:pl-64 print:pl-0">
        <div className="no-print">
          <Topbar onMenu={() => setMenuOpen(true)} />
        </div>
        <main className="mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 sm:py-10 lg:px-10">
          <div key={pathname} className="animate-fade-up">
            <Outlet />
          </div>
        </main>
        <div className="no-print flex justify-center pb-8 sm:hidden">
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
