import "socket.io";

declare module "socket.io" {
  interface Socket {
    user: {
      id: number;
      userid: string;
      username: string;
    };
    request: any;
  }
}
