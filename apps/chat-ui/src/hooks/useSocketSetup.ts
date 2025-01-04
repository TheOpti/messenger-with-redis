import { useEffect } from "react";
import { socket } from "../socket";

export const useSocketSetup = () => {
  useEffect(() => {
    console.debug("Attempting to connect to websocket...");
    socket.connect();
    socket.on("connect_error", () => {
      console.debug("Websocket connection error");
    });

    return () => {
      socket.off("connection_error");
    };
  }, []);
};
