import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";

const signupSchema = z
  .object({
    username: z
      .string({ required_error: "Username is required" })
      .min(3, { message: "Username must be at least 3 characters long" })
      .max(20, { message: "Username must be 20 characters or less" }),
    password: z
      .string({ required_error: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters long" })
      .max(20, { message: "Password must be 20 characters or less" }),
    passwordRepeated: z
      .string({ required_error: "Password is required" })
      .min(6, { message: "Password must be at least 6 characters long" })
      .max(20, { message: "Password must be 20 characters or less" }),
  })
  .refine((data) => data.password === data.passwordRepeated, {
    message: "Passwords don't match",
    path: ["passwordRepeated"],
  });

export const Signup = () => {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
    },
  });

  function onSubmit(values: z.infer<typeof signupSchema>) {
    console.log(values);
  }

  console.debug("!!! form ", form);

  return (
    <div className="h-screen flex items-center justify-center">
      <Card className="mx-auto max-w-sm self-center w-96">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">
            Create new account
          </CardTitle>
          <CardDescription className="text-center">
            Start using messenger today!
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="enter login"
                        autoComplete="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="enter password"
                        autoComplete="off"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="passwordRepeated"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Repeat password</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="confirm your password"
                        autoComplete="off"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex gap-4 justify-center">
                <Button type="submit">Create your account</Button>
                <Button
                  variant="secondary"
                  type="button"
                  onClick={() => navigate("/  ")}
                >
                  Back
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
