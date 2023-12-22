import { readInputLines } from './input/read';
import { Grid, createGrid } from './lib/grid';
import Queue from './lib/queue';

const input = readInputLines(22);

interface Position {
  x: number;
  y: number;
  z: number;
}
type Axis = 'x' | 'y' | 'z';
function Position([x, y, z]: number[]): Position {
  return { x, y, z };
}

type PositionIterator = (callback: (pos: Position) => any) => void;
function PositionIterator(start: Position, end: Position, axis: Axis): PositionIterator {
  return (callback: (pos: Position) => any) => {
    for (let i = start[axis]; i <= end[axis]; ++i)
      callback({ ...start, [axis]: i });
  }
}

function BaseIterator(start: Position, end: Position, axis: Axis): PositionIterator {
  if (axis === 'z')
    return (callback: (pos: Position) => any) => {
      callback(start);
    }

  return PositionIterator(start, end, axis);
}

interface Brick {
  id: string;
  a: Position;
  b: Position;

  axis: 'x' | 'y' | 'z';

  supports: Brick[];
  supporters: Brick[];

  each: PositionIterator;
  eachBase: PositionIterator;
}
let brickSerialNumber = 0;
const Brick = (line: string): Brick => {
  const [a, b] =
    line.split('~').map(
      half => half.split(',').map(n => parseInt(n))
    ).map(Position);

  const axis: Axis =
    (a.x !== b.x ? 'x' :
      (a.y !== b.y ? 'y' :
        'z')
    );

  return {
    id: (++brickSerialNumber).toString(36),
    a, b, axis,

    supports: [],
    supporters: [],

    each: PositionIterator(a, b, axis),
    eachBase: BaseIterator(a, b, axis),
  };
}

function dropBrick(brick: Brick, floor: number) {
  brick.b.z -= brick.a.z - floor - 1;
  brick.a.z = floor + 1;
}

function dropBricks(bricks: Brick[]) {
  interface Top {
    brick: Brick;
    height: number;
  }
  const surface: Grid<Top> = createGrid<Top>();

  bricks.sort(({ a: { z: a } }, { a: { z: b } }) => a - b);

  bricks.forEach(brick => {
    let height = 0;
    brick.eachBase(pos => {
      const top = surface.getAt(pos);
      if (top && top.height > height)
        height = top.height;
    });

    dropBrick(brick, height);

    brick.eachBase(pos => {
      const top = surface.getAt(pos);
      if (top && top.height === (pos.z - 1) &&
          !top.brick.supports.includes(brick)) {
        top.brick.supports.push(brick);
        brick.supporters.push(top.brick);
      }
      surface.setAt(pos, { brick, height: brick.b.z });
    });
  });
}

function canRemove(brick: Brick): boolean {
  return brick.supports.every(other => other.supporters.length > 1);
}

const bricks: Brick[] = input.map(Brick);
dropBricks(bricks);

console.log('Part 1:');
console.log(bricks.filter(canRemove).length);

function cascadeCount(brick: Brick): number {
  if (canRemove(brick)) return 0;

  const dropped: { [id: string]: boolean } = {};
  const dropping: Queue<Brick> = new Queue();
  dropping.push(brick);

  let count = 0;
  while (!dropping.empty) {
    const drop = dropping.pop();

    dropped[drop.id] = true;
    for (const supported of drop.supports) {
      if (supported.supporters.every(({ id }) => dropped[id])) {
        dropping.push(supported);
        count++;
      }
    }
  }

  return count;
}

console.log('Part 2:');
console.log(bricks.map(cascadeCount).reduce((acc, n) => acc + n));
