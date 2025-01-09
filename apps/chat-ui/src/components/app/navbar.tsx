import { UserContext } from "@/providers/UserProvider";
import { useContext } from "react";
import { LogoutButton } from "./logoutButton";
import { ThemeModeToggle } from "./themeModeToggle";

export const Navbar = () => {
  const { user } = useContext(UserContext);

  return (
    <div className="p-4 pb-2 flex justify-between items-center border-b">
      <h1 className="text-lg">Hello in Messenger with Redis app!</h1>
      {user?.loggedIn && (
        <div>
          Logged as <b>{user.username}</b>
        </div>
      )}
      <div className="flex gap-2">
        <ThemeModeToggle />
        {user?.loggedIn && <LogoutButton />}
      </div>
    </div>
  );
};
