"use client";

import { buttonVariants } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import { GitHubLogoIcon } from "@radix-ui/react-icons";
import { Loader2 } from "lucide-react";
import * as React from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

export const userAuthSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
});
type FormData = z.infer<typeof userAuthSchema>;

interface UserAuthFormProps extends React.HTMLAttributes<HTMLDivElement> {}

export function UserAuthForm({ className, ...props }: UserAuthFormProps) {
  const form = useForm<FormData>({
    resolver: zodResolver(userAuthSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [isGitHubLoading, setIsGitHubLoading] = React.useState<boolean>(false);

  async function onSubmit(data: FormData) {
    setIsLoading(true);

    // TODO: Add signin using preferred provider
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const signInResult = { ok: true };
    setIsLoading(false);

    if (!signInResult?.ok) {
      return toast.error("Something went wrong.", {
        description: "Your sign in request failed. Please try again.",
      });
    }

    return toast.success("Check your email", {
      description: "We sent you a login link. Be sure to check your spam too.",
    });
  }

  async function onSignInGithub() {
    setIsGitHubLoading(true);
    // TODO: Add signin using preferred provider
    await new Promise((resolve) => setTimeout(resolve, 1000));
    setIsGitHubLoading(false);
  }

  return (
    <div className={cn("grid gap-6", className)} {...props}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      id="email"
                      placeholder="name@example.com"
                      type="email"
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                      disabled={isLoading || isGitHubLoading}
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
                  <FormControl>
                    <Input
                      id="password"
                      placeholder="Password"
                      type="password"
                      autoComplete="current-password"
                      disabled={isLoading || isGitHubLoading}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <button
              type="submit"
              className={cn(buttonVariants())}
              disabled={isLoading || isGitHubLoading}
              onClick={() => {
                // onSignIn();
              }}
            >
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In with Email
            </button>
          </div>
        </form>
      </Form>
    </div>
  );
}
