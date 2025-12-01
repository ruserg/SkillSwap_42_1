export type TOption = string;

export type TOptionsProps = {
  selectionOptions: TOption[];
  toggleOption: (option: TOption) => void;
  selectedOptions: TOption[];
};
