import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login as loginApi } from "../../services/apiAuth";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export function useLogin() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { mutate: login, isLoading } = useMutation({
    mutationFn: ({ email, password }) => loginApi({ email, password }),
    onSuccess: (user) => {
      queryClient.setQueryData(["user"], user.user);
      // This loads the user data into the reactQuery cache, so we don't need to refetch it later

      navigate("/dashboard", { replace: true });
      /**
       "Where the hell did data come from?"
       React Query's useMutation hook returns an object that represents the state of a mutation. This object includes fields like data, loading, and error. The hook also returns a mutate function that can be called to execute the mutation. 
       */
    },
    onError: () => {
      toast.error("Incorrect username and/or password");
    },
  });
  return { login, isLoading };
}
