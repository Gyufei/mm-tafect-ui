import { useMemo, useState } from "react";
import { useDebounce } from "use-debounce";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import Empty from "@/components/shared/empty";
import TruncateText from "@/components/shared/trunc-text";

export interface IAccountGas {
  account: string;
  gas: string;
  tx: number;
}

export default function KeyStoreAccountsTable({
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
      <Table className="table-fixed">
        <TableHeader className="h-10 bg-white text-content-color">
          <TableRow className="border-b border-shadow-color">
            <TableHead className="w-[30px] text-center font-normal md:w-[100px]">
              #
            </TableHead>
            <TableHead className="w-[230px] font-normal md:w-auto">
              Address
            </TableHead>
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
                <TableCell className="text-center">{index}</TableCell>
                <TableCell>
                  <TruncateText text={aG.account} showCopy={true} />
                </TableCell>
                <TableCell>
                  <span className="TruncateSingleLine inline-block max-w-[100px] leading-4 md:max-w-none">
                    {aG.gas}
                  </span>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <tr>
              <td colSpan={3}>
                <Empty />
              </td>
            </tr>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
