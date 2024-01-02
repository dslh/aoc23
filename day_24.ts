import { readInputLines } from './input/read';
import { eachPair } from './lib/iter';
import { reducedRowEchelonForm } from './lib/gauss';

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

function crossProductMatrix(a: Hailstone, b: Hailstone): number[][] {
  const { pos: { x: pax, y: pay, z: paz }, vel: { x: vax, y: vay, z: vaz } } = a;
  const { pos: { x: pbx, y: pby, z: pbz }, vel: { x: vbx, y: vby, z: vbz } } = b;

  return [
    [        0, vbz - vaz, vay - vby,         0, paz - pbz, pby - pay,
      pay * vaz + pbz * vby - paz * vay - pby * vbz],

    [vaz - vbz,         0, vbx - vax, pbz - paz,         0, pax - pbx,
      paz * vax + pbx * vbz - pax * vaz - pbz * vbx],

    [vby - vay, vax - vbx,         0, pay - pby, pbx - pax,         0,
      pax * vay + pby * vbx - pay * vax - pbx * vby],
  ];
}

console.log('Part 2:');
const matrix = crossProductMatrix(stones[0], stones[1])
               .concat(crossProductMatrix(stones[0], stones[2]));
reducedRowEchelonForm(matrix);

// Correct except for floating point errors :'(
console.log(matrix[0][6] + matrix[1][6] + matrix[2][6]);
