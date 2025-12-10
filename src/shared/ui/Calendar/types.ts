export type TCalendarProps = {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  id?: string;
};
