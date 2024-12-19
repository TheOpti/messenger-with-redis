import { Route, Routes } from "react-router-dom";
import { Login } from "./login";
import { PrivateRoutes } from "./privateRoutes";
import { Signup } from "./signup";

export const Views = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Signup />} />
      <Route element={<PrivateRoutes />}>
        <Route path="/home" element={<div>Hello, welcome home</div>} />
      </Route>
      <Route path="*" element={<Login />} />
    </Routes>
  );
};
