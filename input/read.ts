import { readFileSync } from 'fs';
import { join as joinPath } from 'path';

const readInput = (day: number, test?: any): string => (
  readFileSync(joinPath(__dirname, `./${day}.${test ? 'test' : 'txt'}`), 'utf-8')
);

export const readInputLines = (day: number, test?: any): string[] => readInput(day, test).split('\n');

export const readInputChunks = (day: number, test?: any): string[][] => (
  readInput(day, test).split('\n\n').map(chunk => chunk.split('\n'))
);

export default readInput;
