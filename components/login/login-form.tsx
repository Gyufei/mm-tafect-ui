"use client";

import { useEffect, useMemo, useState } from "react";
import { IUser } from "@/lib/auth/user";

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
import md5 from "js-md5";
import { signInAction } from "@/lib/auth/auth-api";
import { useRouter } from "next/navigation";
import { isAfter } from "date-fns";
import useIndexStore from "@/lib/state";

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(2).max(50),
});

export default function LoginForm({
  user,
  showAccountCb,
  showWithUser,
}: {
  user: IUser | null;
  showAccountCb: () => void;
  showWithUser?: boolean;
}) {
  const router = useRouter();
  const setUserActive = useIndexStore((state) => state.setUserActive);

  const [showLoginFailTip, setShowLoginFailTip] = useState(false);
  const showUserForLogin = showWithUser && user?.name;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const alreadyLogin = useMemo(() => {
    if (!showWithUser || !user) return false;
    if (!user.token) return false;

    const isExpired = user?.expires
      ? isAfter(user?.expires, new Date())
      : false;

    return isExpired;
  }, [user, showWithUser]);

  useEffect(() => {
    if (showUserForLogin) {
      form.setValue("email", user.email || "");
    }

    if (alreadyLogin) {
      form.setValue("password", user?.email || "");
    }
  }, [user]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    if (alreadyLogin) {
      setUserActive(user?.name || "");
      router.push("/dashboard");
      return;
    }

    const { email, password } = values;
    const mPassword = md5(password);

    const res = await signInAction({
      username: email,
      password: mPassword,
    });

    if (!res) {
      setShowLoginFailTip(true);
      return;
    }

    router.push("/dashboard");
  }

  const FormHead = () => {
    return (
      <>
        {showUserForLogin ? (
          <>
            <div className="mb-5 flex justify-start">
              <Avatar className="mr-4 h-16 w-16 rounded-lg">
                <AvatarImage src={user?.image || ""} />
                <AvatarFallback>{user?.name?.[0] || ""}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col items-start justify-around">
                <div className="text-lg font-bold text-title-color">
                  Sign in to {user?.name}
                </div>
                <div className="LabelText">{user?.email}</div>
              </div>
            </div>
          </>
        ) : (
          <>
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
        <LinkToAccountList onShow={showAccountCb} />
        {showWithUser && <SessionTip user={user} className="hidden md:block" />}
        <FormHead />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="md:w-[420px]">
            {!showUserForLogin && (
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
                    <Input
                      disabled={alreadyLogin}
                      className="rounded"
                      type="password"
                      {...field}
                    />
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
        {showUserForLogin && <SessionTip user={user} className="md:hidden" />}
        {showLoginFailTip && <LoginFailTip />}
      </div>
    </div>
  );
}
