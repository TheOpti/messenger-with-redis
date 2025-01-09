import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

export type Friend = {
  username: string;
  userid: string;
  connected: string;
};

export const FriendsContext = createContext<{
  friendsList: Friend[];
  setFriendsList: Dispatch<SetStateAction<Friend[]>>;
}>({
  friendsList: [],
  setFriendsList: () => {},
});

export const FriendsProvider = ({ children }: { children: ReactNode }) => {
  const [friendsList, setFriendsList] = useState<Friend[]>([]);

  return (
    <FriendsContext.Provider value={{ friendsList, setFriendsList }}>
      {children}
    </FriendsContext.Provider>
  );
};
