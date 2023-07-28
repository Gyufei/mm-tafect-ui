"use client";

import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

export default function MuiPickerContext({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <MuiPickersUtilsProvider utils={DateFnsUtils}>
      {children}
    </MuiPickersUtilsProvider>
  );
}
