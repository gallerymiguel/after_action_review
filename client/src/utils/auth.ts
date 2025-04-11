// use this to decode a token and get the user's information out of it
import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  data: {
    _id: string;
    username: string;
    email: string;
    role?: string;
  };
  exp: number;
}

// create a new class to instantiate for a user
class Auth {
  // get user data
  getProfile(): JwtPayload["data"] | null {
    try {
      return jwtDecode<JwtPayload>(this.getToken() || "").data;
    } catch (err) {
      return null;
    }
  }

  // check if user's logged in
  loggedIn() {
    // Checks if there is a saved token and it's still valid
    const token = this.getToken();
    return !!token && !this.isTokenExpired(token);
  }

  // check if token is expired
  isTokenExpired(token: string) {
    try {
      const decoded = jwtDecode<JwtPayload>(token);
      return decoded.exp < Date.now() / 1000;
    } catch (err) {
      return false;
    }
  }

  login(idToken: string) {
    // Saves user token to localStorage
    localStorage.setItem("id_token", idToken);
    window.location.assign("/");
  }

  logout() {
    // Clear user token and profile data from localStorage
    localStorage.removeItem("id_token");
    window.location.assign("/");
  }

  getToken() {
    // Retrieves the user token from localStorage
    return localStorage.getItem("id_token");
  }

  isAuthenticated() {
    return this.loggedIn();
  }
}

export default new Auth();
