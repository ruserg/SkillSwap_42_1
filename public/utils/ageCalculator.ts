//  Утилита вычисляет возраст по дате рождения
//  dateOfBirth - Дата рождения (объект Date)
//  Возвращает возраст в отформатированном виде, например: "33 года"
export const calculateAge = (dateOfBirth: Date): string => {
  // Проверяем валидность даты
  if (!dateOfBirth || isNaN(dateOfBirth.getTime())) {
    return "Дата не указана";
  }

  const today = new Date();

  // Проверяем, что дата рождения не в будущем
  if (dateOfBirth > today) {
    return "Пользователь еще не родился";
  }

  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();

  // Если день рождения еще не наступил в текущем году, уменьшаем возраст на 1
  if (
    monthDiff < 0 ||
    (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())
  ) {
    age--;
  }

  // Склонение лет
  const lastDigit = age % 10;
  const lastTwoDigits = age % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return `${age} лет`;
  }

  if (lastDigit === 1) {
    return `${age} год`;
  } else if (lastDigit >= 2 && lastDigit <= 4) {
    return `${age} года`;
  } else {
    return `${age} лет`;
  }
};

//  Вспомогательная функция для преобразования строки в Date
//  dateString - Строка с датой в формате "DD/MM/YYYY" или стандартном формате
//  Возвращает Объект Date или null, если строка невалидна

export const parseDateString = (dateString: string): Date | null => {
  // Парсим дату
  const date = new Date(dateString);
  if (!isNaN(date.getTime())) {
    return date;
  }

  // Пробуем формат "DD/MM/YYYY"
  const parts = dateString.split("/");
  if (parts.length === 3) {
    const day = parseInt(parts[0], 10);
    const month = parseInt(parts[1], 10) - 1; // Месяцы в JS: 0-11
    const year = parseInt(parts[2], 10);

    // Проверяем валидность чисел
    if (
      !isNaN(day) &&
      !isNaN(month) &&
      !isNaN(year) &&
      day >= 1 &&
      day <= 31 &&
      month >= 0 &&
      month <= 11 &&
      year >= 1900 &&
      year <= new Date().getFullYear()
    ) {
      const parsedDate = new Date(year, month, day);
      // Проверяем, что дата не изменилась из-за некорректных значений (например, 31 февраля)
      if (
        parsedDate.getDate() === day &&
        parsedDate.getMonth() === month &&
        parsedDate.getFullYear() === year
      ) {
        return parsedDate;
      }
    }
  }

  return null;
};

//  Вспомогательная функция для вычисления возраста из строки
//  на вход принимает dateString - Строка с датой рождения
//  Возвращает возраст в отформатированном виде

export const calculateAgeFromString = (dateString: string): string => {
  const date = parseDateString(dateString);
  if (!date) {
    return "Некорректная дата";
  }
  return calculateAge(date);
};

//  Вспомогательная функция для валидации даты рождения
//  На вход принимает date - Дата для проверки
//  Возвращает true, если дата валидна и не в будущем

export const isValidBirthDate = (date: Date): boolean => {
  return date && !isNaN(date.getTime()) && date < new Date();
};
