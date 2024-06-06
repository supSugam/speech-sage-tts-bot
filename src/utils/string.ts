// export function splitStringIntoChunks(
//   inputString: string,
//   chunkSize: number
// ): string[] {
//   const result: string[] = [];
//   const sentences = inputString.match(/[^.!?]+[.!?]+/g); // Extracting sentences
//   if (!sentences) return result; // Return empty array if no sentences found

//   let currentChunk = '';
//   for (const sentence of sentences) {
//     if (currentChunk.length + sentence.length <= chunkSize) {
//       currentChunk += sentence;
//     } else {
//       result.push(currentChunk);
//       currentChunk = sentence;
//     }
//   }

//   if (currentChunk) {
//     result.push(currentChunk); // Push any remaining chunk
//   }

//   return result;
// }

export function splitStringIntoChunks(
  inputString: string,
  chunkSize: number,
  singleSentenceMode = false
): string[] {
  let chunks: string[] = [];
  const sentences = inputString.split(/(?<=[.?!;\s])\s/g).map((s) => {
    const endsWith = s.charAt(s.length - 1);
    if (endsWith.match(/[.?!;]/)) {
      const regex = new RegExp(`\\${endsWith}+`, 'g');
      const replacedString = s.replace(regex, `${endsWith} `);
      return replacedString;
    }
    return s;
  });

  if (singleSentenceMode) return sentences;

  let str = '';
  for (const sentence of sentences) {
    if (chunkSize - str.length >= sentence.length) {
      str += sentence;
    } else {
      chunks.push(chunks.length === 0 ? str : ` ${str.trim()}`);
      str = sentence;
    }
  }
  if (str) chunks.push(chunks.length === 0 ? str : ` ${str.trim()}`);

  console.log(chunks);
  return chunks;
}
