export const isCorrectFftSize = (value: number): boolean => {
  return (value & (value - 1)) === 0 && value >= 32 && value <= 32768
}
