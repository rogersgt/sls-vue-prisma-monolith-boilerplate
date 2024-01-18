export const valueRequired = (val: unknown) => {
  if (!val) return false;
  return true;
};

export const stringMinChars = (length: number) => (val: string) => {
  if (val.length < length) return false;
  return true;
}

export const mustBeValidUrl = (value: string) => {
  if (!value.startsWith('http://') && !value.startsWith('https://')) return false;
  // TODO: more matching
  return true;
}

export const mustNotBeUrl = (value: string) => {
  if (value.startsWith('http://') || value.startsWith('https://')) return false;
  // TODO: more matching
  return true;
}
