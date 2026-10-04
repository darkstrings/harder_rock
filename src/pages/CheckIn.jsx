import { useState } from "react";
import { Link } from "react-router";
import { ArrowLeft, Check, Coffee } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import Empty from "../components/ui/Empty";
import { PageSpinner } from "../components/ui/Spinner";
import BookingDataBox from "../features/bookings/BookingDataBox";
import { useBooking, useCheckin } from "../features/bookings/hooks";
import { useSettings } from "../features/settings/hooks";
import { cn, formatCurrency } from "../lib/utils";

function CheckRow({ checked, onChange, disabled, icon: Icon = Check, children }) {
  return (
    <label
      className={cn(
        "card flex cursor-pointer items-center gap-4 p-5 transition-colors",
        checked && "border-accent bg-accent-soft",
        disabled && "cursor-not-allowed opacity-60",
      )}>
      <input
        type="checkbox"
        className="size-5 shrink-0 accent-[var(--accent)]"
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <Icon className="size-5 shrink-0 text-accent" aria-hidden="true" />
      <span className="text-sm">{children}</span>
    </label>
  );
}

function CheckInForm({ booking, settings }) {
  const [addBreakfast, setAddBreakfast] = useState(false);
  const [confirmPaid, setConfirmPaid] = useState(booking.isPaid);
  const { checkin, isPending } = useCheckin();

  const breakfastPrice = settings.breakfastPrice * booking.numNights * booking.numGuests;
  const total = booking.totalPrice + (addBreakfast ? breakfastPrice : 0);

  function handleCheckin() {
    if (!confirmPaid) return;
    checkin({
      bookingId: booking.id,
      breakfast: addBreakfast
        ? { hasBreakfast: true, extrasPrice: breakfastPrice, totalPrice: total }
        : {},
    });
  }

  return (
    <div className="mt-6 flex flex-col gap-3">
      {!booking.hasBreakfast && (
        <CheckRow
          icon={Coffee}
          checked={addBreakfast}
          onChange={() => {
            setAddBreakfast((v) => !v);
            setConfirmPaid(false);
          }}>
          Add breakfast for <strong>{formatCurrency(breakfastPrice)}</strong>{" "}
          <span className="text-muted">
            ({formatCurrency(settings.breakfastPrice)} × {booking.numGuests} guests × {booking.numNights} nights)
          </span>
        </CheckRow>
      )}
      <CheckRow
        checked={confirmPaid}
        onChange={() => setConfirmPaid((v) => !v)}
        disabled={isPending || (booking.isPaid && !addBreakfast)}>
        I confirm that <strong>{booking.guest.fullName}</strong> has paid the total of{" "}
        <strong>{formatCurrency(total, true)}</strong>
        {addBreakfast && (
          <span className="text-muted">
            {" "}
            ({formatCurrency(booking.totalPrice)} + {formatCurrency(breakfastPrice)} breakfast)
          </span>
        )}
      </CheckRow>

      <div className="mt-3 flex flex-wrap justify-end gap-3">
        <Button as={Link} to={`/bookings/${booking.id}`} variant="secondary">
          Cancel
        </Button>
        <Button onClick={handleCheckin} disabled={!confirmPaid} loading={isPending}>
          Check in booking #{booking.id}
        </Button>
      </div>
    </div>
  );
}

export default function CheckIn() {
  const { booking, isPending, error } = useBooking();
  const { settings, isPending: loadingSettings } = useSettings();

  if (isPending || loadingSettings) return <PageSpinner />;
  if (error) return <Empty title="Booking not found" message={error.message} />;

  return (
    <>
      <Button as={Link} to={`/bookings/${booking.id}`} variant="ghost" size="sm" className="mb-4 -ml-3">
        <ArrowLeft /> Back to booking
      </Button>
      <PageHeader eyebrow="Front desk" title={`Check in #${booking.id}`} />
      <BookingDataBox booking={booking} />
      {booking.status === "unconfirmed" ? (
        <CheckInForm key={booking.id} booking={booking} settings={settings} />
      ) : (
        <p className="card mt-6 p-5 text-sm text-muted">This booking is already {booking.status.replace("-", " ")}.</p>
      )}
    </>
  );
}
