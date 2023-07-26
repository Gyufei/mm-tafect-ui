"use client";
import { useEffect, useMemo, useState } from "react";
import { Check, PackageOpen, Trash2 } from "lucide-react";

import "./index.css";
import { IKeyStore } from "@/lib/types/keyStore";
import { Checkbox } from "@/components/ui/checkbox";
import CopyIcon from "@/components/shared/copy-icon";
import { displayText } from "@/lib/utils";
import DetailItem from "@/components/common/DetailItem";
import NetworkSelect from "@/components/common/NetworkSelect/network-select";
import { Input } from "@/components/ui/input";
import { PathMap } from "@/lib/path";
import { usePathname, useSearchParams } from "next/navigation";
import { IAccountGas, useAccountGas } from "@/lib/hooks/use-account-gas";
import {
  Table,
  TableBody,
  TableCaption,
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
import { useDebounce } from "use-debounce";

export default function KeyStoreItem({
  params,
}: {
  params: { keyStoreItem: string };
}) {
  const keyStoreName = useMemo(() => params.keyStoreItem, [params]);

  const [currentNetwork, setCurrentNetwork] = useState(1);
  const [currentWorksFor, setCurrentWorksFor] = useState(null);

  const { accounts, count: accountCount } = useAccountGas(
    keyStoreName,
    currentNetwork,
  );
  const [tx, setTx] = useState(0);
  const [gasAvailable, setGasAvailable] = useState(0);

  const [filterText, setFilterText] = useState<string>("");
  const [filterTextDebounce] = useDebounce(filterText, 500);
  const [filterAccounts, setFilterAccounts] = useState<Array<IAccountGas>>([]);

  useEffect(() => {
    if (!filterTextDebounce) {
      setFilterAccounts(accounts);
    }

    const filterAccounts = accounts.filter((aG) =>
      aG.account.toLowerCase().includes(filterTextDebounce.toLowerCase()),
    );

    setFilterAccounts(filterAccounts);
  }, [filterTextDebounce, accounts]);

  const handleSelectNetwork = (networkOption: any) => {
    setCurrentNetwork(networkOption.id);
  };

  const handleCheckWorksFor = (worksForOption: any) => {
    setCurrentWorksFor(worksForOption.value);
  };

  const handleDeleteKs = () => {};

  function WorksForSelect() {
    const worksForOptions = [
      {
        value: 1,
        label: "Auto-Flow",
      },
      {
        value: 2,
        label: "Token-swap",
      },
    ];

    return (
      <div className="flex w-full items-center">
        <div className="flex items-center">
          {worksForOptions.map((option) => (
            <div
              key={option.value}
              className="mr-10 flex cursor-pointer items-center"
            >
              <Checkbox
                checked={currentWorksFor === option.value}
                onCheckedChange={() => handleCheckWorksFor(option)}
                id={option.label}
              />
              <label
                className="LabelText ml-2 cursor-pointer"
                htmlFor={option.label}
              >
                {option.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  }

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
            <WorksForSelect />
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
