import { useSocketSetup } from "@/hooks/useSocketSetup";
import { Friend } from "@/providers/FriendsProvider";
import { useState } from "react";
import { Chat } from "./chat";
import { Sidebar } from "./sidebar";

export const Home = () => {
  const [activeFriend, setActiveFriend] = useState<Friend>();

  useSocketSetup();

  return (
    <div className="flex h-full flex-1">
      <Sidebar activeFriend={activeFriend} setActiveFriend={setActiveFriend} />
      <Chat activeFriend={activeFriend} />
    </div>
  );
};
