import { useEffect, useState } from "react";
import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import Home from "./pages/home";
import LandingPage from "./pages/landingpage";
import ErrorPage from "./pages/error";
import LoginPage from "./pages/login";
import CreateAccountPage from "./pages/register";
import MissionForm from "./pages/mission_form";
import ReviewPage from "./pages/saving_mission_review";
import MyReviews from "./pages/myreviews";

// ✅ Apollo Client Setup
const httpLink = createHttpLink({
  uri: "http://localhost:3001/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  console.log("🔑 Sending Token in Headers:", token);
  return {
    headers: {
      ...headers,
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// ✅ Function to Check Authentication (Safe Outside of React Components)
const isAuthenticated = () => !!localStorage.getItem("token");

// ✅ Custom Hook to Track Authentication State
const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem("token"));

  useEffect(() => {
    const handleStorageChange = () => {
      setIsAuthenticated(!!localStorage.getItem("token"));
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  return isAuthenticated;
};

// ✅ Protected Route Component (Only Runs `isAuthenticated()` at Runtime)
const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  return isAuthenticated() ? element : <Navigate to="/login" replace />;
};

// ✅ Define Routes (OUTSIDE of React Components)
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: isAuthenticated() ? <Navigate to="/home" replace /> : <LandingPage /> },
      { path: "home", element: <ProtectedRoute element={<Home />} /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <CreateAccountPage /> },
      { path: "review", element: <ProtectedRoute element={<MissionForm />} /> },
      { path: "save_mission", element: <ProtectedRoute element={<ReviewPage />} /> },
      { path: "myreviews", element: <ProtectedRoute element={<MyReviews />} /> },
    ],
  },
]);

// ✅ Wrap the App in ApolloProvider and Router
ReactDOM.createRoot(document.getElementById("root")!).render(
  <ApolloProvider client={client}>
    <RouterProvider router={router} />
  </ApolloProvider>
);