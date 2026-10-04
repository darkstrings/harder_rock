import { useEffect, useState } from "react";
import { getCurrentUser } from "../../services/apiAuth";

export function useUser() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasAttemptedAuth, setHasAttemptedAuth] = useState(false);

  useEffect(() => {
    async function fetchUser() {
      const currentUser = await getCurrentUser();
      setUser(currentUser);
      setIsLoading(false);
      setHasAttemptedAuth(true);
    }
    fetchUser();
  }, []);

  return {
    user,
    isAuthenticated: Boolean(user),
    isLoading: !hasAttemptedAuth || isLoading,
  };
}
