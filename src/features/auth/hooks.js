import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import * as api from "../../services/api";

export function useUser() {
  const { data: user, isPending } = useQuery({ queryKey: ["user"], queryFn: api.getCurrentUser, staleTime: Infinity });
  return { user, isPending, isAuthenticated: Boolean(user) };
}

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: login, isPending } = useMutation({
    mutationFn: api.login,
    onSuccess: (user) => {
      queryClient.setQueryData(["user"], user);
      toast.success(`Welcome back, ${user.fullName.split(" ")[0]} 🤘`);
      navigate("/dashboard", { replace: true });
    },
    onError: (err) => toast.error(err.message),
  });
  return { login, isPending };
}

export function useLogout() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: logout, isPending } = useMutation({
    mutationFn: api.logout,
    onSuccess: () => {
      queryClient.clear();
      queryClient.setQueryData(["user"], null);
      navigate("/login", { replace: true });
    },
  });
  return { logout, isPending };
}

export function useSignup() {
  const queryClient = useQueryClient();
  const { mutate: signup, isPending } = useMutation({
    mutationFn: api.signup,
    onSuccess: (user) => {
      toast.success(`${user.fullName} can now sign in with ${user.email}.`);
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (err) => toast.error(err.message),
  });
  return { signup, isPending };
}

export function useUsers() {
  const { data: users = [], isPending } = useQuery({ queryKey: ["users"], queryFn: api.getUsers });
  return { users, isPending };
}

export function useUpdateUser() {
  const queryClient = useQueryClient();
  const { mutate: updateUser, isPending } = useMutation({
    mutationFn: api.updateCurrentUser,
    onSuccess: (user) => {
      queryClient.setQueryData(["user"], user);
      queryClient.invalidateQueries({ queryKey: ["users"] });
      toast.success("Account updated.");
    },
    onError: (err) => toast.error(err.message),
  });
  return { updateUser, isPending };
}
