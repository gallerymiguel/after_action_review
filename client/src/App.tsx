import { ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { CssBaseline, Box, Container } from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";
import NavigationBar from "./components/nav";
import "./App.css";

// Create HTTP link for Apollo Client
const httpLink = createHttpLink({
  uri: "http://localhost:3001/graphql", // Ensure this matches your backend URL
  credentials: "include", // Allows cookies and authorization headers
});

// Set Auth Context for Apollo Client
const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("id_token");
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
    },
  };
});

// Initialize Apollo Client
const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

// Debug Component to Log Current Location
const DebugLocation: React.FC = () => {
  const location = useLocation();
  console.log("Current Path:", location.pathname);
  return null; // This component doesn't render anything on the UI
};

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <CssBaseline />
      <NavigationBar />
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh", // ✅ minHeight instead of height
          overflow: "auto", // ✅ allow scrolling
        }}
      >
        {/* Main Content Area */}
        <Container
          maxWidth={false}
          sx={{
            width: "100vw",
            maxWidth: "100%",
            flexGrow: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center",
            px: 0,
          }}
        >
          <DebugLocation />
          <Outlet />
        </Container>

        {/* Footer at the bottom */}
        <Box
          component="footer"
          sx={{
            width: "100vw",
            backgroundColor: "#f5f5f5",
            py: 2,
            textAlign: "center",
          }}
        >
          <Container maxWidth="lg">© {new Date().getFullYear()} AAR Platform</Container>
        </Box>
      </Box>
    </ApolloProvider>
  );
};

export default App;