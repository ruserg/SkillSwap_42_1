type TOption = string;

type TSelector = "radio" | "checkbox";

export type TSelectorProps = {
  selectionTitle: string;
  selectionPlaceholder: string;
  selectionOptions: TOption[];
  selectorType: TSelector;
  enableSearch?: boolean;
};
