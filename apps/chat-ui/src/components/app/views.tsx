import { Route, Routes } from "react-router-dom";
import { Login } from "./login";
import { Signup } from "./signup";

export const Views = () => {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Signup />} />
      <Route path="*" element={<Login />} />
    </Routes>
  );
};