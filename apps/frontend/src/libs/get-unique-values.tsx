export const getUniqueValues = (items: string[], property: any) => {
  return Array.from(new Set(items.map((item) => item[property])));
};
