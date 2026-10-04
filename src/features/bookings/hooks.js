import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams, useSearchParams } from "react-router";
import { toast } from "sonner";
import * as api from "../../services/api";
import { PAGE_SIZE } from "../../lib/constants";
import { STATUS } from "../../lib/bookings";

// Every booking change can affect lists, details, the dashboard and today's activity.
const invalidateAll = (queryClient) =>
  ["bookings", "booking", "stays", "today", "guests"].forEach((key) =>
    queryClient.invalidateQueries({ queryKey: [key] }),
  );

export function useBookings() {
  const queryClient = useQueryClient();
  const [searchParams] = useSearchParams();
  const params = {
    status: searchParams.get("status") || "all",
    sortBy: searchParams.get("sortBy") || "startDate-desc",
    search: searchParams.get("q") || "",
    page: Number(searchParams.get("page")) || 1,
  };

  const { data, isPending, isFetching, error } = useQuery({
    queryKey: ["bookings", "list", params],
    queryFn: () => api.getBookings(params),
    placeholderData: keepPreviousData,
  });

  const pageCount = Math.ceil((data?.count ?? 0) / PAGE_SIZE);
  for (const page of [params.page - 1, params.page + 1]) {
    if (page >= 1 && page <= pageCount) {
      const p = { ...params, page };
      queryClient.prefetchQuery({ queryKey: ["bookings", "list", p], queryFn: () => api.getBookings(p) });
    }
  }

  return { bookings: data?.data ?? [], count: data?.count ?? 0, isPending, isFetching, error };
}

export function useBooking() {
  const { bookingId } = useParams();
  const { data: booking, isPending, error } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => api.getBooking(bookingId),
    retry: false,
  });
  return { booking, isPending, error };
}

export function useGuests() {
  const { data: guests = [], isPending } = useQuery({ queryKey: ["guests"], queryFn: api.getGuests });
  return { guests, isPending };
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: createBooking, isPending } = useMutation({
    mutationFn: api.createBooking,
    onSuccess: (booking) => {
      toast.success(`Booking #${booking.id} created.`);
      invalidateAll(queryClient);
      navigate(`/bookings/${booking.id}`);
    },
    onError: (err) => toast.error(err.message),
  });
  return { createBooking, isPending };
}

export function useDeleteBooking() {
  const queryClient = useQueryClient();
  const { mutate: deleteBooking, isPending } = useMutation({
    mutationFn: api.deleteBooking,
    onSuccess: (_, id) => {
      toast.success(`Booking #${id} deleted.`);
      invalidateAll(queryClient);
    },
    onError: (err) => toast.error(err.message),
  });
  return { deleteBooking, isPending };
}

export function useCheckin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: checkin, isPending } = useMutation({
    mutationFn: ({ bookingId, breakfast = {} }) =>
      api.updateBooking(bookingId, { status: STATUS.CHECKED_IN, isPaid: true, ...breakfast }),
    onSuccess: (booking) => {
      toast.success(`${booking.guest.fullName} is checked in. Rock on!`);
      invalidateAll(queryClient);
      navigate("/dashboard");
    },
    onError: (err) => toast.error(err.message),
  });
  return { checkin, isPending };
}

export function useCheckout() {
  const queryClient = useQueryClient();
  const { mutate: checkout, isPending } = useMutation({
    mutationFn: (bookingId) => api.updateBooking(bookingId, { status: STATUS.CHECKED_OUT }),
    onSuccess: (booking) => {
      toast.success(`Booking #${booking.id} checked out.`);
      invalidateAll(queryClient);
    },
    onError: (err) => toast.error(err.message),
  });
  return { checkout, isPending };
}

export function useMarkPaid() {
  const queryClient = useQueryClient();
  const { mutate: markPaid, isPending } = useMutation({
    mutationFn: (bookingId) => api.updateBooking(bookingId, { isPaid: true }),
    onSuccess: (booking) => {
      toast.success(`Booking #${booking.id} marked as paid.`);
      invalidateAll(queryClient);
    },
    onError: (err) => toast.error(err.message),
  });
  return { markPaid, isPending };
}
