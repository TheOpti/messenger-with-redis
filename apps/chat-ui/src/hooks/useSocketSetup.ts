import { FriendsContext } from "@/providers/FriendsProvider";
import { useContext, useEffect } from "react";
import { socket } from "../socket";

export const useSocketSetup = () => {
  const { setFriendsList } = useContext(FriendsContext);

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

    socket.on("messages", (data) => {
      console.debug("socket.on messages, data ", data);
    });

    socket.on("message_added", (data) => {
      console.debug("socket.on message_added, data ", data);
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
