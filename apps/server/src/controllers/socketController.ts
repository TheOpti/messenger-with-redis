import { type Request } from "express";
import { Socket } from "socket.io";
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
