"use client";
import useSWR from "swr";
import { sortBy } from "lodash";
import { useDebounce } from "use-debounce";
import { useMemo, useState } from "react";
import { PackageOpen, Trash2 } from "lucide-react";

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

import { displayText } from "@/lib/utils";
import { PathMap } from "@/lib/path-map";
import fetcher from "@/lib/fetcher";

import { KeyStorePageSelect } from "@/components/key-store/key-store-page-select";
import CopyIcon from "@/components/shared/copy-icon";
import DetailItem from "@/components/shared/detail-item";
import NetworkSelect from "@/components/shared/network-select/network-select";

interface IAccountGas {
  account: string;
  gas: string;
  tx: number;
}

export default function KeyStoreItem({ params }: { params: { item: string } }) {
  const keyStoreName = params.item;

  const [currentNetwork, setCurrentNetwork] = useState("11155111");

  const { data: keyStoreAccountsData } = useSWR(
    `${PathMap.keyStoreAccounts}?keystore=${keyStoreName}&chain_id=${currentNetwork}`,
    fetcher,
  );

  const accounts: Array<IAccountGas> = useMemo(() => {
    if (keyStoreAccountsData?.[0].accounts) {
      const acc = sortBy(keyStoreAccountsData?.[0].accounts, "gas");
      return acc.reverse();
    }
    return [];
  }, [keyStoreAccountsData]);
  const accountCount: number = keyStoreAccountsData?.[0].count || 0;
  const tx = accounts.reduce(
    (acc: number, aG: Record<string, any>) => acc + aG.tx,
    0,
  );
  const gasAvailable = accounts.filter(
    (aG: Record<string, any>) => aG.gas > 0,
  ).length;

  const [filterText, setFilterText] = useState<string>("");
  const [filterTextDebounce] = useDebounce(filterText, 500);
  const filterAccounts = useMemo(() => {
    if (!filterTextDebounce) {
      return accounts;
    }

    const filtered = accounts.filter((aG) =>
      aG.account.toLowerCase().includes(filterTextDebounce.toLowerCase()),
    );

    return filtered;
  }, [filterTextDebounce, accounts]);

  const handleSelectNetwork = (networkOption: any) => {
    setCurrentNetwork(networkOption.id);
  };

  const handleDeleteKs = () => {};

  function DetailCol() {
    return (
      <div
        className="ks-detail flex w-[400px] flex-col justify-between px-3 pb-4 pt-3"
        style={{
          boxShadow: "inset -1px 0px 0px 0px #d6d6d6",
        }}
      >
        <div className="flex flex-col justify-stretch">
          <DetailItem title="Address">{accountCount}</DetailItem>
          <DetailItem title="Gas Available">{gasAvailable}</DetailItem>
          <DetailItem title="Tx">{tx}</DetailItem>
          <DetailItem title="Default Network">
            <NetworkSelect
              value={currentNetwork}
              onSelect={(e) => handleSelectNetwork(e)}
            />
          </DetailItem>
          <DetailItem title="Works for">
            <KeyStorePageSelect keyStoreName={keyStoreName} />
          </DetailItem>
        </div>
        <div className="flex w-full justify-end pr-2">
          <Trash2
            onClick={() => handleDeleteKs()}
            className="h-5 w-5 cursor-pointer hover:text-[#ec5b55]"
          />
        </div>
      </div>
    );
  }

  function AccountsTable() {
    return (
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
          {filterAccounts.length ? (
            filterAccounts?.map((aG, index) => (
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
    );
  }

  return (
    <div
      style={{ height: "calc(100vh - 70px)" }}
      className="flex min-h-[400px] flex-1 items-stretch bg-[#fafafa]"
    >
      <DetailCol />

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
        <AccountsTable />
      </div>
    </div>
  );
}
