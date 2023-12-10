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
}

const NORTH = new Position( 0, -1);
const SOUTH = new Position( 0,  1);
const EAST  = new Position( 1,  0);
const WEST  = new Position(-1,  0);

const SHAPES: { [chr: string]: Shape } = {
  '-': new Shape( EAST,  WEST),
  '|': new Shape(NORTH, SOUTH),
  'J': new Shape(NORTH,  WEST),
  '7': new Shape(SOUTH,  WEST),
  'L': new Shape(NORTH,  EAST),
  'F': new Shape(SOUTH,  EAST),
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

function farthestDistance(map: PipeMap, start: Pipe): number {
  const at = ({ x, y }: Position): Pipe => {
    const pipe = map[y][x];
    if (!pipe) throw 'Not found';
    return pipe;
  };

  let prevA = start;
  let prevB = start;
  let a: Pipe = at(start.pos.plus(start.shape.a));
  let b: Pipe = at(start.pos.plus(start.shape.b));
  let distance: number = 1;

  while (a !== b) {
    const nextA = at(a.opposite(prevA.pos));
    const nextB = at(b.opposite(prevB.pos));
    prevA = a;
    prevB = b;
    a = nextA;
    b = nextB;
    distance++;
  }

  return distance;
}

const map: PipeMap = parseMap(input);
const start = startPipe(map, findStart(input));

console.log('Part 1:');
console.log(farthestDistance(map, start));
