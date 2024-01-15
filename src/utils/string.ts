export function upperCaseFirstChar(str: string) {
  if (str.includes(' ')) {
    const parts = str.split(' ');
    return parts.map(upperCaseFirstChar).join(' ');
  }


  if (str.includes('-')) {
    const parts = str.split('-');
    return parts.map(upperCaseFirstChar).join('-');
  }

  const firstChar = str.substring(0, 1);
  const restOfChars = str.substring(1, str.length);
  return `${firstChar.toUpperCase()}${restOfChars.toLowerCase()}`
}