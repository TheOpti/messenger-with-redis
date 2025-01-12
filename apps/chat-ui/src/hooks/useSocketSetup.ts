import { FriendsContext } from "@/providers/FriendsProvider";
import { MessageContext } from "@/providers/MessageProvider";
import { useContext, useEffect } from "react";
import { socket } from "../socket";

export const useSocketSetup = () => {
  const { setFriendsList } = useContext(FriendsContext);
  const { setMessages } = useContext(MessageContext);

  useEffect(() => {
    socket.connect();

    socket.on("friends", (friendsList) => {
      setFriendsList(friendsList);
    });

    socket.on("connected", (status, username) => {
      setFriendsList((prevFriends) =>
        [...prevFriends].map((friend) => {
          if (friend.username === username) {
            friend.connected = status;
          }

          return friend;
        })
      );
    });

    socket.on("messages", (allMessages) => {
      setMessages(allMessages);
    });

    socket.on("message_added", (newMessage) => {
      setMessages((prevMessages) => [...prevMessages, newMessage]);
    });

    socket.on("connect_error", () => {
      console.debug("Websocket connection error");
    });

    return () => {
      socket.off("friends");
      socket.off("connected");
      socket.off("messages");
      socket.off("message_added");
      socket.off("connection_error");
    };
  }, []);
};
