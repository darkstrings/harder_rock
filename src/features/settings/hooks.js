import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import * as api from "../../services/api";

export function useSettings() {
  const { data: settings, isPending, error } = useQuery({ queryKey: ["settings"], queryFn: api.getSettings });
  return { settings, isPending, error };
}

export function useUpdateSettings() {
  const queryClient = useQueryClient();
  const { mutate: updateSettings, isPending } = useMutation({
    mutationFn: api.updateSettings,
    onSuccess: (settings) => {
      queryClient.setQueryData(["settings"], settings);
      toast.success("Settings saved.");
    },
    onError: (err) => toast.error(err.message),
  });
  return { updateSettings, isPending };
}

export function useResetData() {
  const queryClient = useQueryClient();
  const { mutate: resetData, isPending } = useMutation({
    mutationFn: api.resetData,
    onSuccess: () => {
      const user = queryClient.getQueryData(["user"]);
      queryClient.clear();
      queryClient.setQueryData(["user"], user);
      toast.success("Sample data restored.");
    },
    onError: (err) => toast.error(err.message),
  });
  return { resetData, isPending };
}
