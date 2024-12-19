import { UserContext } from "@/providers/UserProvider";
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";

export const PrivateRoutes = () => {
  const { user } = useContext(UserContext);

  return user?.loggedIn ? <Outlet /> : <Navigate to="/" />;
};
