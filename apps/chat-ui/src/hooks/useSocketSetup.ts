import { FriendsContext } from "@/providers/FriendsProvider";
import { useContext, useEffect } from "react";
import { socket } from "../socket";

export const useSocketSetup = () => {
  const { setFriendsList } = useContext(FriendsContext);

  useEffect(() => {
    console.debug("Attempting to connect to websocket...");

    socket.connect();

    socket.on("friends", (friendsList) => {
      console.debug("!!! socket.on friends ", friendsList);
      setFriendsList(friendsList);
    });

    socket.on("connected", (status, username) => {
      console.debug("!!! socket.on connected ", status, username);
      setFriendsList((prevFriends) =>
        [...prevFriends].map((friend) => {
          if (friend.username === username) {
            friend.connected = status;
          }

          return friend;
        })
      );
    });

    socket.on("connect_error", () => {
      console.debug("Websocket connection error");
    });

    return () => {
      socket.off("friends");
      socket.off("connected");
      socket.off("connection_error");
    };
  }, []);
};
