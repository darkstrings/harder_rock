import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as api from "../../services/api";

export function useCabins() {
  const { data: cabins = [], isPending, error } = useQuery({ queryKey: ["cabins"], queryFn: api.getCabins });
  return { cabins, isPending, error };
}

export function useSaveCabin() {
  const queryClient = useQueryClient();
  const { mutate: saveCabin, isPending } = useMutation({
    mutationFn: ({ data, id }) => api.saveCabin(data, id),
    onSuccess: (cabin, { id }) => {
      toast.success(id ? `${cabin.name} updated.` : `${cabin.name} created.`);
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
    onError: (err) => toast.error(err.message),
  });
  return { saveCabin, isPending };
}

export function useDeleteCabin() {
  const queryClient = useQueryClient();
  const { mutate: deleteCabin, isPending } = useMutation({
    mutationFn: api.deleteCabin,
    onSuccess: () => {
      toast.success("Cabin deleted.");
      queryClient.invalidateQueries({ queryKey: ["cabins"] });
    },
    onError: (err) => toast.error(err.message),
  });
  return { deleteCabin, isPending };
}
