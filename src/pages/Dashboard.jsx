import { format } from "date-fns";
import PageHeader from "../components/ui/PageHeader";
import Segmented from "../components/ui/Segmented";
import { PageSpinner } from "../components/ui/Spinner";
import Stats from "../features/dashboard/Stats";
import SalesChart from "../features/dashboard/SalesChart";
import DurationChart from "../features/dashboard/DurationChart";
import TodayActivity from "../features/dashboard/TodayActivity";
import { useRecentBookings, useRecentStays } from "../features/dashboard/hooks";
import { useCabins } from "../features/cabins/hooks";
import { useUser } from "../features/auth/hooks";

function greeting() {
  const h = new Date().getHours();
  return h < 12 ? "Good morning" : h < 18 ? "Good afternoon" : "Good evening";
}

export default function Dashboard() {
  const { user } = useUser();
  const { bookings, isPending: p1, numDays } = useRecentBookings();
  const { confirmedStays, isPending: p2 } = useRecentStays();
  const { cabins, isPending: p3 } = useCabins();

  return (
    <>
      <PageHeader
        eyebrow={format(new Date(), "EEEE, MMMM d")}
        title={`${greeting()}, ${user?.fullName?.split(" ")[0] ?? "there"}`}
        description="Here's how the hotel is rocking."
        actions={
          <Segmented
            param="last"
            label="Time range"
            options={[
              { value: "7", label: "7 days" },
              { value: "30", label: "30 days" },
              { value: "90", label: "90 days" },
            ]}
          />
        }
      />
      {p1 || p2 || p3 ? (
        <PageSpinner />
      ) : (
        <div className="flex flex-col gap-4 sm:gap-6">
          <Stats bookings={bookings} confirmedStays={confirmedStays} numDays={numDays} cabinCount={cabins.length} />
          <div className="grid grid-cols-1 gap-4 sm:gap-6 xl:grid-cols-2">
            <TodayActivity />
            <DurationChart confirmedStays={confirmedStays} />
          </div>
          <SalesChart bookings={bookings} numDays={numDays} />
        </div>
      )}
    </>
  );
}
