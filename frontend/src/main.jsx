import React from "react";
import ReactDOM from "react-dom/client";
import Root from "./routes/Root/";
import ErrorPage from "./routes/Error/";
import Result from "./routes/Result/";
import RootLayout from "./layout/RootLayout";
import LoginPage from "./routes/LoginPage/";
import SignUpPage from "./routes/SignUpPage/";
import Account from "./routes/Account/";
import Subscription from "./routes/Subscription/";
import "./index.css";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { UserProvider } from "./context/user-context";
const queryClient = new QueryClient();
const router = createBrowserRouter([
  {
    element: <RootLayout />,

    children: [
      {
        path: "/",
        element: <Root />,
      },
      { path: "/result/:addr", element: <Result /> },
      {
        path: "/login",
        element: <LoginPage />,
      },
      {
        path: "/signup",
        element: <SignUpPage />,
      },
      {
        path: "/account",
        element: <Account />,
      },
      {
        path: "/subscription",
        element: <Subscription />,
      },
      {
        path: "*",
        element: <ErrorPage />,
      },
    ],
  },
]);
ReactDOM.createRoot(document.getElementById("root")).render(
  <GoogleOAuthProvider clientId="636697631644-53daq1qm02nk6lr832oghb78h9lin8tg.apps.googleusercontent.com">
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <UserProvider>
          <RouterProvider router={router} />
        </UserProvider>
        {/* <ReactQueryDevtools initialIsOpen={false} /> */}
      </QueryClientProvider>
    </React.StrictMode>
  </GoogleOAuthProvider>
);
