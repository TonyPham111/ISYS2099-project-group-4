import { UserContext } from "@/contexts/userContext";
import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ children, condition }) {
  if (!condition) {
    return <Navigate to={"/dashboard"} replace={true} />;
  }
  return (
    <Outlet/>
  );
}
