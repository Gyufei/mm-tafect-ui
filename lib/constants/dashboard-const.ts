export const DayNames = ["SUN", "MON", "TUE", "WED", "THU", "FRI", "SAT"];
export const UpDownLabelOptions = ["Up", "Down"] as const;
export const RangeValueTypes = ["Total", "Average"] as const;

export type IRangeValueType = (typeof RangeValueTypes)[number];
export type IUpDownValue = (typeof UpDownLabelOptions)[number];

export const TxSpanUnits = ["Second", "Minute", "Hour"] as const;
export type ITxSpanUnit = (typeof TxSpanUnits)[number];

export const TxSpanUnitValues: Record<ITxSpanUnit, number> = {
  Second: 1,
  Minute: 60,
  Hour: 3600,
};

export const TxSpanUnitOptions = TxSpanUnits.map((unit) => ({
  label: unit,
  value: TxSpanUnitValues[unit],
}));
