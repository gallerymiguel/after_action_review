import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { ApolloClient,ApolloProvider, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import App from "./App";
import "./index.css";
import HomePage from "./pages/landingpage";
import ErrorPage from "./pages/error";
import LoginPage from "./pages/login";
import CreateAccountPage from "./pages/register";
import MissionForm from "./pages/mission_form";
import ReviewPage from "./pages/saving_mission_review";



const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Uses App.tsx as the layout
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <CreateAccountPage /> },
      { path: "form", element: <MissionForm /> },
      { path: "save_mission", element: <ReviewPage /> },
    ],
  },
]);

const httpLink = createHttpLink({
  uri: '/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : '',
    }
  };
});

export const client = new ApolloClient({
  link: from([authLink, httpLink]),
  cache: new InMemoryCache()
});

ReactDOM.createRoot(document.getElementById("root")!).render(
  <ApolloProvider client={client}>
  <RouterProvider router={router} />
  </ApolloProvider>
);
