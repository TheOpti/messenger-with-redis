import { UserContext } from "@/providers/UserProvider";
import { useContext, useEffect, useState } from "react";
import { socket } from "../../socket";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

interface Props {
  friendId: string;
}

export const Chatbox = (props: Props) => {
  const { friendId } = props;

  const { user } = useContext(UserContext);
  const [value, setValue] = useState("");

  useEffect(() => {
    setValue("");
  }, [friendId]);

  const sendMessage = () => {
    const message = {
      to: friendId,
      from: user.userid,
      content: value,
    };

    socket.emit("add_message", message);
    setValue("");
  };

  return (
    <footer className="flex items-center space-x-2 p-4 border-t h-16">
      <Input
        className="flex-1"
        placeholder="Type a message"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button variant="outline" size="sm" onClick={sendMessage}>
        Send
      </Button>
    </footer>
  );
};
