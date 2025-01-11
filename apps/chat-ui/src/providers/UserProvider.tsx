import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

export type User = { loggedIn: boolean; username: string; userid: string };

export const UserContext = createContext<{
  user: User;
  setUser: Dispatch<SetStateAction<User>>;
}>({
  user: { loggedIn: false, username: "", userid: "" },
  setUser: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    loggedIn: false,
    username: "",
    userid: "",
  });

  useEffect(() => {
    fetch("http://localhost:3000/auth/login", {
      credentials: "include",
    })
      .then(async (resp) => {
        if (!resp.ok || resp.status >= 400) {
          setUser({ loggedIn: false, username: "", userid: "" });
          return;
        }

        const data = await resp.json();
        setUser({ ...data });
        navigate("/home");
      })
      .catch(() => {
        setUser({ loggedIn: false, username: "", userid: "" });
      });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
