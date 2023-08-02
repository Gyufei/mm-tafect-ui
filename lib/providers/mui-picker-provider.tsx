"use client";

import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

export default function MuiPickerProvider({
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
