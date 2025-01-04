import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

export const FriendsContext = createContext<{
  friendsList: any[];
  setFriendsList: Dispatch<SetStateAction<any>>;
}>({
  friendsList: [],
  setFriendsList: () => {},
});

export const FriendsProvider = ({ children }: { children: ReactNode }) => {
  const [friendsList, setFriendsList] = useState([]);

  return (
    <FriendsContext.Provider value={{ friendsList, setFriendsList }}>
      {children}
    </FriendsContext.Provider>
  );
};
