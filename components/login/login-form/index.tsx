"use client";

import { useMemo, useState } from "react";
import { ChevronLeft } from "lucide-react";
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

interface LoginFormProps {
  account: IUser | null;
  showAccountCb: () => void;
}

const formSchema = z.object({
  email: z.string().email(),
  password: z.string().min(2).max(50),
});

export default function LoginForm(props: LoginFormProps) {
  const account = useMemo(() => props.account, [props.account]);

  const [showSessionTip] = useState(false);
  const [showLoginFailTip] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { email: username } = values;

    signIn(
      "credentials",
      {
        ...values,
        username,
      },
      {
        callbackUrl: "/dashboard",
      },
    );
  }

  const SessionTip = () => {
    return showSessionTip ? (
      <div className="mb-5 w-[420px] rounded border border-[#DFCA9C] bg-[#FEFAF4] px-4 py-3 text-title-color">
        Your session ended after 10 minutes of inactivity.
      </div>
    ) : null;
  };

  const LinkOfAccount = () => {
    return (
      <div
        className="absolute flex select-none items-center hover:cursor-pointer"
        style={{
          top: "-3.8em",
        }}
        onClick={() => props.showAccountCb()}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        <span className="text-primary">Account List</span>
      </div>
    );
  };

  const FormHead = () => {
    return (
      <>
        {account?.name ? (
          <>
            <SessionTip />
            <div className="mb-5 flex justify-start">
              <Avatar className="mr-4 h-16 w-16 rounded-lg">
                <AvatarImage src={account.image} />
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
            <LinkOfAccount />
            <div className="mb-4 text-lg font-bold text-title-color">
              Sign in to your Tafect account
            </div>
          </>
        )}
      </>
    );
  };

  const LoginFailTip = () => {
    if (showLoginFailTip) {
      return (
        <div className="mt-5 flex flex-col rounded border border-[#DEA69C] bg-[#F8DEDA] p-4 text-sm">
          <div className="mb-4">
            We weren&apos;t able to sign in to your account . Check your
            password and try again.
          </div>
          <div>
            If you were invited to 1password by someone else , they can
            <div className="cursor-pointer text-primary">
              recover your account
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <div
      style={{
        paddingTop: "24vh",
      }}
      className="login-form flex w-full max-w-md grow flex-col items-stretch"
    >
      <div className="relative flex w-full flex-col">
        <FormHead />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="w-[420px]">
            {!account?.name ? (
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
            ) : null}

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

            <div className="mt-5 flex items-center justify-between ">
              <button
                className="flex h-10 w-36 items-center rounded-3xl bg-primary px-10 py-2.5 text-white"
                type="submit"
              >
                sign in
              </button>
              <div className="cursor-pointer text-sm text-primary">
                Having trouble signing in?
              </div>
            </div>
          </form>
        </Form>
        <LoginFailTip />
      </div>
    </div>
  );
}
