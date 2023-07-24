import { useCallback, useState } from "react";
import * as Form from "@radix-ui/react-form";
import { ChevronLeft } from "lucide-react";
import { signIn } from "next-auth/react";

import "./index.css";
import { IUser } from "@/lib/types/user";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

interface LoginFormProps {
  account: IUser | null;
  showAccountCb: () => void;
}

export default function LoginForm(props: LoginFormProps) {
  const { account } = props;

  const [showSessionTip, setShowSessionTip] = useState(false);
  const [showLoginFailTip, setShowLoginFailTip] = useState(false);
  const [formModel, setFormModel] = useState({
    email: null,
    password: null,
  });

  const login = useCallback(() => {
    signIn("credentials", formModel);
  }, [formModel]);

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
        className="link-account absolute flex select-none items-center hover:cursor-pointer"
        onClick={() => props.showAccountCb()}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        <span className="text-primary">Account List</span>
      </div>
    );
  };

  const FormBody = () => {
    if (account?.name) {
      return (
        <>
          <SessionTip />
          <div className="mb-5 flex justify-start">
            <Avatar className="mr-4 h-16 w-16 rounded-lg">
              <AvatarImage src={account.avatar} />
              <AvatarFallback>{account?.name?.[0] || ""}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col items-start justify-around">
              <div className="text-lg font-bold text-title-color">
                Sign in to {account.name}
              </div>
              <div className="LabelText">{account.email}</div>
            </div>
          </div>
          <FormToLogin />
        </>
      );
    } else {
      return (
        <>
          <LinkOfAccount />
          <div className="text-lg font-bold text-title-color">
            Sign in to your Tafect account
          </div>
          <FormToLogin />
        </>
      );
    }
  };

  const FormToLogin = () => (
    <Form.Root className="w-[420px]">
      {!props?.account?.name ? (
        <Form.Field className="FormField" name="email">
          <div className="flex items-baseline justify-between">
            <Form.Label className="FormLabel">Email</Form.Label>
            <Form.Message className="FormMessage" match="valueMissing">
              Please enter your email
            </Form.Message>
            <Form.Message className="FormMessage" match="typeMismatch">
              Please provide a valid email
            </Form.Message>
          </div>
          <Form.Control asChild>
            <Input className="rounded" type="email" required />
          </Form.Control>
        </Form.Field>
      ) : null}

      <Form.Field className="FormField" name="Password">
        <div className="flex items-baseline justify-between">
          <Form.Label className="FormLabel">Password</Form.Label>
          <Form.Message className="FormMessage" match="valueMissing">
            Please enter your password
          </Form.Message>
        </div>
        <Form.Control asChild>
          <Input className="rounded" type="password" required />
        </Form.Control>
      </Form.Field>

      <Form.Submit asChild>
        <div className="mt-5 flex items-center justify-between ">
          <button
            onClick={() => login()}
            className="flex h-10 w-36 items-center rounded-3xl bg-primary px-10 py-2.5 text-white"
          >
            sign in
          </button>
          <div className="Link text-sm">Having trouble signing in?</div>
        </div>
      </Form.Submit>
    </Form.Root>
  );

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
            <div className="Link">recover your account</div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  };

  return (
    <div className="login-form flex w-full max-w-md grow flex-col items-stretch">
      <div className="relative flex w-full flex-col">
        <FormBody />
        <LoginFailTip />
      </div>
    </div>
  );
}
