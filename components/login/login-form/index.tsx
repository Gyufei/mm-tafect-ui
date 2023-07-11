import * as Form from "@radix-ui/react-form";
import { ChevronLeft } from "lucide-react";

import { IAccount } from "@/lib/types";

import "./index.css";

interface LoginFormProps {
  account: IAccount;
  showAccountCb: () => void;
}

export default function LoginForm(props: LoginFormProps) {
  const { account } = props;

  return (
    <div className="login-form flex w-full max-w-md grow flex-col items-stretch">
      <div className="relative flex w-full flex-col">
        <FormBody {...props} />
        <LoginFailTip show={false} />
      </div>
    </div>
  );
}

const FormBody = (props: LoginFormProps) => {
  const { account } = props;

  const SessionTip = (stProps: { show: boolean }) => {
    return stProps.show ? (
      <div className="mb-5 w-[420px] rounded border border-[#DFCA9C] bg-[#FEFAF4] px-4 py-3 text-title-color">
        Your session ended after 10 minutes of inactivity.
      </div>
    ) : null;
  };

  const LinkOfAccount = (loaProps: { showAccountCb: () => void }) => {
    return (
      <div
        className="link-account absolute flex select-none items-center hover:cursor-pointer"
        onClick={() => loaProps.showAccountCb()}
      >
        <ChevronLeft className="mr-2 h-4 w-4" />
        <span className="text-primary">Account List</span>
      </div>
    );
  };

  if (account?.name) {
    return (
      <>
        <SessionTip show={false} />
        <div className="mb-5 flex justify-start">
          <div className="mr-4 h-16 w-16 rounded-lg border border-border-color bg-white"></div>
          <div className="flex flex-col items-start justify-around">
            <div className="text-lg font-bold text-title-color">
              Sign in to {account.name}
            </div>
            <div className="text-sm text-second-color">{account.email}</div>
          </div>
        </div>
        <FormToLogin account={account} />
      </>
    );
  } else {
    return (
      <>
        <LinkOfAccount showAccountCb={props.showAccountCb} />
        <div className="text-lg font-bold text-title-color">
          Sign in to your Tafect account
        </div>
        <FormToLogin account={account} />
      </>
    );
  }
};

const FormToLogin = (props: { account: IAccount }) => (
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
          <input className="Input" type="email" required />
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
        <input className="Input" type="password" required />
      </Form.Control>
    </Form.Field>

    <Form.Submit asChild>
      <div className="mt-5 flex items-center justify-between ">
        <button className="flex h-10 w-36 items-center rounded-3xl bg-primary px-10 py-2.5 text-white hover:bg-primary/80">
          sign in
        </button>
        <div className="Link text-sm">Having trouble signing in?</div>
      </div>
    </Form.Submit>
  </Form.Root>
);

const LoginFailTip = (lftProps: { show: boolean }) => {
  if (lftProps.show) {
    return (
      <div className="mt-5 flex flex-col rounded border border-[#DEA69C] bg-[#F8DEDA] p-4 text-sm">
        <div className="mb-4">
          We weren't able to sign in to your account . Check your password and
          try again.
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
