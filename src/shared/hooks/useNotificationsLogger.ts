import { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "@app/store/hooks";
import { selectIsAuthenticated } from "@features/auth/model/slice";
import {
  fetchNotifications,
  fetchToastNotification,
  selectNotifications,
  selectToast,
} from "@entities/notification/model/slice";

/**
 * Хук для периодического логирования уведомлений в консоль
 * Загружает уведомления и тост каждую минуту, если пользователь залогинен
 */
export const useNotificationsLogger = () => {
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const notifications = useAppSelector(selectNotifications);
  const toast = useAppSelector(selectToast);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Если пользователь не залогинен, ничего не делаем
    if (!isAuthenticated) {
      // Очищаем интервал, если он был установлен
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    // Функция для загрузки и логирования уведомлений
    const loadAndLogNotifications = async () => {
      try {
        // Загружаем уведомления и тост
        await Promise.all([
          dispatch(fetchNotifications()),
          dispatch(fetchToastNotification()),
        ]);
      } catch (error) {
        console.error("Ошибка загрузки уведомлений:", error);
      }
    };

    // Первая загрузка сразу
    loadAndLogNotifications();

    // Устанавливаем интервал на 1 минуту (60000 мс)
    intervalRef.current = setInterval(() => {
      loadAndLogNotifications();
    }, 60 * 1000);

    // Очистка при размонтировании
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [dispatch, isAuthenticated]);

  // Логируем уведомления в консоль при их изменении
  useEffect(() => {
    // Если пользователь не залогинен, ничего не логируем
    if (!isAuthenticated) {
      return;
    }

    console.log("=== УВЕДОМЛЕНИЯ ===");
    console.log("Всего уведомлений:", notifications.length);
    console.log("Уведомления:", notifications);
    if (toast) {
      console.log("Тост-уведомление:", toast);
    } else {
      console.log("Тост-уведомление: нет");
    }
    console.log("==================");
  }, [notifications, toast, isAuthenticated]);
};
