import { Link } from "react-router";
import { ArrowLeft, Printer } from "lucide-react";
import Button from "../components/ui/Button";
import Empty from "../components/ui/Empty";
import { PageSpinner } from "../components/ui/Spinner";
import Logo from "../components/layout/Logo";
import { useBooking } from "../features/bookings/hooks";
import { useSettings } from "../features/settings/hooks";
import { formatCurrency, formatDate } from "../lib/utils";

export default function Invoice() {
  const { booking, isPending, error } = useBooking();
  const { settings, isPending: loadingSettings } = useSettings();

  if (isPending || loadingSettings) return <PageSpinner />;
  if (error) return <Empty title="Booking not found" message={error.message} />;

  const nightly = booking.cabin.regularPrice - (booking.cabin.discount || 0);
  const lines = [
    {
      label: `${booking.cabin.name} — ${booking.numNights} nights`,
      detail: `${formatDate(booking.startDate)} → ${formatDate(booking.endDate)}`,
      qty: booking.numNights,
      unit: nightly,
      amount: booking.cabinPrice,
    },
    booking.extrasPrice > 0 && {
      label: "Breakfast",
      detail: `${booking.numGuests} guests × ${booking.numNights} nights`,
      qty: booking.numGuests * booking.numNights,
      unit: booking.extrasPrice / (booking.numGuests * booking.numNights) || settings.breakfastPrice,
      amount: booking.extrasPrice,
    },
  ].filter(Boolean);

  return (
    <>
      <div className="no-print mb-6 flex flex-wrap items-center justify-between gap-3">
        <Button as={Link} to={`/bookings/${booking.id}`} variant="ghost" size="sm" className="-ml-3">
          <ArrowLeft /> Back to booking
        </Button>
        <Button onClick={() => window.print()}>
          <Printer /> Print / save as PDF
        </Button>
      </div>

      <article className="card print-sheet mx-auto max-w-3xl p-6 sm:p-12">
        <header className="flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
          <Logo className="w-44" />
          <div className="sm:text-right">
            <h1 className="font-display text-5xl tracking-wide">Invoice</h1>
            <p className="text-sm text-muted">HRH-{String(booking.id).padStart(5, "0")}</p>
            <p className="text-sm text-muted">Issued {formatDate(new Date())}</p>
          </div>
        </header>

        <div className="mt-10 grid gap-6 text-sm sm:grid-cols-2">
          <div>
            <p className="eyebrow mb-2">Billed to</p>
            <p className="font-semibold">{booking.guest.fullName}</p>
            <p className="text-muted">{booking.guest.email}</p>
            <p className="text-muted">{booking.guest.nationality}</p>
          </div>
          <div className="sm:text-right">
            <p className="eyebrow mb-2">Stay</p>
            <p className="font-semibold">{booking.cabin.name}</p>
            <p className="text-muted">
              {formatDate(booking.startDate)} → {formatDate(booking.endDate)}
            </p>
            <p className="text-muted">{booking.numGuests} guest(s)</p>
          </div>
        </div>

        <table className="mt-10 w-full text-sm">
          <thead>
            <tr className="border-b-2 border-fg text-left text-xs tracking-wider uppercase">
              <th className="py-2 font-semibold">Description</th>
              <th className="py-2 text-right font-semibold">Qty</th>
              <th className="hidden py-2 text-right font-semibold sm:table-cell">Unit</th>
              <th className="py-2 text-right font-semibold">Amount</th>
            </tr>
          </thead>
          <tbody>
            {lines.map((l) => (
              <tr key={l.label} className="border-b border-border">
                <td className="py-3">
                  <p className="font-medium">{l.label}</p>
                  <p className="text-xs text-muted">{l.detail}</p>
                </td>
                <td className="py-3 text-right tabular-nums">{l.qty}</td>
                <td className="hidden py-3 text-right tabular-nums sm:table-cell">{formatCurrency(l.unit, true)}</td>
                <td className="py-3 text-right font-medium tabular-nums">{formatCurrency(l.amount, true)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 ml-auto w-full max-w-xs text-sm">
          <div className="flex justify-between py-1.5 text-muted">
            <span>Subtotal</span>
            <span className="tabular-nums">{formatCurrency(booking.totalPrice, true)}</span>
          </div>
          <div className="flex justify-between border-t-2 border-fg py-2 text-base font-bold">
            <span>Total</span>
            <span className="tabular-nums">{formatCurrency(booking.totalPrice, true)}</span>
          </div>
          <p className={`mt-1 text-right text-xs font-bold tracking-wider uppercase ${booking.isPaid ? "text-ok" : "text-warn"}`}>
            {booking.isPaid ? "Paid in full" : "Due at check-in"}
          </p>
        </div>

        <footer className="mt-14 border-t border-border pt-6 text-center text-xs text-muted">
          Thanks for staying at the Harder Rock Hotel. Keep it loud. 🤘
          <br />
          This is a fictional hotel created for a portfolio project.
        </footer>
      </article>
    </>
  );
}
