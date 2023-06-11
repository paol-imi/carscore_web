import React, { useEffect } from "react";
import jwtDecode from "jwt-decode";
// Create a context
const UserContext = React.createContext();

// Create a provider component
function UserProvider({ children }) {
  const [user, setUser] = React.useState(null);
  useEffect(() => {
    let storedCred = JSON.parse(localStorage.getItem("credential"));
    if (storedCred) {
      // The token is valid, use it to authenticate the .storedUser
      const decodedToken = jwtDecode(storedCred);
      setUser({ ...decodedToken, id_token: storedCred }); // replace this with any user data you have
    }
  }, []);
  useEffect(() => {
    if (user) {
      localStorage.setItem("credential", JSON.stringify(user.id_token));
      localStorage.setItem("exp", JSON.stringify(user.exp));
    } else {
      localStorage.removeItem("credential");
      localStorage.removeItem("exp");
    }
  }, [user]);
  // value to be passed to provider
  const value = { user, setUser };
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

// Custom hook to use the UserContext
function useUser() {
  const context = React.useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}
export { UserProvider, useUser };
