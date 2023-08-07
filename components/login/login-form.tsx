"use client";

import { useState } from "react";
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
import useWindowSize from "@/lib/hooks/use-window-size";

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
  const { isMobile } = useWindowSize();

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
            <LinkOfAccount onShow={showAccountCb} />
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
        {account?.name && !isMobile ? <SessionTip /> : null}
        <FormHead />
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="md:w-[420px]">
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
        {account?.name && isMobile ? <SessionTip /> : null}
        <LoginFailTip show={showLoginFailTip} />
      </div>
    </div>
  );
}

const LoginFailTip = ({ show }: { show: boolean }) => {
  if (show) {
    return (
      <div className="mt-5 flex flex-col rounded border border-[#DEA69C] bg-[#F8DEDA] p-4 text-sm">
        <div className="mb-4">
          We weren&apos;t able to sign in to your account . Check your password
          and try again.
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

const SessionTip = () => {
  return (
    <div className="mt-5 rounded border border-[#DFCA9C] bg-[#FEFAF4] px-4 py-3 text-title-color md:mb-5 md:w-[420px]">
      Your session ended after 10 minutes of inactivity.
    </div>
  );
};

const LinkOfAccount = ({ onShow }: { onShow: () => void }) => {
  return (
    <div
      className="absolute top-[-40px] flex select-none items-center hover:cursor-pointer md:top-[-3.8em]"
      onClick={onShow}
    >
      <ChevronLeft className="mr-2 h-4 w-4" />
      <span className="text-primary">Account List</span>
    </div>
  );
};
