import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { RouterProvider, createBrowserRouter, Navigate } from "react-router-dom";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import LandingPage from "./pages/landingpage"; // ✅ Landing page for all users
import ErrorPage from "./pages/error";
import LoginPage from "./pages/login";
import CreateAccountPage from "./pages/register";
import MissionForm from "./pages/mission_form";
import ReviewPage from "./pages/saving_mission_review";
import MyReviews from "./pages/myreviews";

// ✅ Create Apollo Client with Authorization Headers
const httpLink = createHttpLink({
  uri: "http://localhost:3001/graphql",
});

const authLink = setContext(() => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      Authorization: token ? `Bearer ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// ✅ Function to Check Authentication
const isAuthenticated = () => !!localStorage.getItem("token");

// ✅ Protected Route Component
const ProtectedRoute = ({ element }: { element: JSX.Element }) => {
  return isAuthenticated() ? element : <Navigate to="/" replace />; // ✅ Redirects to Landing Page
};

// ✅ Define Routes (Removed `/home`)
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <LandingPage /> }, // ✅ Landing page is the default
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <CreateAccountPage /> },
      { path: "review", element: <ProtectedRoute element={<MissionForm />} /> },
      { path: "save_mission", element: <ProtectedRoute element={<ReviewPage />} /> },
      { path: "myreviews", element: <ProtectedRoute element={<MyReviews />} /> },
    ],
  },
]);

// ✅ Wrap the app with ApolloProvider
ReactDOM.createRoot(document.getElementById("root")!).render(
  <ApolloProvider client={client}>
    <RouterProvider router={router} />
  </ApolloProvider>
);