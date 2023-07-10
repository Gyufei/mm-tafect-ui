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
        <FormHead {...props} />
        <FormToLogin account={account} />
      </div>
    </div>
  );
}

const FormHead = (props: LoginFormProps) => {
  if (props.account?.name) {
    return (
      <>
        <div className="mb-5 w-[420px] rounded border border-[#DFCA9C] bg-[#FEFAF4] px-4 py-3 text-title-color">
          Your session ended after 10 minutes of inactivity.
        </div>

        <div className="mb-5 flex justify-start">
          <div className="mr-4 h-16 w-16 rounded-lg border border-border-color bg-white"></div>
          <div className="flex flex-col items-start justify-around">
            <div className="text-lg text-title-color">
              Sign in to to William
            </div>
            <div className="text-sm text-second-color">william.s@xxx.com</div>
          </div>
        </div>
      </>
    );
  } else {
    return (
      <>
        <LinkOfAccount showAccountCb={props.showAccountCb} />
        <div className="text-lg font-semibold text-title-color">
          Sign in to your Tafect account
        </div>
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
      <button className="mt-5 flex h-10 w-36 items-center rounded-3xl bg-primary px-10 py-2.5 text-white hover:bg-primary/80">
        sign in
      </button>
    </Form.Submit>
  </Form.Root>
);

const LinkOfAccount = (props: { showAccountCb: () => void }) => {
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
