import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [side, setSide] = useState("signin");
  return (
    <AuthContext.Provider value={{ side, setSide }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthSide = () => useContext(AuthContext);
