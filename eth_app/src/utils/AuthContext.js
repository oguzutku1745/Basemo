import { createContext } from "react";

export const AuthContext = createContext({
    allowed: false,
  setAllowed: () => {},
});
