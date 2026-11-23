export function getPointsForOrder(order: number): number {
  switch (order) {
    case 1:
      return 11;
    case 2:
      return 7;
    case 3:
      return 5;
    case 4:
      return 3;
    default:
      return 1;
  }
}
