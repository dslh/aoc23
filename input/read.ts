import { readFileSync } from 'fs';
import { join as joinPath } from 'path';

const readInput = (day: number, test?: any) => (
  readFileSync(joinPath(__dirname, `./${day}.${test ? 'test' : 'txt'}`), 'utf-8')
);

export const readInputLines = (day: number, test?: any) => readInput(day, test).split('\n');

export default readInput;
