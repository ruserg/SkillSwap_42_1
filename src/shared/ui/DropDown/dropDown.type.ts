export type IDropDownProps = {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  children: React.ReactNode;
  triggerGroupe: string;
  onClose: () => void;
};
