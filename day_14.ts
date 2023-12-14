import { readInputLines } from './input/read';

const grid = readInputLines(14);

function transposeGrid(grid: string[]): string[] {
  const columns: string[] = [];

  for (let i = 0; i < grid[0].length; ++i)
    columns.push(grid.map(line => line[i]).join(''));

  return columns;
}

const columns = transposeGrid(grid);

function rowLoad(row: string): number {
  let load = 0;
  let weight = row.length;

  for (let i = 0; i < row.length; ++i) {
    const c = row[i];
    if (c === 'O')
      load += weight--;

    if (c === '#')
      weight = row.length - i - 1;
  }

  return load;
}

console.log('Part 1:');
console.log(columns.map(rowLoad).reduce((acc, n) => acc + n));

enum Rock {
  None,
  Sphere,
  Cube,
}
const ROCK_SPOTTERS_GUIDE: { [key: string]: Rock } = {
  '.': Rock.None,
  'O': Rock.Sphere,
  '#': Rock.Cube,
}

function rockify(grid: string[]): Rock[][] {
  return grid.map(row => row.split('').map(r => ROCK_SPOTTERS_GUIDE[r] || Rock.None));
}

const rocks = rockify(grid);

function tiltRow(row: Rock[]) {
  for (let i = 1; i < row.length; ++i) {
    if (row[i] === Rock.None) {
      let j;
      for (j = i; j > 0 && row[j - 1] === Rock.Sphere; --j);
      if (i !== j) {
        row[i] = Rock.Sphere;
        row[j] = Rock.None;
      }
    }
  }
}
function tilt(rocks: Rock[][]) {
  for (const row of rocks) tiltRow(row);
}
function rotate(rocks: Rock[][]): Rock[][] {
  const height = rocks.length;
  const width = rocks[0].length;
  return Array(height).fill(null).map((_,y) => (
    Array(width).fill(null).map((_,x) => rocks[height - x - 1][y])
  ));
}

function load(rocks: Rock[][]): number {
  return rocks.map(row => row.map((r, i) => r === Rock.Sphere ? i + 1 : 0)
                             .reduce((acc, n) => acc + n)
                  )
              .reduce((acc, n) => acc + n);
}

console.log('Part 1:');
const tilted = rotate(rocks);
tilt(tilted);
console.log(load(tilted));
