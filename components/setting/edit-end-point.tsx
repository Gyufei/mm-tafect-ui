"use client";

import { useContext, useRef, useState } from "react";
import { PenLine } from "lucide-react";

import { NetworkContext } from "@/lib/providers/network-provider";
import { UserEndPointContext } from "@/lib/providers/user-end-point-provider";
import DetailItem from "../shared/detail-item";
import { Input } from "../ui/input";
import { Skeleton } from "../ui/skeleton";
import { SystemEndPointPathMap } from "@/lib/end-point";
import fetcher from "@/lib/fetcher";
import useSWRMutation from "swr/mutation";
import { toast } from "../ui/use-toast";

const URL_REGEX =
  /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_+.~#?&/=]*)/;

export default function EditEndPoint() {
  const { network } = useContext(NetworkContext);
  const { userEndPoint, refreshEndPoint } = useContext(UserEndPointContext);

  const networkDisplay = network?.network_name
    ? `(${network?.network_name})`
    : "";

  const [edit, setEdit] = useState(false);
  const [inputValue, setInputValue] = useState(userEndPoint);
  const inputRef = useRef<HTMLInputElement>(null);

  const onEdit = () => {
    setInputValue(userEndPoint);
    setTimeout(() => {
      inputRef.current?.select();
      inputRef.current?.focus();
    }, 500);
    setEdit(true);
  };

  const onChange = (val: string) => {
    setInputValue(val);

    if (!val) {
      setErrorMsg("Endpoint is required");
      return;
    }

    if (!URL_REGEX.test(val || "")) {
      setErrorMsg("Not a valid URL");
      return;
    }

    setErrorMsg("");
  };

  const onBlur = () => {
    if (errorMsg) {
      return;
    }

    if (inputValue === userEndPoint) {
      setEdit(false);
      return;
    }

    submitAction(inputValue as string);
  };

  const submitEndpoint = async (url: string, { arg }: { arg: string }) => {
    const searchParams = new URLSearchParams();
    searchParams.append("end_point", arg);
    const query = searchParams.toString();

    const res = await fetcher(`${url}?${query}`, {
      method: "POST",
    });

    toast({
      description: "Endpoint updated",
    });
    setEdit(false);
    refreshEndPoint(arg);
    return res;
  };

  const { trigger: submitAction } = useSWRMutation(
    SystemEndPointPathMap.endPoint,
    submitEndpoint,
  );

  const [errorMsg, setErrorMsg] = useState("");

  return (
    <DetailItem title={`Service Endpoint ${networkDisplay}`}>
      <div className="relative flex h-10 w-full flex-col justify-center">
        {userEndPoint ? (
          <div className="flex items-center gap-x-3">
            {edit ? (
              <Input
                data-state={errorMsg ? "error" : ""}
                ref={inputRef}
                type="text"
                value={inputValue || ""}
                placeholder="https://"
                onBlur={onBlur}
                onChange={(e) => onChange(e.target.value)}
                className="focus-visible:ring-0 data-[state=error]:border-destructive"
              />
            ) : (
              <span>{userEndPoint}</span>
            )}
            <PenLine onClick={onEdit} className="h-6 w-6" />
          </div>
        ) : (
          <Skeleton className="h-10 w-full bg-white" />
        )}

        <div className="absolute -top-7 right-10 mt-1 text-sm text-destructive">
          {errorMsg}
        </div>
      </div>
    </DetailItem>
  );
}
