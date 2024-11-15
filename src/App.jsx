import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import Bookings from "./pages/Bookings";
import Cabins from "./pages/Cabins";
import Users from "./pages/Users";
import Settings from "./pages/Settings";
import Account from "./pages/Account";
import Login from "./pages/Login";
import PageNotFound from "./pages/PageNotFound";
import GlobalStyles from "./styles/GlobalStyles";
import AppLayout from "./ui/AppLayout";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Toaster } from "react-hot-toast";
import Booking from "./pages/Booking";
import CheckIn from "./pages/CheckIn";
import ProtectedRoute from "./ui/ProtectedRoute";
import { DarkModeProvider } from "./context/DarkModeContext";

// For react query, here's how you set it up. (Sets up the cache behind the scenes)
const queryClient = new QueryClient({
  // And options for overriding settings
  defaultOptions: {
    queries: {
      // Sets how long before it re-fetches.
      staleTime: 60 * 1000,
    },
  },
});

function App() {
  return (
    <DarkModeProvider>
      <QueryClientProvider client={queryClient}>
        {/* The QueryCLientProvider is what you wrap the whole thing in to provide the remote state to the app 
        set "client" to the var you make above from the new QueryClient above
        install the devtools with "npm i @tanstack/react-query-devtools" apply it by putting it just below QueryClientProvider
        */}
        <ReactQueryDevtools initialIsOpen={false} />
        {/* 
      2 changes from ReactQueryDevTools v4 to v5:
       isLoading is now called isPending
      The cacheTime option is now called gcTime */}
        <GlobalStyles />
        <BrowserRouter>
          <Routes>
            <Route
              element={
                <ProtectedRoute>
                  <AppLayout />
                </ProtectedRoute>
              }>
              <Route index element={<Navigate replace to="dashboard" />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="bookings" element={<Bookings />} />
              <Route path="cabins" element={<Cabins />} />
              <Route path="users" element={<Users />} />
              <Route path="settings" element={<Settings />} />
              <Route path="account" element={<Account />} />
              <Route path="bookings/:bookingId" element={<Booking />} />
              <Route path="checkIn/:bookingId" element={<CheckIn />} />
            </Route>
            <Route path="login" element={<Login />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
        <Toaster
          position="top-center"
          gutter={12}
          containerStyle={{ margin: "8px" }}
          toastOptions={{
            success: {
              duration: 3000,
            },
            error: {
              duration: 5000,
            },
            style: {
              fontSize: "16px",
              maxWidth: "500px",
              padding: "16px 24px",
              backgroundColor: "var(--color-grey-0)",
              color: "var(--color-grey-700)",
            },
          }}
        />
      </QueryClientProvider>
    </DarkModeProvider>
  );
}
export default App;

/**
 * THINGS TO ADD/ADJUST
 * A BUTTON TO ADD A BOOKING. CAN PROBABLY REUSE A LOT FROM THE CABINS LOGIC.
 * EDIT BOOKINGS
 * EDIT PRICES
 * GENERATE PDF INVOICE
 *
 *
 *
 */
