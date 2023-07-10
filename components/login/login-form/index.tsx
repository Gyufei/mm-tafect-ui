import * as Form from "@radix-ui/react-form";
import { IAccount } from "@/lib/types";

import "./index.css";
import { LinkOfAccount } from "./linkOfAccount";

export default function LoginForm(props: { account: IAccount }) {
  return (
    <div className="login-form flex w-full max-w-md grow flex-col items-stretch">
      <div className="relative flex w-full flex-col">
        <LinkOfAccount />

        <div className="text-lg font-semibold text-title-color">
          Sign in to your Tafect account
        </div>

        <FormDemo />
      </div>
    </div>
  );
}

const FormDemo = () => (
  <Form.Root className="w-[420px]">
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
    <Form.Field className="FormField" name="question">
      <div className="flex items-baseline justify-between">
        <Form.Label className="FormLabel">Question</Form.Label>
        <Form.Message className="FormMessage" match="valueMissing">
          Please enter a question
        </Form.Message>
      </div>
      <Form.Control asChild>
        <textarea className="Textarea" required />
      </Form.Control>
    </Form.Field>
    <Form.Submit asChild>
      <button className="Button" style={{ marginTop: 10 }}>
        sign in
      </button>
    </Form.Submit>
  </Form.Root>
);
