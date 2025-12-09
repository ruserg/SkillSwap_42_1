export type TOption = string;

type TSelector = "radio" | "checkbox";

export type TOptionsProps = {
  id: string;
  selectionOptions: TOption[];
  toggleOption: (option: TOption) => void;
  selectedOptions: TOption[];
  selectorType: TSelector;
};
