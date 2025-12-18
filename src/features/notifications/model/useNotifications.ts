import { useState } from "react";
import type { INotification } from "./types";

export const defaultNotifications: INotification[] = [
  {
    id: "1",
    message: "Николай принял ваш обмен",
    details: "Перейдите в профиль, чтобы обсудить детали",
    type: "success",
    date: "сегодня",
    action: "Перейти",
    isRead: false,
  },
  {
    id: "2",
    message: "Татьяна предлагает вам обмен",
    details: "Примите обмен, чтобы обсудить детали",
    type: "warning",
    date: "сегодня",
    action: "Перейти",
    isRead: false,
  },
  {
    id: "3",
    message: "Олег предлагает вам обмен",
    details: "Примите обмен, чтобы обсудить детали",
    type: "warning",
    date: "вчера",
    action: "Перейти",
    isRead: true,
  },
  {
    id: "4",
    message: "Игорь принял ваш обмен",
    details: "Перейдите в профиль, чтобы обсудить детали",
    type: "success",
    date: "23 мая",
    action: "Перейти",
    isRead: true,
  },
];

export const useNotifications = () => {
  const [notifications, setNotifications] =
    useState<INotification[]>(defaultNotifications);

  const newNotifications = notifications.filter((n) => !n.isRead);
  const viewedNotifications = notifications.filter((n) => n.isRead);

  return {
    notifications,
    setNotifications,
    newNotifications,
    viewedNotifications,
  };
};
