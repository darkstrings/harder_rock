import { Navigate, useLocation } from "react-router";
import { useUser } from "../../features/auth/hooks";
import { PageSpinner } from "../ui/Spinner";

export default function ProtectedRoute({ children }) {
  const { isPending, isAuthenticated } = useUser();
  const location = useLocation();
  if (isPending) return <PageSpinner label="Soundchecking…" />;
  if (!isAuthenticated) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}
