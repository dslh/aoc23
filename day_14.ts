import { readInputLines } from './input/read';

const grid = readInputLines(14);

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
function tilt(rocks: Rock[][]): Rock[][] {
  for (const row of rocks) tiltRow(row);
  return rocks;
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

function key(rocks: Rock[][]): string {
  let key: bigint = BigInt(0);

  for (const row of rocks)
    for (const rock of row) {
      key = (key << BigInt(1)) + BigInt(rock === Rock.Sphere);
    }

  return key.toString(36);
}

console.log('Part 1:');
const tilted = rotate(rocks);
tilt(tilted);
console.log(load(tilted));

function findLoop(rocks: Rock[][]) {
  const cycle: { [key: string]: number} = {};
  const loads: number[] = [];
  let step = 0;
  rocks = tilt(rotate(rocks));
  let k = key(rocks);
  while (!cycle[k]) {
    cycle[k] = step++;
    for (let i = 0; i < 4; ++i) {
      rocks = rotate(rocks);
      if (i === 3)
        loads.push(load(rocks));
      tilt(rocks);
    }
    k = key(rocks);
  }

  const start = cycle[k];
  const end = step;
  const period = end - start;
  const i = ((1000000000 - start) % period) + start - 1;
  console.log(start, end, period, i);
  console.log(loads);
  return loads[i];
}

console.log('Part 2:');
console.log(findLoop(rocks));
