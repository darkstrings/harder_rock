import { Link } from "react-router";
import { Plus } from "lucide-react";
import PageHeader from "../components/ui/PageHeader";
import Button from "../components/ui/Button";
import Segmented from "../components/ui/Segmented";
import SortSelect from "../components/ui/SortSelect";
import SearchInput from "../components/ui/SearchInput";
import Pagination from "../components/ui/Pagination";
import Empty from "../components/ui/Empty";
import { PageSpinner } from "../components/ui/Spinner";
import BookingList from "../features/bookings/BookingList";
import { useBookings } from "../features/bookings/hooks";

export default function Bookings() {
  const { bookings, count, isPending, isFetching } = useBookings();

  return (
    <>
      <PageHeader
        eyebrow="Front desk"
        title="Bookings"
        description="Every stay, past and upcoming. Filter, search and manage them here."
        actions={
          <Button as={Link} to="/bookings/new">
            <Plus /> New booking
          </Button>
        }
      />

      <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <SearchInput placeholder="Search guest, cabin or #id" />
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <Segmented
            param="status"
            label="Filter by status"
            options={[
              { value: "all", label: "All" },
              { value: "unconfirmed", label: "Unconfirmed" },
              { value: "checked-in", label: "Checked in" },
              { value: "checked-out", label: "Checked out" },
            ]}
          />
          <SortSelect
            options={[
              { value: "startDate-desc", label: "Date: latest first" },
              { value: "startDate-asc", label: "Date: earliest first" },
              { value: "totalPrice-desc", label: "Amount: high to low" },
              { value: "totalPrice-asc", label: "Amount: low to high" },
            ]}
          />
        </div>
      </div>

      {isPending ? (
        <PageSpinner />
      ) : bookings.length ? (
        <div className="flex flex-col gap-4">
          <BookingList bookings={bookings} dimmed={isFetching} />
          <Pagination count={count} />
        </div>
      ) : (
        <Empty title="No bookings found" message="Try a different filter or search term." />
      )}
    </>
  );
}
