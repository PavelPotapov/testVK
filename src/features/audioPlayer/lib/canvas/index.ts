// Функция для рисования скругленного прямоугольника

export const roundRect = (
  ctx: CanvasRenderingContext2D,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  radius: number
) => {
  radius = Math.min(radius, (x2 - x1) / 2, (y2 - y1) / 2) // избегаем артефактов, в случае если радиус скругления больше одной из сторон
  ctx.beginPath()
  ctx.moveTo(x1 + radius, y1)
  ctx.lineTo(x2 - radius, y1)
  ctx.arcTo(x2, y1, x2, y1 + radius, radius)
  ctx.lineTo(x2, y2 - radius)
  ctx.arcTo(x2, y2, x2 - radius, y2, radius)
  ctx.lineTo(x1 + radius, y2)
  ctx.arcTo(x1, y2, x1, y2 - radius, radius)
  ctx.lineTo(x1, y1 + radius)
  ctx.arcTo(x1, y1, x1 + radius, y1, radius)
  ctx.closePath()
  ctx.fill()
}
