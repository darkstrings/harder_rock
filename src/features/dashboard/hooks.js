import { useQuery } from "@tanstack/react-query";
import { format, subDays } from "date-fns";
import { useSearchParams } from "react-router";
import * as api from "../../services/api";
import { STATUS } from "../../lib/bookings";

export function useDashboardRange() {
  const [searchParams] = useSearchParams();
  const n = Number(searchParams.get("last"));
  return [7, 30, 90].includes(n) ? n : 7;
}

export function useRecentBookings() {
  const numDays = useDashboardRange();
  const since = subDays(new Date(), numDays).toISOString();
  const { data: bookings = [], isPending } = useQuery({
    queryKey: ["bookings", "recent", numDays],
    queryFn: () => api.getBookingsAfterDate(since),
  });
  return { bookings, isPending, numDays };
}

export function useRecentStays() {
  const numDays = useDashboardRange();
  const since = format(subDays(new Date(), numDays), "yyyy-MM-dd");
  const { data: stays = [], isPending } = useQuery({
    queryKey: ["stays", "recent", numDays],
    queryFn: () => api.getStaysAfterDate(since),
  });
  const confirmedStays = stays.filter((s) => s.status === STATUS.CHECKED_IN || s.status === STATUS.CHECKED_OUT);
  return { stays, confirmedStays, isPending, numDays };
}

export function useTodayActivity() {
  const { data: activities = [], isPending } = useQuery({ queryKey: ["today"], queryFn: api.getTodayActivity });
  return { activities, isPending };
}
