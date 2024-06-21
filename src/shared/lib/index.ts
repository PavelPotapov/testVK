/**
 * Форматирует время в секундах в строку "мм:сс".
 * @param {number} time Время в секундах.
 * @returns {string} Отформатированная строка времени в формате "мм:сс".
 */
export const formatSecondsToTime = (time: number): string => {
  const minutes = Math.floor(time / 60)
  const seconds = Math.floor(time % 60)
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`
}
