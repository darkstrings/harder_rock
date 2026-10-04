import { Link } from "react-router";
import { Moon } from "lucide-react";
import { useTodayActivity } from "./hooks";
import { useCheckout } from "../bookings/hooks";
import Badge from "../../components/ui/Badge";
import Button from "../../components/ui/Button";
import Flag from "../../components/ui/Flag";
import Spinner from "../../components/ui/Spinner";

function Activity({ booking }) {
  const { checkout, isPending } = useCheckout();
  const arriving = booking.status === "unconfirmed";
  return (
    <li className="flex items-center gap-3 py-3">
      <Badge tone={arriving ? "green" : "blue"} className="w-20 justify-center">
        {arriving ? "Arriving" : "Departing"}
      </Badge>
      <Flag code={booking.guest.countryCode} country={booking.guest.nationality} />
      <div className="min-w-0 flex-1">
        <Link to={`/bookings/${booking.id}`} className="block truncate text-sm font-medium hover:text-accent">
          {booking.guest.fullName}
        </Link>
        <p className="truncate text-xs text-muted">
          {booking.cabin.name} · {booking.numNights} nights
        </p>
      </div>
      {arriving ? (
        <Button as={Link} to={`/checkin/${booking.id}`} size="sm">
          Check in
        </Button>
      ) : (
        <Button size="sm" variant="secondary" onClick={() => checkout(booking.id)} loading={isPending}>
          Check out
        </Button>
      )}
    </li>
  );
}

export default function TodayActivity() {
  const { activities, isPending } = useTodayActivity();
  return (
    <section className="card flex flex-col p-5 sm:p-6" aria-labelledby="today-title">
      <h2 id="today-title" className="font-semibold">
        Today
      </h2>
      <p className="text-xs text-muted">Arrivals and departures</p>
      {isPending ? (
        <div className="grid flex-1 place-items-center py-10 text-muted">
          <Spinner />
        </div>
      ) : activities.length ? (
        <ul className="mt-3 divide-y divide-border">
          {activities.map((b) => (
            <Activity key={b.id} booking={b} />
          ))}
        </ul>
      ) : (
        <div className="flex flex-1 flex-col items-center justify-center gap-2 py-10 text-center text-sm text-muted">
          <Moon className="size-8 text-subtle" aria-hidden="true" />
          No arrivals or departures today.
        </div>
      )}
    </section>
  );
}
