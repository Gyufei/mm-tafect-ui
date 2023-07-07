import { IAccount } from "@/lib/types";

interface AcProps {
  selectAccountCb: (ac: IAccount) => void;
}
export default function AccountList(porps: AcProps) {
  return <div className="max-w-md"></div>;
}
