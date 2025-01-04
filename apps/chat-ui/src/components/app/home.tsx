import { useSocketSetup } from "@/hooks/useSocketSetup";
import { FriendsProvider } from "@/providers/FriendsProvider";
import { Chat } from "./chat";
import { Sidebar } from "./sidebar";

export const Home = () => {
  useSocketSetup();

  return (
    <FriendsProvider>
      <div className="flex h-full flex-1">
        <Sidebar />
        <Chat />
      </div>
    </FriendsProvider>
  );
};
