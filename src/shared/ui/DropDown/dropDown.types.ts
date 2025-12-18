export type IDropDownProps = {
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  children: React.ReactNode;
  triggerGroupe: string;
  onClose: () => void;
  isOpen: boolean;
  role?:
    | "dialog" // диалоговое окно
    | "menu" // меню
    | "listbox" // список для выбора
    | "tooltip"; // всплывающая подсказка
  ariaLabel?: string;
};

// role в рамках нашего проекта. Можно вообще всё добавить, если нужно.
