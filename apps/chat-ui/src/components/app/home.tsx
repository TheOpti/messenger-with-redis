import { useSocketSetup } from "@/hooks/useSocketSetup";
import { Chat } from "./chat";
import { Sidebar } from "./sidebar";

export const Home = () => {
  useSocketSetup();

  return (
    <div className="flex h-full flex-1">
      <Sidebar />
      <Chat />
    </div>
  );
};
