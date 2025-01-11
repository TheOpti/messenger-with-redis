import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useState,
} from "react";

export type Message = {
  id?: string;
  to: string;
  from: string;
  content: string;
  timestamp: number;
};

export const MessageContext = createContext<{
  messages: Message[];
  setMessages: Dispatch<SetStateAction<Message[]>>;
}>({
  messages: [],
  setMessages: () => {},
});

export const MessageProvider = ({ children }: { children: ReactNode }) => {
  const [messages, setMessages] = useState<Message[]>([]);

  return (
    <MessageContext.Provider value={{ messages, setMessages }}>
      {children}
    </MessageContext.Provider>
  );
};
