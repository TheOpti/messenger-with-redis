import { Friend, FriendsContext } from "@/providers/FriendsProvider";
import { UserPlus } from "lucide-react";
import { Dispatch, SetStateAction, useContext, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import { AddFriendModal } from "./addFriendModal";

interface Props {
  activeFriend?: Friend;
  setActiveFriend: Dispatch<SetStateAction<Friend | undefined>>;
}

export const Sidebar = (props: Props) => {
  const { activeFriend, setActiveFriend } = props;
  const [modalOpen, setModalOpen] = useState(false);
  const { friendsList } = useContext(FriendsContext);

  return (
    <>
      <div className="w-1/4 border-r">
        <header className="flex items-center justify-between px-4 py-2 border-b h-16">
          <h1 className="font-semibold">Add friend</h1>
          <Button
            variant="outline"
            size="icon"
            onClick={() => setModalOpen(true)}
          >
            <UserPlus />
          </Button>
        </header>
        <div className="font-semibold px-4 py-3">Friends list</div>
        <div className="grid gap-4 px-2">
          {friendsList.length === 0 && (
            <div className="px-2 py-3 text-center">No friends :(</div>
          )}

          {friendsList.map((friend) => (
            <div
              className={`flex items-center gap-2 rounded-lg p-3 transition-colors cursor-pointer hover:bg-muted/50 ${activeFriend?.userid === friend.userid ? "bg-muted/50" : ""}`}
              key={friend.userid}
              onClick={() => setActiveFriend(friend)}
            >
              <Avatar className="w-8 h-8">
                <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
                <AvatarFallback className="text-xs font-bold">
                  {friend.username
                    .trim()
                    .split(/\s+/)
                    .map((word: string) => word[0].toUpperCase())
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <div className="font-medium truncate">{friend.username}</div>
                  <span
                    className={`h-3 w-3 rounded-full mr-2 ${friend.connected === "1" ? "bg-green-500" : "bg-red-500"}`}
                  ></span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <AddFriendModal open={modalOpen} setOpen={setModalOpen} />
    </>
  );
};
