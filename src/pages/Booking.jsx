import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { ArrowDownToLine, ArrowLeft, ArrowUpFromLine, BadgeDollarSign, FileText, Trash2 } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import ConfirmDialog from "../components/ui/ConfirmDialog";
import Empty from "../components/ui/Empty";
import { PageSpinner } from "../components/ui/Spinner";
import BookingDataBox from "../features/bookings/BookingDataBox";
import { useBooking, useCheckout, useDeleteBooking, useMarkPaid } from "../features/bookings/hooks";

export default function Booking() {
  const navigate = useNavigate();
  const { booking, isPending, error } = useBooking();
  const { checkout, isPending: checkingOut } = useCheckout();
  const { markPaid, isPending: paying } = useMarkPaid();
  const { deleteBooking, isPending: deleting } = useDeleteBooking();
  const [confirming, setConfirming] = useState(false);

  if (isPending) return <PageSpinner />;
  if (error)
    return (
      <Empty
        title="Booking not found"
        message={error.message}
        action={
          <Button as={Link} to="/bookings" variant="secondary">
            Back to bookings
          </Button>
        }
      />
    );

  return (
    <>
      <Button as={Link} to="/bookings" variant="ghost" size="sm" className="mb-4 -ml-3">
        <ArrowLeft /> All bookings
      </Button>
      <PageHeader
        eyebrow="Booking details"
        title={`Booking #${booking.id}`}
        actions={
          <>
            <Button as={Link} to={`/bookings/${booking.id}/invoice`} variant="secondary">
              <FileText /> Invoice
            </Button>
            <Button variant="secondary" onClick={() => setConfirming(true)}>
              <Trash2 /> Delete
            </Button>
          </>
        }
      />

      <BookingDataBox booking={booking} />

      <div className="mt-6 flex flex-wrap justify-end gap-3">
        {!booking.isPaid && booking.status !== "unconfirmed" && (
          <Button variant="secondary" onClick={() => markPaid(booking.id)} loading={paying}>
            <BadgeDollarSign /> Mark as paid
          </Button>
        )}
        {booking.status === "unconfirmed" && (
          <Button as={Link} to={`/checkin/${booking.id}`}>
            <ArrowDownToLine /> Check in
          </Button>
        )}
        {booking.status === "checked-in" && (
          <Button onClick={() => checkout(booking.id)} loading={checkingOut}>
            <ArrowUpFromLine /> Check out
          </Button>
        )}
      </div>

      <ConfirmDialog
        open={confirming}
        onClose={() => setConfirming(false)}
        title={`Delete booking #${booking.id}?`}
        message={`This permanently removes ${booking.guest.fullName}'s stay in ${booking.cabin.name}.`}
        loading={deleting}
        onConfirm={() => deleteBooking(booking.id, { onSuccess: () => navigate("/bookings") })}
      />
    </>
  );
}
