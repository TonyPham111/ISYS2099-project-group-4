import { UserContext } from "@/contexts/userContext";
import { useContext, useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute({ children, condition, redirectTo }) {
  if (!condition) {
    return <Navigate to={redirectTo?redirectTo:'/dashboard'} replace={true} />;
  }
  return (
    <Outlet/>
  );
}
