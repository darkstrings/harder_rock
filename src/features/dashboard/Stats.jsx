import { BedDouble, CalendarCheck, DollarSign, Ticket } from "lucide-react";
import Stat from "./Stat";
import { formatCurrency } from "../../lib/utils";

export default function Stats({ bookings, confirmedStays, numDays, cabinCount }) {
  const sales = bookings.reduce((sum, b) => sum + b.totalPrice, 0);
  const nights = confirmedStays.reduce((sum, s) => sum + s.numNights, 0);
  const occupancy = cabinCount ? Math.min(1, nights / (numDays * cabinCount)) : 0;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      <Stat icon={Ticket} title="Bookings" value={bookings.length} hint={`made in the last ${numDays} days`} tone="blue" />
      <Stat icon={DollarSign} title="Sales" value={formatCurrency(sales)} hint="from those bookings" tone="green" />
      <Stat icon={CalendarCheck} title="Check-ins" value={confirmedStays.length} hint="stays started" tone="accent" />
      <Stat
        icon={BedDouble}
        title="Occupancy"
        value={`${Math.round(occupancy * 100)}%`}
        hint={`${nights} of ${numDays * cabinCount} cabin-nights`}
        tone="yellow"
      />
    </div>
  );
}
