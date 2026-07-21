import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useAuth = () => {
  const context = useContext(AuthContext);
  
  // 🌟 The Safety Guard: Warns you instantly if context is placed out of bounds
  if (!context) {
    throw new Error("useAuth must be called inside an AuthProvider workspace element");
  }
  
  return context;
};