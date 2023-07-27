import { displayText } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function FilterAccountList({
  accounts,
}: {
  accounts: Array<any>;
}) {
  return (
    <ScrollArea
      className="
        pb-2
    "
      style={{
        height: "calc(100vh - 413px)",
      }}
    >
      {Array.isArray(accounts) &&
        accounts.map((acc, index) => (
          <div
            key={acc.account}
            className="flex h-[73px] items-center justify-between border-b p-4"
          >
            <div className="self-start pl-2 pr-5 text-lg leading-none text-content-color">
              {index + 1}
            </div>
            <div className="flex flex-1 flex-col">
              <div className="text-lg font-medium text-title-color">
                {displayText(acc.account)}
              </div>
              <div className="LabelText flex">
                <div className="mr-6">ETH {acc.gas_token_amount}</div>
                <div>USDT {acc.quote_token_amount}</div>
              </div>
            </div>
          </div>
        ))}
    </ScrollArea>
  );
}
