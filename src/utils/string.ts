export function splitStringIntoChunks(
  inputString: string,
  chunkSize: number
): string[] {
  const result: string[] = [];
  for (let i = 0; i < inputString.length; i += chunkSize) {
    result.push(inputString.slice(i, i + chunkSize));
  }
  return result;
}
