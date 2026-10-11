import { createContext, useState, useEffect } from "react";

const AuthContext = createContext();

function AuthProvider({ children }) {
   const user = localStorage.getItem("loggedInUser");
   const [loggedInUser, setLoggedInUser] = useState(user ? JSON.parse(user) : null);
   useEffect(() => {
      if (loggedInUser) {
         localStorage.setItem("loggedInUser", JSON.stringify(loggedInUser));
      } else {
         localStorage.removeItem("loggedInUser");
      }
   }, [loggedInUser]);
  return (
    <AuthContext.Provider value={{ loggedInUser, setLoggedInUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContext, AuthProvider };
