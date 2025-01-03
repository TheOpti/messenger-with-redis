import { Chat } from "./chat";
import { Sidebar } from "./sidebar";

export const Home = () => {
  return (
    <div className="flex h-full flex-1">
      <Sidebar />
      <Chat />
    </div>
  );
};
