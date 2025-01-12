import { type Request } from "express";
import { Socket } from "socket.io";
import { v4 as uuidv4 } from "uuid";
import { redisClient } from "../redis";

export const authorizeUser = (socket: Socket, next: (err?: Error) => void) => {
  const req = socket.request as Request;
  if (!req.session?.user) {
    console.log("Bad request!");
    next(new Error("Not authorized"));
  } else {
    next();
  }
};

export const initializeUser = async (socket: Socket) => {
  const req = socket.request as Request;
  socket.user = { ...req.session.user! };
  socket.join(socket.user.userid);

  await redisClient.hset(
    `userid:${socket.user.username}`,
    "userid",
    socket.user.userid,
    "connected",
    "1"
  );

  const friendList = await redisClient.lrange(
    `friends:${socket.user.username}`,
    0,
    -1
  );

  const parsedFriendList = await parseFriendList(friendList);
  const friendRooms = parsedFriendList.map((friend) => friend.userid);
  socket.to(friendRooms).emit("connected", "1", socket.user.username);

  socket.emit("friends", parsedFriendList);

  const msgQuery = await redisClient.lrange(
    `chat:${socket.user.userid}`,
    0,
    -1
  );

  const messages = msgQuery.map((msgStr) => {
    const parsedStr = msgStr.split(".");
    return {
      id: parsedStr[0],
      to: parsedStr[1],
      from: parsedStr[2],
      content: parsedStr[3],
      timestamp: parsedStr[4],
    };
  });

  if (messages && messages.length > 0) {
    socket.emit("messages", messages);
  }
};

export const addFriend = async (
  socket: Socket,
  friendName: string,
  callback: (args: any) => void
) => {
  if (friendName === socket?.user?.username) {
    callback({ done: false, errorMsg: "You cannot add yourself." });
    return;
  }

  const friend = await redisClient.hgetall(`userid:${friendName}`);
  if (!friend.userid) {
    callback({ done: false, errorMsg: "User does not exist." });
    return;
  }

  const userFriends = await redisClient.lrange(
    `friends:${socket?.user?.username}`,
    0,
    -1
  );

  const friendAlreadyAdded = userFriends.some((entry) =>
    entry.startsWith(friendName)
  );
  if (friendAlreadyAdded) {
    callback({ done: false, errorMsg: "Friend already added." });
    return;
  }

  await redisClient.lpush(
    `friends:${socket.user.username}`,
    `${friendName}.${friend.userid}`
  );
  await redisClient.lpush(
    `friends:${friendName}`,
    `${socket.user.username}.${socket.user.userid}`
  );

  const newFriend = {
    username: friendName,
    userid: friend.userid,
    connected: friend.connected,
  };

  callback({ done: true, newFriend });
};

export const onDisconnect = async (socket: Socket) => {
  await redisClient.hset(`userid:${socket.user.username}`, "connected", "0");
  const friendList = await redisClient.lrange(
    `friends:${socket.user.username}`,
    0,
    -1
  );

  const friendRooms = await parseFriendList(friendList).then((friends) =>
    friends.map((friend) => friend.userid)
  );

  socket.to(friendRooms).emit("connected", "0", socket.user.username);
};

const parseFriendList = async (friendList: string[]) => {
  const newFriendList = [];

  for (let friend of friendList) {
    const parsedFriend = friend.split(".");
    const friendConnected = await redisClient.hget(
      `userid:${parsedFriend[0]}`,
      "connected"
    );

    newFriendList.push({
      username: parsedFriend[0],
      userid: parsedFriend[1],
      connected: friendConnected,
    });
  }

  return newFriendList;
};

export type Message = {
  to: string;
  from: string;
  content: string;
};

export const addMessage = async (socket: Socket, message: Message) => {
  if (socket.user.userid !== message.from) {
    socket
      .to(socket.user.userid)
      .emit("message_error", "Could not deliver the message.");

    return;
  }

  const messageToSave = {
    id: uuidv4(),
    timestamp: Date.now(),
    ...message,
  };

  const messageString = [
    messageToSave.id,
    messageToSave.to,
    messageToSave.from,
    messageToSave.content,
    messageToSave.timestamp,
  ].join(".");

  await redisClient.lpush(`chat:${message.to}`, messageString);
  await redisClient.lpush(`chat:${message.from}`, messageString);

  /*
    The socket.to(room).emit() method emits the event to all sockets 
    in the specified room except for the sender's socket.
    If the sender's socket is also in the room, it will not receive the event.
    Docs: https://socket.io/docs/v3/rooms/?utm_source=chatgpt.com
  */
  socket.emit("message_added", messageToSave);
  socket.to(message.to).emit("message_added", messageToSave);
};
