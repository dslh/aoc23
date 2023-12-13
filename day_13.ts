import { readInputChunks } from './input/read';

interface CharGenerator {
  (i: number): Generator<string>;
  size: number;
}
interface IterableGrid {
  rows: CharGenerator;
  cols: CharGenerator;
}

function toGrid(chunk: string[]): IterableGrid {
  const rows = function*(i: number): Generator<string> {
    for (const c of chunk[i])
      yield c;
  }
  rows.size = chunk.length;

  const cols = function*(i: number): Generator<string> {
    for (const row of chunk)
      yield row[i];
  }
  cols.size = chunk[0].length;

  return { rows, cols };
}

const grids: IterableGrid[] = readInputChunks(13).map(toGrid);

function countSmudges(a: Generator<string>, b: Generator<string>, limit: number = 0) {
  let count = 0;
  let charA: string;
  while (charA = a.next().value) {
    const { value: charB } = b.next();
    if (charA !== charB && ++count > limit)
      break;
  }
  return count;
}

function checkSymmetry(lines: CharGenerator, at: number, expectedSmudges: number = 0): boolean {
  let smudges = 0;
  for (let i = 0; (at + i < lines.size) && (at - i > 0); ++i) {
    smudges += countSmudges(lines(at + i), lines(at - i - 1), expectedSmudges);
    if (smudges > expectedSmudges)
      return false;
  }
  return smudges === expectedSmudges;
}

function findAxisOfSymmetry(lines: CharGenerator, expectedSmudges: number): number | undefined {
  for (let i = 1; i < lines.size; ++i)
    if (checkSymmetry(lines, i, expectedSmudges))
      return i;
}

function summarizeSymmetry(grid: IterableGrid, expectedSmudges: number): number {
  const horizontalSymmetry = findAxisOfSymmetry(grid.rows, expectedSmudges);
  if (horizontalSymmetry !== undefined)
    return horizontalSymmetry * 100;

  const verticalSymmetry = findAxisOfSymmetry(grid.cols, expectedSmudges);
  if (verticalSymmetry !== undefined)
    return verticalSymmetry;

  throw 'Symmetry not found';
}

console.log('Part 1:');
console.log(grids.map(grid => summarizeSymmetry(grid, 0)).reduce((acc, n) => acc + n));

console.log('Part 2:');
console.log(grids.map(grid => summarizeSymmetry(grid, 1)).reduce((acc, n) => acc + n));
