import { Socket } from "socket.io";
import { redisClient } from "../redis";

export const authorizeUser = (socket: Socket, next: (err?: Error) => void) => {
  if (!socket.request?.session?.user) {
    console.debug("Bad request");
    next(new Error("Not authorized"));

    return;
  }

  socket.user = { ...socket.request.session.user };

  redisClient.hset(
    `userid:${socket.user.username}`,
    "userid",
    socket.user.userid
  );

  next();
};

export const addFriend = (
  friendsName: string,
  callback: (args: any) => void
) => {
  console.debug("Inside addFriend method. friendsName: ", friendsName);
  callback({ done: true });
};
