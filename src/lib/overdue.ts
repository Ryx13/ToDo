export function isOverdue(
  dueDate: number,
  status: string,
  isArchived: number,
  today: number
): boolean {
  return dueDate < today && status !== "Complete" && isArchived === 0;
}