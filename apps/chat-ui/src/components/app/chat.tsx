import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Friend } from "@/providers/FriendsProvider";
import { MessageContext } from "@/providers/MessageProvider";
import { UserContext } from "@/providers/UserProvider";
import { useContext } from "react";
import { Chatbox } from "./chatbox";

interface Props {
  activeFriend?: Friend;
}

export const Chat = (props: Props) => {
  const { activeFriend } = props;

  const { messages } = useContext(MessageContext);
  const { user } = useContext(UserContext);

  if (!activeFriend) {
    return (
      <div className="flex flex-col flex-1 justify-center">
        <header className="flex items-center justify-between px-4 py-2 border-b h-16">
          <h1 className="font-semibold"></h1>
        </header>
        <main className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col justify-center text-center">
          <h2>Select a user to start chatting!</h2>
        </main>
      </div>
    );
  }

  const displayUserAbbreviation = (name: string) => {
    return name
      .trim()
      .split(/\s+/)
      .map((word: string) => word[0].toUpperCase())
      .join("");
  };

  const displayMsgAuthor = ({
    idx,
    addressedToMe,
  }: {
    idx: number;
    addressedToMe: boolean;
  }) => {
    if (idx === 0) {
      return (
        <div className="opacity-50 text-xs py-1">
          {addressedToMe ? activeFriend.username : user.username}
        </div>
      );
    }

    const isAuthorDifferent =
      filteredMessages[idx - 1]?.from !== filteredMessages[idx]?.from;

    if (isAuthorDifferent) {
      return (
        <div className="opacity-50 text-xs py-1">
          {addressedToMe ? activeFriend.username : user.username}
        </div>
      );
    }
  };

  const filteredMessages = messages
    .filter((msg) => {
      return msg.to === activeFriend.userid || msg.from === activeFriend.userid;
    })
    .sort((a, b) => a.timestamp - b.timestamp);

  return (
    <div className="flex flex-col flex-1">
      <header className="flex items-center justify-between px-4 py-2 border-b h-16">
        <h1 className="font-semibold">
          Messages from {activeFriend?.username}
        </h1>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-4">
        {filteredMessages.map((msg, idx) => {
          const addressedToMe = msg.to === user.userid;

          return (
            <div
              className={`flex items-end space-x-2 ${addressedToMe ? "" : "justify-end"}  `}
              key={msg.id}
            >
              <Avatar className="w-8 h-8">
                <AvatarImage
                  src="/placeholder-user.jpg"
                  alt={addressedToMe ? activeFriend.username : user.username}
                />
                <AvatarFallback>
                  {displayUserAbbreviation(
                    addressedToMe ? activeFriend.username : user.username
                  )}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                {displayMsgAuthor({
                  idx,
                  addressedToMe,
                })}
                <div
                  className={`p-2 rounded-lg ${addressedToMe ? "bg-gray-100 dark:bg-gray-800" : "bg-blue-500 text-white"}`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            </div>
          );
        })}
      </main>
      <Chatbox friendId={activeFriend.userid} />
    </div>
  );
};
