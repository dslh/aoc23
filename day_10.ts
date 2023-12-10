import { readInputLines } from './input/read';

const input: string[] = readInputLines(10);

class Position {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  isEqual(other: Position): boolean {
    return this.x === other.x && this.y === other.y;
  }

  minus(other: Position): Position {
    return new Position(this.x - other.x, this.y - other.y);
  }

  plus(other: Position): Position {
    return new Position(this.x + other.x, this.y + other.y);
  }
}

class Shape {
  a: Position;
  b: Position;

  constructor(a: Position, b: Position) {
    this.a = a;
    this.b = b;
  }

  opposite(dir: Position): Position | undefined {
    if (dir.isEqual(this.a)) return this.b;
    if (dir.isEqual(this.b)) return this.a;
  }

  isEqual(other: Shape): boolean {
    return (this.a.isEqual(other.a) && this.b.isEqual(other.b)) ||
           (this.a.isEqual(other.b) && this.b.isEqual(other.a));
  }
}

const NORTH = new Position( 0, -1);
const SOUTH = new Position( 0,  1);
const EAST  = new Position( 1,  0);
const WEST  = new Position(-1,  0);

const NORTH_SOUTH = new Shape(NORTH, SOUTH);
const EAST_WEST = new Shape(EAST, WEST);
const NORTH_WEST = new Shape(NORTH, WEST);
const NORTH_EAST = new Shape(NORTH, EAST);
const SOUTH_WEST = new Shape(SOUTH, WEST);
const SOUTH_EAST = new Shape(SOUTH, EAST);

const SHAPES: { [chr: string]: Shape } = {
  '-': EAST_WEST,
  '|': NORTH_SOUTH,
  'J': NORTH_WEST,
  '7': SOUTH_WEST,
  'L': NORTH_EAST,
  'F': SOUTH_EAST,
};

class Pipe {
  pos: Position;
  shape: Shape;

  constructor(pos: Position, shape: Shape) {
    this.pos = pos;
    this.shape = shape;
  }

  opposite(pos: Position): Position | undefined {
    const diff = pos.minus(this.pos);
    const opposite = this.shape.opposite(diff);
    return opposite && this.pos.plus(opposite);
  }
}

type PipeMap = (Pipe | undefined)[][];
function parseMap(input: string[]): PipeMap {
  return input.map((line, y) => {
    const row: (Pipe | undefined)[] = [];

    for (let x = 0; x < line.length; ++x) {
      const c = line[x];
      const shape = SHAPES[c];

      if (shape)
        row[x] = new Pipe(new Position(x, y), shape);
    }

    return row;
  });
}

function findStart(input: string[]): Position {
  for (let y = 0; y < input.length; ++y) {
    const line = input[y];
    const x = line.indexOf('S');
    if (x >= 0)
      return new Position(x, y);
  }

  throw 'Start not found';
}

function startPipe(map: PipeMap, pos: Position) {
  const connections = [NORTH, SOUTH, EAST, WEST].filter(dir => {
    const { x, y } = pos.plus(dir);
    const row = map[y];
    const pipe = row && row[x];
    return pipe && pipe.opposite(pos);
  });

  if (connections.length !== 2) throw 'Start shape could not be determined';

  const shape = new Shape(connections[0], connections[1]);
  return new Pipe(pos, shape);
}

class Loop {
  map: PipeMap;
  length: number;

  constructor(map: PipeMap, start: Pipe) {
    this.map = [];
    this.length = 2;

    const at = ({ x, y }: Position): Pipe => {
      const pipe = map[y][x];
      if (!pipe) throw 'Not found';
      return pipe;
    };

    let prevA = start;
    let prevB = start;
    let a: Pipe = at(start.pos.plus(start.shape.a));
    let b: Pipe = at(start.pos.plus(start.shape.b));

    this.add(start);
    this.add(a);
    this.add(b);

    while (a !== b) {
      const nextA = at(a.opposite(prevA.pos));
      const nextB = at(b.opposite(prevB.pos));
      prevA = a;
      prevB = b;
      a = nextA;
      b = nextB;

      this.add(a);
      this.add(b);
      this.length += 2;
    }
  }

  add(pipe: Pipe) {
    const { pos: { x, y } } = pipe;
    this.map[y] ||= [];
    this.map[y][x] = pipe;
  }

  contained(): number {
    let count = 0;

    for (const row of this.map) {
      let inside = false;
      let fromNorth: boolean;
      for (let x = 0; x < row.length; ++x) {
        if (!row[x]) {
          if (inside) count++;
          continue;
        }

        const { shape } = row[x];
        if (shape.isEqual(NORTH_SOUTH))
          inside = !inside;

        if (shape.isEqual(NORTH_EAST))
          fromNorth = true;

        if (shape.isEqual(SOUTH_EAST))
          fromNorth = false;

        if (shape.isEqual(SOUTH_WEST) && fromNorth)
          inside = !inside;

        if (shape.isEqual(NORTH_WEST) && !fromNorth)
          inside = !inside;
      }
    }

    return count;
  }
};

const map: PipeMap = parseMap(input);
const start = startPipe(map, findStart(input));
const loop = new Loop(map, start);

console.log('Part 1:');
console.log(loop.length / 2);
console.log('Part 2:');
console.log(loop.contained());
