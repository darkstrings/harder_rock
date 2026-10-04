import { BedDouble, CalendarRange, CircleDollarSign, Coffee, IdCard, Mail, MessageSquareQuote, Users } from "lucide-react";
import Flag from "../../components/ui/Flag";
import { StatusBadge } from "../../components/ui/Badge";
import { resolveImage } from "../../lib/images";
import { cn, formatCurrency, formatDate, relativeDay } from "../../lib/utils";

function Item({ icon: Icon, label, children }) {
  return (
    <div className="flex gap-3">
      <Icon className="mt-0.5 size-5 shrink-0 text-accent" aria-hidden="true" />
      <div className="min-w-0">
        <p className="text-xs font-semibold tracking-wider text-muted uppercase">{label}</p>
        <div className="mt-0.5 text-sm">{children}</div>
      </div>
    </div>
  );
}

/** Purely presentational summary of a booking. */
export default function BookingDataBox({ booking }) {
  const { cabin, guest } = booking;
  const image = resolveImage(cabin.image);

  return (
    <section className="card overflow-hidden">
      <header className="relative isolate overflow-hidden px-6 py-6 text-white sm:px-8">
        {image && <img src={image} alt="" className="absolute inset-0 -z-10 size-full object-cover" />}
        <div className="absolute inset-0 -z-10 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-[0.2em] text-[#ff3d5a] uppercase">
              {booking.numNights} nights in
            </p>
            <h2 className="font-display text-3xl tracking-wide sm:text-4xl">{cabin.name}</h2>
          </div>
          <span className="rounded-full bg-black/70 p-0.5 backdrop-blur">
            <StatusBadge status={booking.status} />
          </span>
        </div>
        <p className="mt-3 flex items-center gap-2 text-sm text-white/80">
          <CalendarRange className="size-4" aria-hidden="true" />
          {formatDate(booking.startDate, "EEE, MMM d yyyy")} ({relativeDay(booking.startDate)}) →{" "}
          {formatDate(booking.endDate, "EEE, MMM d yyyy")}
        </p>
      </header>

      <div className="grid grid-cols-1 gap-6 p-6 sm:grid-cols-2 sm:p-8">
        <Item icon={Users} label="Guest">
          <span className="flex items-center gap-2 font-semibold">
            <Flag code={guest.countryCode} country={guest.nationality} />
            {guest.fullName}
          </span>
          <span className="text-muted">
            {booking.numGuests > 1 ? `+ ${booking.numGuests - 1} more guest${booking.numGuests > 2 ? "s" : ""}` : "Solo stay"}
          </span>
        </Item>
        <Item icon={Mail} label="Contact">
          <a href={`mailto:${guest.email}`} className="hover:text-accent">
            {guest.email}
          </a>
        </Item>
        <Item icon={IdCard} label="National ID">
          {guest.nationalId || "—"} {guest.nationality && <span className="text-muted">· {guest.nationality}</span>}
        </Item>
        <Item icon={Coffee} label="Breakfast">
          {booking.hasBreakfast ? "Included" : "Not included"}
        </Item>
        <Item icon={BedDouble} label="Cabin">
          Sleeps {cabin.maxCapacity} · {formatCurrency(cabin.regularPrice)}/night
        </Item>
        {booking.observations && (
          <Item icon={MessageSquareQuote} label="Guest notes">
            <span className="italic">“{booking.observations}”</span>
          </Item>
        )}
      </div>

      <div
        className={cn(
          "mx-6 mb-6 flex flex-wrap items-center justify-between gap-3 rounded-xl px-5 py-4 sm:mx-8",
          booking.isPaid ? "bg-ok-soft text-ok" : "bg-warn-soft text-warn",
        )}>
        <div className="flex items-center gap-3">
          <CircleDollarSign className="size-6" aria-hidden="true" />
          <div>
            <p className="text-lg font-bold tabular-nums">{formatCurrency(booking.totalPrice, true)}</p>
            {booking.extrasPrice > 0 && (
              <p className="text-xs opacity-80">
                {formatCurrency(booking.cabinPrice)} cabin + {formatCurrency(booking.extrasPrice)} breakfast
              </p>
            )}
          </div>
        </div>
        <p className="text-xs font-bold tracking-wider uppercase">{booking.isPaid ? "Paid" : "Will pay at property"}</p>
      </div>

      <footer className="border-t border-border px-6 py-3 text-right text-xs text-muted sm:px-8">
        Booked {formatDate(booking.createdAt, "EEE, MMM d yyyy, p")}
      </footer>
    </section>
  );
}
