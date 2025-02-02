import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { UserContext } from "@/providers/UserProvider";
import { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { socket } from "../../socket";

export const LogoutButton = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const { toast } = useToast();

  const logout = async () => {
    const res = await fetch("http://localhost:3000/auth/logout", {
      credentials: "include",
    });

    if (!res || !res.ok || res.status >= 400) {
      console.debug("There was a problem with the response");
      return;
    }

    socket.disconnect();
    setUser({ loggedIn: false, userid: "", username: "" });
    navigate("/");
    toast({
      title: "You logged off",
    });
  };

  return (
    <Button
      variant="outline"
      className="inline-flex items-center space-x-2"
      onClick={logout}
    >
      <LogOutIcon className="h-4 w-4" />
      <span>Logout</span>
    </Button>
  );
};

function LogOutIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" x2="9" y1="12" y2="12" />
    </svg>
  );
}
