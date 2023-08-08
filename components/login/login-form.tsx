"use client";

import { useEffect, useState } from "react";
import { signIn } from "next-auth/react";

import { IUser } from "@/lib/types/user";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import LoginFailTip from "./login-fail-tip";
import SessionTip from "./session-tip";
import LinkToAccountList from "./link-to-account-list";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(2).max(50),
});

export default function LoginForm({
  account,
  showAccountCb,
}: {
  account: IUser | null;
  showAccountCb: () => void;
}) {
  const [showLoginFailTip] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  useEffect(() => {
    if (account?.name) {
      form.setValue("email", account.email);
    }
  }, [account]);

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { email: username } = values;

    signIn("credentials", {
      ...values,
      username,
    });
  }

  const FormHead = () => {
    return (
      <>
        {account?.name ? (
          <>
            <div className="mb-5 flex justify-start">
              <Avatar className="mr-4 h-16 w-16 rounded-lg">
                <AvatarImage src={account.image || ""} />
                <AvatarFallback>{account?.name?.[0] || ""}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start justify-around">
                <div className="text-lg font-bold text-title-color">
                  Sign in to {account.name}
                </div>
                <div className="LabelText">{account.email}</div>
              </div>
            </div>
          </>
        ) : (
          <>
            <LinkToAccountList onShow={showAccountCb} />
            <div className="mb-4 text-lg font-bold text-title-color">
              Sign in to your Tafect account
            </div>
          </>
        )}
      </>
    );
  };

  return (
    <div className="flex w-full grow flex-col items-stretch px-4 pt-20 md:max-w-md md:pt-[24vh]">
      <div className="relative flex w-full flex-col">
        {account?.name && <SessionTip className="hidden md:block" />}
        <FormHead />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="md:w-[420px]">
            {!account?.name && (
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input className="rounded" type="string" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input className="rounded" type="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="mt-5 flex flex-col items-stretch justify-center md:flex-row md:items-center md:justify-between ">
              <button
                className="mb-3 flex h-10 w-full items-center justify-center rounded-3xl bg-primary px-10 py-2.5 text-white md:mb-0 md:w-36"
                type="submit"
              >
                sign in
              </button>
              <div className="cursor-pointer text-center text-sm text-primary">
                Having trouble signing in?
              </div>
            </div>
          </form>
        </Form>
        {account?.name && <SessionTip className="md:hidden" />}
        {showLoginFailTip && <LoginFailTip />}
      </div>
    </div>
  );
}
