import { UserPlus } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";

export const Sidebar = () => {
  return (
    <div className="w-1/4 border-r">
      <header className="flex items-center justify-between px-4 py-2 border-b h-16">
        <h1 className="font-semibold">Add friend</h1>
        <Button variant="outline" size="icon">
          <UserPlus />
        </Button>
      </header>
      <div className="font-semibold px-4 py-3">Friends list</div>
      <div className="grid gap-4 px-2">
        <div className="flex items-center gap-2 hover:bg-muted/50 rounded-lg p-3 transition-colors cursor-pointer">
          <Avatar className="w-8 h-8">
            <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
            <AvatarFallback className="text-xs font-bold">AC</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="font-medium truncate">Acme Inc</div>
              <span className="h-3 w-3 bg-green-500 rounded-full mr-2"></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 hover:bg-muted/50 rounded-lg p-3 transition-colors cursor-pointer">
          <Avatar className="w-8 h-8">
            <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
            <AvatarFallback className="text-xs font-bold">AC</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="font-medium truncate">Acme Inc</div>
              <span className="h-3 w-3 bg-green-500 rounded-full mr-2"></span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 hover:bg-muted/50 rounded-lg p-3 transition-colors cursor-pointer">
          <Avatar className="w-8 h-8">
            <AvatarImage src="/placeholder-user.jpg" alt="@shadcn" />
            <AvatarFallback className="text-xs font-bold">AC</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <div className="font-medium truncate">Acme Inc</div>
              <span className="h-3 w-3 bg-red-500 rounded-full mr-2"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
