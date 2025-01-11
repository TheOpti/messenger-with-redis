import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Friend } from "@/providers/FriendsProvider";
import { Chatbox } from "./chatbox";

interface Props {
  activeFriend?: Friend;
}

export const Chat = (props: Props) => {
  const { activeFriend } = props;

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

  return (
    <div className="flex flex-col flex-1">
      <header className="flex items-center justify-between px-4 py-2 border-b h-16">
        <h1 className="font-semibold">
          Messages from {activeFriend?.username}
        </h1>
      </header>
      <main className="flex-1 overflow-y-auto p-4 space-y-4 flex flex-col justify-end">
        <div className="flex items-end space-x-2">
          <Avatar>
            <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="opacity-50 text-xs py-1">name of the user</div>
            <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
              <p className="text-sm">Hello everyone!</p>
            </div>
          </div>
        </div>
        <div className="flex items-end space-x-2">
          <Avatar>
            <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div className="p-2 rounded-lg bg-gray-100 dark:bg-gray-800">
            <p className="text-sm">How's it going?</p>
          </div>
        </div>
        <div className="flex items-end justify-end space-x-2">
          <div className="p-2 rounded-lg bg-blue-500 text-white">
            <p className="text-sm">
              Hello! It's going well, thanks for asking.
            </p>
          </div>
          <Avatar>
            <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex items-end justify-end space-x-2">
          <div className="p-2 rounded-lg bg-blue-500 text-white">
            <p className="text-sm">What about you?</p>
          </div>
          <Avatar>
            <AvatarImage src="/placeholder-user.jpg" alt="User Avatar" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
        </div>
      </main>
      <Chatbox friendId={activeFriend.userid} />
    </div>
  );
};
