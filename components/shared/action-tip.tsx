import { AlertCircle, CheckCircle2, XCircle } from "lucide-react";
import { useEffect } from "react";

export type IActionType = "success" | "warning" | "error";

export default function ActionTip({
  type,
  message,
  handleClose,
}: {
  type: IActionType;
  message: string | null;
  handleClose: () => void;
}) {
  useEffect(() => {
    if (message) {
      const d = setTimeout(() => {
        handleClose();
      }, 5000);

      return () => clearTimeout(d);
    }
  }, [message]);

  const colorMap = {
    success: {
      bg: "#D8F0E9",
      border: "#85DFC4",
      icon: "#07D498",
    },
    warning: {
      bg: "#F1E5D1",
      border: "#DFCA9C",
      icon: "#B38828",
    },
    error: {
      bg: "#F8DEDA",
      border: "#DEA69C",
      icon: "D42C1F",
    },
  };

  return (
    <>
      {message ? (
        <div
          className="fixed bottom-6 flex items-center gap-x-2 rounded-md border px-5 py-3"
          style={{
            borderColor: colorMap[type].border,
            backgroundColor: colorMap[type].bg,
          }}
        >
          {((type) => {
            switch (type) {
              case "success":
                return <CheckCircle2 className="h-6 w-6" />;
              case "warning":
                return <AlertCircle className="h-6 w-6" />;
              default:
                return (
                  <XCircle
                    className="h-6 w-6"
                    style={{
                      color: colorMap[type].icon,
                    }}
                  />
                );
            }
          })(type)}
          <div className="max-w-[500px] overflow-hidden	 text-ellipsis whitespace-nowrap leading-6 text-title-color">
            {message}
          </div>
        </div>
      ) : null}
    </>
  );
}
