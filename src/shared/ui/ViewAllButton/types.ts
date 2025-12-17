import type { ButtonHTMLAttributes } from "react";

export type TViewAllButtonBehavior = "disable" | "2-way" | "hide";

export type TViewAllButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  "onClick" | "children"
> & {
  /**
   * Поведение кнопки после клика:
   * - disable: кнопка становится неактивной (по умолчанию)
   * - 2-way: кнопка меняет текст на "Свернуть" и скрывает добавленные элементы при повторном клике
   * - hide: кнопка скрывается после клика
   */
  behavior?: TViewAllButtonBehavior;
  /**
   * Начальное количество элементов
   */
  initialCount: number;
  /**
   * Текущее количество отображаемых элементов
   */
  currentCount: number;
  /**
   * Общее количество доступных элементов
   */
  totalCount: number;
  /**
   * Callback функция, вызываемая при клике на кнопку
   * @param count - количество элементов для отображения
   */
  onLoadMore: (count: number) => void;
  /**
   * Текст кнопки (по умолчанию "Смотреть все")
   */
  children?: string;
};
