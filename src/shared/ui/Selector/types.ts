type TOption = string;

type TSelector = "radio" | "checkbox";

export type TSelectorProps = {
  id: string;
  isOpen: boolean;
  onToggle: (id: string) => void;
  selectionTitle: string;
  selectionPlaceholder: string;
  selectionOptions: TOption[];
  selectorType: TSelector;
  enableSearch?: boolean;
};
