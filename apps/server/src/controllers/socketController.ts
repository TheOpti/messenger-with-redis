import { Socket } from "socket.io";

export const authorizeUser = (socket: Socket, next: (err?: Error) => void) => {
  if (!socket.request?.session?.user) {
    console.debug("Bad request");
    next(new Error("Not authorized"));

    return;
  }

  next();
};
