import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowDownToLine, ArrowUpFromLine, Eye, FileText, Trash2 } from "lucide-react";
import Menu from "../../components/ui/Menu";
import ConfirmDialog from "../../components/ui/ConfirmDialog";
import { StatusBadge } from "../../components/ui/Badge";
import Flag from "../../components/ui/Flag";
import { cn, formatCurrency, formatDate, relativeDay } from "../../lib/utils";
import { useCheckout, useDeleteBooking } from "./hooks";

function Actions({ booking }) {
  const navigate = useNavigate();
  const { checkout } = useCheckout();
  const { deleteBooking, isPending } = useDeleteBooking();
  const [confirming, setConfirming] = useState(false);

  return (
    <>
      <Menu
        as={Link}
        label={`Actions for booking ${booking.id}`}
        items={[
          { label: "See details", icon: Eye, to: `/bookings/${booking.id}` },
          {
            label: "Check in",
            icon: ArrowDownToLine,
            to: `/checkin/${booking.id}`,
            hidden: booking.status !== "unconfirmed",
          },
          {
            label: "Check out",
            icon: ArrowUpFromLine,
            onClick: () => checkout(booking.id),
            hidden: booking.status !== "checked-in",
          },
          { label: "Invoice", icon: FileText, onClick: () => navigate(`/bookings/${booking.id}/invoice`) },
          { label: "Delete booking", icon: Trash2, onClick: () => setConfirming(true), danger: true },
        ]}
      />
      <ConfirmDialog
        open={confirming}
        onClose={() => setConfirming(false)}
        title={`Delete booking #${booking.id}?`}
        message={`This permanently removes ${booking.guest.fullName}'s stay in ${booking.cabin.name}.`}
        loading={isPending}
        onConfirm={() => deleteBooking(booking.id, { onSuccess: () => setConfirming(false) })}
      />
    </>
  );
}

export default function BookingList({ bookings, dimmed }) {
  return (
    <div className={cn("transition-opacity", dimmed && "opacity-60")}>
      {/* Desktop: table */}
      <div className="card hidden md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-border text-xs tracking-wider text-muted uppercase">
              <th className="py-3 pl-6 font-semibold">Booking</th>
              <th className="py-3 font-semibold">Guest</th>
              <th className="py-3 font-semibold">Dates</th>
              <th className="py-3 font-semibold">Status</th>
              <th className="py-3 pr-4 text-right font-semibold">Amount</th>
              <th className="w-14 py-3 pr-4">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {bookings.map((b) => (
              <tr key={b.id} className="group transition-colors hover:bg-surface-2/60">
                <td className="py-3.5 pl-6">
                  <Link to={`/bookings/${b.id}`} className="font-semibold hover:text-accent">
                    #{b.id}
                  </Link>
                  <p className="text-xs text-muted">{b.cabin.name.replace(/^The /, "")}</p>
                </td>
                <td className="py-3.5">
                  <div className="flex items-center gap-2.5">
                    <Flag code={b.guest.countryCode} country={b.guest.nationality} />
                    <div className="min-w-0">
                      <p className="truncate font-medium">{b.guest.fullName}</p>
                      <p className="truncate text-xs text-muted">{b.guest.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3.5">
                  <p className="font-medium">
                    {relativeDay(b.startDate)} <span className="text-muted">· {b.numNights} nights</span>
                  </p>
                  <p className="text-xs text-muted">
                    {formatDate(b.startDate, "MMM d")} → {formatDate(b.endDate, "MMM d, yyyy")}
                  </p>
                </td>
                <td className="py-3.5">
                  <StatusBadge status={b.status} />
                </td>
                <td className="py-3.5 pr-4 text-right font-semibold tabular-nums">
                  {formatCurrency(b.totalPrice)}
                  {!b.isPaid && <p className="text-xs font-normal text-warn">Unpaid</p>}
                </td>
                <td className="py-3.5 pr-4 text-right">
                  <Actions booking={b} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile: cards */}
      <ul className="flex flex-col gap-3 md:hidden">
        {bookings.map((b) => (
          <li key={b.id} className="card p-4">
            <div className="flex items-start justify-between gap-3">
              <Link to={`/bookings/${b.id}`} className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <Flag code={b.guest.countryCode} country={b.guest.nationality} />
                  <p className="truncate font-semibold">{b.guest.fullName}</p>
                </div>
                <p className="mt-0.5 text-xs text-muted">
                  #{b.id} · {b.cabin.name}
                </p>
              </Link>
              <Actions booking={b} />
            </div>
            <div className="mt-3 flex items-end justify-between gap-3">
              <div className="text-sm">
                <p className="font-medium">{relativeDay(b.startDate)}</p>
                <p className="text-xs text-muted">
                  {formatDate(b.startDate, "MMM d")} → {formatDate(b.endDate, "MMM d")} · {b.numNights} nights
                </p>
              </div>
              <div className="flex flex-col items-end gap-1">
                <StatusBadge status={b.status} />
                <p className="text-sm font-semibold tabular-nums">{formatCurrency(b.totalPrice)}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
