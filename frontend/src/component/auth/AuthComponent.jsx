import { UserContext } from "@/contexts/userContext";
import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function AuthComponent({ children }) {
  const { userData } = useContext(UserContext);
  if (!userData) {
    return <Navigate to={"/login"} replace={true} />;
  }
  return (
    <Outlet/>
  );
}
