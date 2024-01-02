import { readInputLines } from './input/read';
import { Position, adjacent } from './lib/pos';
import Queue from './lib/queue';
import { Grid, createGrid } from './lib/grid';

const input: string[] = readInputLines(21);
const width = input[0].length;
const height = input.length;

const isRock = ({ x, y }: Position): boolean => input[y][x] === '#';

function findStart(input: string[]): Position {
  const y = input.findIndex(line => line.includes('S'));
  const x = input[y].indexOf('S');

  return { x, y };
}

const start = findStart(input);

interface Visit {
  pos: Position;
  steps: number;
}

const countEvenSteps = (maxSteps: number): number => {
  const queue: Queue<Visit> = new Queue<Visit>();
  queue.push({ pos: start, steps: 0 });
  const visited: Grid<boolean> = createGrid<boolean>();

  let evens = 0;

  while (!queue.empty) {
    const { pos, steps }: Visit = queue.pop();
    if (visited.getAt(pos)) continue;
    visited.setAt(pos, true);

    if ((steps & 1) === 0) evens++;
    if (steps === maxSteps) continue;

    for (const next of adjacent(pos)) {
      if (isRock(next)) continue;
      queue.push({ pos: next, steps: steps + 1 });
    }
  }

  return evens;
}

console.log('Part 1:');
console.log(countEvenSteps(64));

console.log('Part 2:');
console.log(input[0].length, input.length);
console.log(start);
// 26501365
// 5 11 481843
function sumUpToN(n: number): number {
  return n * (n + 1) / 2;
}
function manhattanArea(radius: number) {
  return sumUpToN(radius) + sumUpToN(radius - 1);
}

/**
 * o
 * = 1
 *
 *  o
 * ooo
 *  o
 * = 5 (+4)
 *
 *   o
 *  ooo
 * ooooo
 *  ooo
 *   o
 * = 13 (+8)
 *
 *    o
 *   ooo
 *  ooooo
 * ooooooo
 *  ooooo
 *   ooo
 *    o
 * = 25 (+12)
 *
 *     o
 *    ooo
 *   ooooo
 *  ooooooo
 * ooooooooo
 *  ooooooo
 *   ooooo
 *    ooo
 *     o
 * = 41 (+16)
 *
 * o = 1
 *
 *  x
 * xox
 *  x
 * o = 1
 * x = 4
 *
 * odds = 4 * n * (n + 1) + 1
 * even = 4 * n ** 2
 * steps = 26501365
 * n = (steps - 65) / 131 / 2 = 101150
 * o = 40925290000
 * e = 40925694601
 */
