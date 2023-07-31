import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";
import { PackageOpen } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import CopyIcon from "@/components/shared/copy-icon";

import { displayText } from "@/lib/utils";

export interface IAccountGas {
  account: string;
  gas: string;
  tx: number;
}

export default function AccountsTable({
  accounts,
}: {
  accounts: Array<IAccountGas>;
}) {
  const [filterText, setFilterText] = useState<string>("");
  const [filterTextDebounce] = useDebounce(filterText, 500);

  const filteredAccount = useMemo(() => {
    if (!filterTextDebounce) {
      return accounts;
    }

    const filtered = accounts.filter((aG) =>
      aG.account.toLowerCase().includes(filterTextDebounce.toLowerCase()),
    );

    return filtered;
  }, [filterTextDebounce, accounts]);

  return (
    <div className="flex flex-1 flex-col justify-stretch">
      <div
        style={{
          boxShadow: "inset 0px -1px 0px 0px #D6D6D6",
        }}
        className="bg-custom-bg-white px-3 py-2 "
      >
        <Input
          className="rounded-3xl bg-custom-bg-white"
          type="text"
          placeholder="Search"
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
        />
      </div>
      <Table>
        <TableHeader className="h-10 bg-white text-content-color">
          <TableRow className="border-b border-shadow-color">
            <TableHead className="w-[100px] text-center font-normal">
              #
            </TableHead>
            <TableHead className="font-normal">Address</TableHead>
            <TableHead className="font-normal">Gas</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="text-lg">
          {filteredAccount.length ? (
            filteredAccount?.map((aG, index) => (
              <TableRow
                key={aG.account}
                className="h-[56px] border-b border-shadow-color"
              >
                <TableCell className="min-w-[40px] max-w-[40px] text-center">
                  {index}
                </TableCell>
                <TableCell>
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span className="inline-flex items-center">
                          {displayText(aG.account)}
                          <CopyIcon text={aG.account} />
                        </span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{aG.account}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </TableCell>
                <TableCell>{aG.gas}</TableCell>
              </TableRow>
            ))
          ) : (
            <tr>
              <td colSpan={3}>
                <div className="flex flex-col items-center justify-center pt-10 text-content-color">
                  <PackageOpen className="mb-5 h-[40px] w-[40px]" />
                  <p className="text-lg">Data Not Found</p>
                </div>
              </td>
            </tr>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
