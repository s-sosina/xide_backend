export function getPagination(page: number, limit: number) {
  const take = limit || 10;
  const skip = ((page || 1) - 1) * take;
  return { skip, take };
}
