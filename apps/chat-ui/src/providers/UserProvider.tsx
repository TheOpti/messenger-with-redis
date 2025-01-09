import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useEffect,
  useState,
} from "react";
import { useNavigate } from "react-router-dom";

export const UserContext = createContext<{
  user: { loggedIn: boolean; username: string };
  setUser: Dispatch<SetStateAction<{ loggedIn: boolean }>>;
}>({
  user: { loggedIn: false, username: "" },
  setUser: () => {},
});

export const UserProvider = ({ children }: { children: ReactNode }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState({ loggedIn: false });

  useEffect(() => {
    fetch("http://localhost:3000/auth/login", {
      credentials: "include",
    })
      .then(async (resp) => {
        if (!resp.ok || resp.status >= 400) {
          setUser({ loggedIn: false });
          return;
        }

        const data = await resp.json();
        setUser({ ...data });
        navigate("/home");
      })
      .catch(() => {
        setUser({ loggedIn: false });
      });
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
