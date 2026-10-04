import { isRouteErrorResponse, Link, useRouteError } from "react-router";
import { Zap } from "lucide-react";
import Button from "../components/ui/Button";

export default function ErrorPage() {
  const error = useRouteError();
  const message = isRouteErrorResponse(error) ? error.statusText : (error?.message ?? "Something went wrong.");
  return (
    <main className="grid min-h-dvh place-items-center px-6">
      <div className="card max-w-md p-10 text-center">
        <Zap className="mx-auto size-10 text-accent" aria-hidden="true" />
        <h1 className="mt-4 font-display text-4xl tracking-wide">Blown fuse</h1>
        <p className="mt-2 text-sm text-muted">{message}</p>
        <Button as={Link} to="/dashboard" className="mt-6" reloadDocument>
          Back to the dashboard
        </Button>
      </div>
    </main>
  );
}
