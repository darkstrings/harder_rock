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
/*

This was changed to useQueryData later in the course but I'll leave this here for shits and giggles.

Here's a breakdown of what's happening:

queryClient.setQueriesData is a method provided by the React Query library that allows you to manually update the cached data for one or more queries.

The first argument, 
["user"], is an array containing the query key(s) for which you want to update the cached data. In this case, it's a single query key "user", which likely represents a query for fetching user data.

The second argument, data.user, is the new data that should be cached for the "user" query key.

So, when this line of code is executed, it updates the cached data for the "user" query key with the value of data.user. This means that any components or parts of the application that rely on the "user" query will now have access to the updated user data without having to refetch it from the API or source.

The data object likely comes from a successful API request, mutation, or some other operation that fetches or updates the user data. By using data.user, you're extracting the relevant user data from the data object and using it to update the cache.

This approach can be useful in scenarios where you want to immediately reflect changes in the user data throughout the application, such as after a successful authentication, registration, or profile update operation, without having to refetch the data from the API or source.
*/
