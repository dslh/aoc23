import { readInputLines } from './input/read';
import { Dir, Position, move, adjacent } from './lib/pos';

const input: string[] = readInputLines(18);

interface Instruction {
  dir: Dir;
  distance: number;
  colour: string;
}
function readInstruction(line: string): Instruction {
  const { dir, dist, colour } = line.match(
    /(?<dir>[UDLR]) (?<dist>\d+) \(#(?<colour>[a-f0-9]{6})\)/
  ).groups;

  return { dir: <Dir>dir, colour, distance: parseInt(dist) };
}

const instructions = input.map(readInstruction);

class InfiniteGrid<T> {
  data: { [coord: string]: T } = {};
  min: Position = { x: 0, y: 0 };
  max: Position = { x: 0, y: 0 };

  coord({ x, y }: Position): string {
    return `${x},${y}`;
  }

  getAt(pos: Position): T {
    return this.data[this.coord(pos)];
  }

  setAt({ x, y }: Position, value: T) {
    if (!this.size) {
      this.min.x = this.max.x = x;
      this.min.y = this.max.y = y;
    } else {
      if (x < this.min.x) this.min.x = x;
      if (x > this.max.x) this.max.x = x;
      if (y < this.min.y) this.min.y = y;
      if (y > this.max.y) this.max.y = y;
    }
    this.data[this.coord({ x, y })] = value;
  }

  get size() {
    return Object.keys(this.data).length;
  }
}

function dig(instructions: Instruction[]): InfiniteGrid<string> {
  const grid = new InfiniteGrid<string>();

  let cursor: Position = { x: 0, y: 0 };
  grid.setAt(cursor, 'FF00FF');

  for (const { dir, distance, colour } of instructions) {
    for (let i = 0; i < distance; ++i) {
      cursor = move(cursor, dir);
      grid.setAt(cursor, colour);
    }
  }

  return grid;
}

function filledSize(boundary: InfiniteGrid<string>): number {
  const grid = new InfiniteGrid<boolean>();
  const stack: Position[] = [];

  const inBounds = ({ x, y }: Position): boolean => (
    x >= (boundary.min.x - 1) && x <= (boundary.max.x + 1) &&
    y >= (boundary.min.y - 1) && y <= (boundary.max.y + 1)
  );

  stack.push({ x: boundary.min.x - 1, y: boundary.min.y - 1 });
  while (stack.length) {
    const pos = stack.pop();

    if (grid.getAt(pos)) continue;
    grid.setAt(pos, true);

    for (const adj of adjacent(pos))
      if (inBounds(adj) && !boundary.getAt(adj))
        stack.push(adj);
  }

  return (grid.max.x - grid.min.x + 1) *
         (grid.max.y - grid.min.y + 1) - grid.size;
}

console.log('Part 1:');
const boundary = dig(instructions);
console.log(filledSize(boundary));
