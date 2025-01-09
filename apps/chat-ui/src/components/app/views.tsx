import { FriendsProvider } from "@/providers/FriendsProvider";
import { Route, Routes } from "react-router-dom";
import { Home } from "./home";
import { Login } from "./login";
import { PrivateRoutes } from "./privateRoutes";
import { Signup } from "./signup";

export const Views = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Signup />} />
      <Route element={<PrivateRoutes />}>
        <Route
          path="/home"
          element={
            <FriendsProvider>
              <Home />
            </FriendsProvider>
          }
        />
      </Route>
      <Route path="*" element={<Login />} />
    </Routes>
  );
};
