export const valueRequired = (val: unknown) => {
  if (!val) return false;
  return true;
};

export const stringMinChars = (length: number) => (val: string) => {
  if (val.length < length) return false;
  return true;
}

