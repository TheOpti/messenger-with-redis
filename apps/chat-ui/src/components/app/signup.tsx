import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { UserContext } from "@/providers/UserProvider";
import { zodResolver } from "@hookform/resolvers/zod";
import { signupSchema } from "@repo/shared/schema";
import { CheckCircle } from "lucide-react";
import { useContext } from "react";
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

export const Signup = () => {
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof signupSchema>>({
    resolver: zodResolver(signupSchema),
    defaultValues: {
      username: "",
      password: "",
      passwordRepeated: "",
    },
  });

  async function onSubmit(values: z.infer<typeof signupSchema>) {
    try {
      const res = await fetch("http://localhost:3000/auth/register", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      if (!res || !res.ok || res.status >= 400) {
        const parsedResp = await res.json();
        console.debug("There was a problem with the response");
        form.setError(
          "username",
          { message: parsedResp.message },
          { shouldFocus: true }
        );

        return;
      }

      form.reset();
      const parsedResp = await res.json();
      setUser({ ...parsedResp });

      navigate("/home");
      toast({
        title: "Account created",
        description: "You can now use the application!",
        action: <CheckCircle className="text-green-500 w-5 h-5" />,
      });
    } catch (e) {
      console.debug("There was an error during the request: ", e);
    }
  }

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
