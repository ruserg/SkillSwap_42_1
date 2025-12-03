import DatePicker from "react-datepicker";
import { useState } from "react";
import "react-datepicker/dist/react-datepicker.css";
import "./Calendar.scss";
import { ru } from "date-fns/locale";
import { CalendarContainer } from "@shared/ui/Calendar/CalendarContainer";
import { CalendarInput } from "@shared/ui/Calendar/CalendarInput";
import type { TCalendarProps } from "@shared/ui/Calendar/type.ts";

//Карта сокращений дней недели для отображения по макету. По умолчанию datepicker сокращает не совсем правильно,
//к примеру, Понедельник - По, Четверг - Че.
const WEEKDAYS_MAP: Record<string, string> = {
  понедельник: "Пн",
  вторник: "Вт",
  среда: "Ср",
  четверг: "Чт",
  пятница: "Пт",
  суббота: "Сб",
  воскресенье: "Вс",
};

//Компонент кастомного календаря, который отдает в onChange дату (объект Date js)
//Календарь календарь принимает обязательные пропсы value и onChange - это будет стейт
//и его сеттер типа Date | null. Сделано для того, чтоб не "запирать" выбранную дату
//внутри компонента, т.к. ее мы будем передавать куда-то еще. По итогу добавлять так:
//const [date, setDate] = useState<Date | null>(null) - вместо null можно выставить new Date()
//<Calendar value={date} onChange={setDate} />
export const Calendar = (props: TCalendarProps) => {
  const { value, onChange } = props;

  const [draftDate, setDraftDate] = useState<Date | null>(value);
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleOpen = () => {
    setDraftDate(value);
    setIsOpen(true);
  };

  const handleConfirm = () => {
    onChange(draftDate ?? null);
    setIsOpen(false);
  };

  const handleCancel = () => {
    setDraftDate(value ?? null);
    setIsOpen(false);
  };

  return (
    <DatePicker
      locale={ru}
      dateFormat="dd.MM.yyyy"
      placeholderText={"Выберите дату"}
      open={isOpen}
      onInputClick={handleOpen}
      onClickOutside={handleCancel}
      shouldCloseOnSelect={false}
      selected={draftDate ?? value ?? null}
      onChange={(value) => setDraftDate(value)}
      showMonthDropdown
      showYearDropdown
      formatWeekDay={(nameOfDay) => {
        const key = nameOfDay.toLowerCase();
        return WEEKDAYS_MAP[key];
      }}
      customInput={<CalendarInput />}
      calendarContainer={(containerProps) => (
        <CalendarContainer
          {...containerProps}
          onCancel={handleCancel}
          onConfirm={handleConfirm}
        />
      )}
    />
  );
};
