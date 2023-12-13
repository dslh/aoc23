import { readInputChunks } from './input/read';

interface Pattern {
  rows: string[];
  cols: string[];
}

function toPattern(chunk: string[]): Pattern {
  let cols: string[];

  return {
    rows: chunk,
    get cols() {
      if (!cols) {
        cols = [];
        for (let i = 0; i < chunk[0].length; ++i)
          cols.push(chunk.map(line => line[i]).join(''));
      }

      return cols;
    }
  };
}

const patterns: Pattern[] = readInputChunks(13).map(toPattern);

function isAxisOfSymmetry(lines: string[], at: number): boolean {
  for (let i = 0; (at + i < lines.length) && (at - i > 0); ++i)
    if (lines[at + i] !== lines[at - i - 1])
      return false;

  return true;
}

function findSymmetry(lines: string[]): number | undefined {
  for (let i = 1; i < lines.length; ++i)
    if (isAxisOfSymmetry(lines, i))
      return i;
}

function symmetryValue(pattern: Pattern): number {
  const horizontalSymmetry = findSymmetry(pattern.rows);
  if (horizontalSymmetry !== undefined)
    return horizontalSymmetry * 100;

  const verticalSymmetry = findSymmetry(pattern.cols);
  if (verticalSymmetry !== undefined)
    return verticalSymmetry;

  throw 'Symmetry not found';
}

console.log('Part 1:');
console.log(patterns.map(symmetryValue).reduce((acc, n) => acc + n));

function countDiffs(a: string, b: string): number {
  let count = 0;
  for (let i = 0; i < a.length; ++i)
    if (a[i] !== b[i])
      ++count;
  return count;
}

function isSmudgedAxisOfSymmetry(lines: string[], at: number): boolean {
  let smudges = 0;
  for (let i = 0; (at + i < lines.length) && (at - i > 0); ++i) {
    smudges += countDiffs(lines[at + i], lines[at - i - 1]);
    if (smudges > 1)
      return false;
  }

  return smudges === 1;
}

function findSmudgedSymmetry(lines: string[]): number | undefined {
  for (let i = 1; i < lines.length; ++i)
    if (isSmudgedAxisOfSymmetry(lines, i))
      return i;
}

function smudgedSymmetryValue(pattern: Pattern): number {
  const horizontalSymmetry = findSmudgedSymmetry(pattern.rows);
  if (horizontalSymmetry !== undefined)
    return horizontalSymmetry * 100;

  const verticalSymmetry = findSmudgedSymmetry(pattern.cols);
  if (verticalSymmetry !== undefined)
    return verticalSymmetry;

  throw 'Symmetry not found';
}

console.log('Part 2:');
console.log(patterns.map(smudgedSymmetryValue).reduce((acc, n) => acc + n));
