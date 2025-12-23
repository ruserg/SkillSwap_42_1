/**
 * Нормализует URL для безопасной загрузки в HTTPS контексте
 * Заменяет http:// на https:// для избежания Mixed Content ошибок
 *
 * @param url - URL для нормализации
 * @returns Нормализованный URL с HTTPS протоколом (если это HTTP URL)
 */
export const normalizeUrl = (url: string | undefined | null): string => {
  if (!url || typeof url !== "string") {
    return "";
  }

  // Если это data URI, base64 или относительный путь - возвращаем как есть
  if (
    url.startsWith("data:") ||
    url.startsWith("/") ||
    url.startsWith("#") ||
    !url.match(/^https?:\/\//)
  ) {
    return url;
  }

  // Заменяем http:// на https:// для избежания Mixed Content
  return url.replace(/^http:\/\//, "https://");
};
