import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import { Toaster } from "sonner";
import { ThemeProvider, useTheme } from "./context/ThemeContext";
import AppLayout from "./components/layout/AppLayout";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import { PageSpinner } from "./components/ui/Spinner";
import ErrorPage from "./pages/ErrorPage";
import Login from "./pages/Login";

const queryClient = new QueryClient({
  defaultOptions: { queries: { staleTime: 60 * 1000, refetchOnWindowFocus: false } },
});

// Route-level code splitting: each page is its own chunk.
const page = (loader) => async () => ({ Component: (await loader()).default });

const router = createBrowserRouter([
  {
    errorElement: <ErrorPage />,
    hydrateFallbackElement: <PageSpinner />,
    children: [
      {
        element: (
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        ),
        children: [
          { index: true, element: <Navigate replace to="dashboard" /> },
          { path: "dashboard", lazy: page(() => import("./pages/Dashboard")) },
          { path: "bookings", lazy: page(() => import("./pages/Bookings")) },
          { path: "bookings/new", lazy: page(() => import("./pages/NewBooking")) },
          { path: "bookings/:bookingId", lazy: page(() => import("./pages/Booking")) },
          { path: "bookings/:bookingId/invoice", lazy: page(() => import("./pages/Invoice")) },
          { path: "checkin/:bookingId", lazy: page(() => import("./pages/CheckIn")) },
          { path: "cabins", lazy: page(() => import("./pages/Cabins")) },
          { path: "users", lazy: page(() => import("./pages/Users")) },
          { path: "settings", lazy: page(() => import("./pages/Settings")) },
          { path: "account", lazy: page(() => import("./pages/Account")) },
        ],
      },
      { path: "login", element: <Login /> },
      { path: "*", lazy: page(() => import("./pages/NotFound")) },
    ],
  },
]);

function ThemedToaster() {
  const { isDark } = useTheme();
  return <Toaster position="top-center" theme={isDark ? "dark" : "light"} richColors closeButton />;
}

export default function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
        <ThemedToaster />
        <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
      </QueryClientProvider>
    </ThemeProvider>
  );
}
