import { Link } from "react-router";
import Button from "../components/ui/Button";

export default function NotFound() {
  return (
    <main className="grid min-h-dvh place-items-center px-6 text-center">
      <div>
        <p className="font-display text-[9rem] leading-none text-accent">404</p>
        <h1 className="font-display text-4xl tracking-wide">This track isn't on the setlist</h1>
        <p className="mt-2 text-muted">The page you're looking for doesn't exist.</p>
        <Button as={Link} to="/dashboard" className="mt-8">
          Back to the dashboard
        </Button>
      </div>
    </main>
  );
}
