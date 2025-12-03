export type TOption = string;

type TSelector = "radio" | "checkbox";

export type TOptionsProps = {
  selectionOptions: TOption[];
  toggleOption: (option: TOption) => void;
  selectedOptions: TOption[];
  selectorType: TSelector;
};
