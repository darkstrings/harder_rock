import { useState } from "react";
import { Navigate } from "react-router";
import { Guitar, Sparkles } from "lucide-react";
import Button from "../components/ui/Button";
import Field from "../components/ui/Field";
import Logo from "../components/layout/Logo";
import ThemeToggle from "../components/layout/ThemeToggle";
import { PageSpinner } from "../components/ui/Spinner";
import { useLogin, useUser } from "../features/auth/hooks";
import { DEMO_USER } from "../data/seed";
import { IS_DEMO } from "../lib/constants";

const cabinPhoto = new URL("../assets/cabins/cabin-001.webp", import.meta.url).href;

export default function Login() {
  const { isAuthenticated, isPending: checking } = useUser();
  const { login, isPending } = useLogin();
  const [email, setEmail] = useState(IS_DEMO ? DEMO_USER.email : "");
  const [password, setPassword] = useState(IS_DEMO ? DEMO_USER.password : "");

  if (checking) return <PageSpinner />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;

  function handleSubmit(e) {
    e.preventDefault();
    if (!email || !password) return;
    login({ email, password });
  }

  return (
    <main className="grid min-h-dvh lg:grid-cols-[1.1fr_1fr]">
      {/* Hero side */}
      <section className="relative hidden overflow-hidden lg:block" aria-hidden="true">
        <img src={cabinPhoto} alt="" className="absolute inset-0 size-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/10" />
        <div className="absolute inset-x-0 bottom-0 p-12 text-white">
          <p className="text-xs font-semibold tracking-[0.2em] text-[#ff3d5a] uppercase">Staff backstage</p>
          <h2 className="mt-3 max-w-md font-display text-6xl leading-[0.95] tracking-wide">
            Rock-themed cabins. Zero quiet hours.
          </h2>
          <p className="mt-4 max-w-sm text-sm text-white/70">
            Manage bookings, check guests in and keep an eye on the numbers — all from one dashboard.
          </p>
        </div>
      </section>

      {/* Form side */}
      <section className="flex flex-col px-6 py-8 sm:px-12">
        <div className="flex justify-end">
          <ThemeToggle />
        </div>
        <div className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-10">
          <Logo className="mb-10 w-48" />
          <h1 className="font-display text-4xl tracking-wide">Log in to your account</h1>
          <p className="mt-1 text-sm text-muted">Welcome back. The stage is set.</p>

          {IS_DEMO && (
            <div className="mt-6 flex gap-3 rounded-xl border border-accent/30 bg-accent-soft p-4 text-sm">
              <Sparkles className="mt-0.5 size-4 shrink-0 text-accent" aria-hidden="true" />
              <p>
                <span className="font-semibold">Demo mode.</span> The demo login is filled in for you — just hit the
                button. Everything you change is saved in your browser only.
              </p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="mt-6 flex flex-col gap-4">
            <Field label="Email address">
              <input
                type="email"
                className="field"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isPending}
                required
              />
            </Field>
            <Field label="Password">
              <input
                type="password"
                className="field"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isPending}
                required
              />
            </Field>
            <Button type="submit" size="lg" loading={isPending} className="mt-2 w-full">
              {!isPending && <Guitar />}
              {IS_DEMO ? "Enter as demo user" : "Log in"}
            </Button>
          </form>
        </div>
        <p className="text-center text-xs text-subtle">
          A portfolio project by{" "}
          <a href="https://github.com/darkstrings" className="underline hover:text-fg" target="_blank" rel="noopener">
            Lucien Gaydos
          </a>
        </p>
      </section>
    </main>
  );
}
