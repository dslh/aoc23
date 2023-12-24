import { readInputLines } from './input/read';
import { eachPair } from './lib/iter';

const input = readInputLines(24);

interface Position {
  x: number;
  y: number;
  z?: number;
}
function readPosition(str: string): Position {
  const [x, y, z] = str.split(', ').map(n => parseInt(n));
  return { x, y, z };
}

interface Hailstone {
  pos: Position;
  vel: Position;

  slope: number;
  intercept: number;
}
function readHailstone(line: string): Hailstone {
  const [pos, vel] = line.split(' @ ').map(readPosition);

  const slope = vel.y / vel.x;
  const intercept = pos.y - slope * pos.x;

  return { pos, vel, slope, intercept };
}

const stones = input.map(readHailstone);

function intersection(a: Hailstone, b: Hailstone): Position | undefined {
  if (a.slope === b.slope) return;
  const x = (b.intercept - a.intercept) / (a.slope - b.slope);
  const y = a.slope * x + a.intercept;

  return { x, y };
}

function tx(stone: Hailstone, { x }: Position): number {
  return (x - stone.pos.x) / stone.vel.x;
}

function ty(stone: Hailstone, { y }: Position): number {
  return (y - stone.pos.y) / stone.vel.y;
}

function mightIntersect(a: Hailstone, b: Hailstone, min: number, max: number): boolean {
  const pos = intersection(a, b);

  if (!pos) return false;
  if (pos.x < min || pos.x > max) return false;
  if (pos.y < min || pos.y > max) return false;

  return tx(a, pos) >= 0 && tx(b, pos) >= 0;
}

function countIntersections(stones: Hailstone[], min: number, max: number): number {
  let count = 0;

  eachPair(stones, (a, b) => {
    if (mightIntersect(a, b, min, max)) ++count;
  });

  return count;
}

console.log('Part 1:');
console.log(countIntersections(stones, 200000000000000, 400000000000000));
