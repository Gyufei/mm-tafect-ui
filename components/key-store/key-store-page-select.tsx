import useSWR from "swr";
import { Checkbox } from "@/components/ui/checkbox";

import fetcher from "@/lib/fetcher";
import { SystemEndPointPathMap } from "@/lib/end-point";

export const KeyStorePageSelect = ({
  keyStoreName,
}: {
  keyStoreName: string;
}) => {
  const { data: pages } = useSWR(SystemEndPointPathMap.allPages, fetcher);
  const { data: currentPage, mutate: pageMutate } = useSWR(
    `${SystemEndPointPathMap.keyStorePages}?keystore=${keyStoreName}`,
    fetcher,
  );

  async function handleCheckPage(pageName: string) {
    if (currentPage?.includes(pageName)) {
      await removePage(pageName);
      pageMutate();
    } else {
      await addPage(pageName);
      pageMutate();
    }
  }

  async function addPage(pageName: string) {
    const params = {
      keystore_name: keyStoreName,
      pages_name: pageName,
    };

    return fetcher(SystemEndPointPathMap.keyStoreAddPage, {
      method: "POST",
      body: JSON.stringify(params),
    });
  }

  async function removePage(pageName: string) {
    const params = {
      keystore_name: keyStoreName,
      pages_name: pageName,
    };

    return fetcher(SystemEndPointPathMap.keyStoreRemovePage, {
      method: "POST",
      body: JSON.stringify(params),
    });
  }
  return (
    <div className="flex w-full items-center">
      <div className="flex items-center">
        {(pages || []).map((p: Record<string, any>) => (
          <div key={p.id} className="mr-5 flex cursor-pointer items-center">
            <Checkbox
              checked={currentPage?.includes(p.pages_name)}
              onCheckedChange={() => handleCheckPage(p.pages_name)}
              id={p.pages_name}
            />
            <label
              className="LabelText ml-2 cursor-pointer"
              htmlFor={p.pages_name}
            >
              {p.pages_name}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};
