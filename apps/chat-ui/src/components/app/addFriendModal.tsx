import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { FriendsContext } from "@/providers/FriendsProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { X } from "lucide-react";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

interface Props {
  open: boolean;
  setOpen: (status: boolean) => void;
}

export const addFriendSchema = z.object({
  friendsName: z
    .string({ required_error: "Add friend is required" })
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(20, { message: "Name must be 20 characters or less" }),
});

export function AddFriendModal(props: Props) {
  const { open, setOpen } = props;

  const { friendsList, setFriendsList } = useContext(FriendsContext);

  const form = useForm<z.infer<typeof addFriendSchema>>({
    resolver: zodResolver(addFriendSchema),
    defaultValues: {
      friendsName: "",
    },
  });

  const onSubmit = (values: z.infer<typeof addFriendSchema>) => {
    setFriendsList([
      ...friendsList,
      {
        name: values.friendsName,
        connected: false,
      },
    ]);
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={() => {
        form.reset();
      }}
    >
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add a new friend</DialogTitle>
        </DialogHeader>
        <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
          <X className="h-4 w-4" onClick={() => setOpen(false)} />
          <span className="sr-only">Close</span>
        </DialogClose>
        <div className="grid gap-4 py-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="friendsName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Type your friends name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="friends name"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-4 justify-end">
                <Button type="submit">Add</Button>
              </div>
            </form>
          </Form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
