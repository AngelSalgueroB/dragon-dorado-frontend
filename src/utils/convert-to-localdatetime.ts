export const toLocalDateTime = (date: string) => {
  if (!date) return undefined;
  return `${date}T00:00:00`;
};
