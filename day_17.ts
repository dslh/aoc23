import { readInputLines } from './input/read';
import { Position, Dir, move, REVERSE_DIR, posEq } from './lib/pos';
import PriorityQueue from 'ts-priority-queue';

const input: string[] = readInputLines(17);

interface GridConstructor<T> {
  data?: T[][];
  width?: number;
  height?: number;
  fill?: T;
}
class Grid<T> {
  data: T[][];
  width: number;
  height: number;

  constructor({ data, width, height, fill }: GridConstructor<T>) {
    if (data) {
      this.data = data;
      this.height = data.length;
      this.width = data[0].length;
    } else {
      this.width = width;
      this.height = height;
      this.data = Array(height).fill(null).map(() => Array(width).fill(fill));
    }
  }

  getAt({ x, y }: Position): T {
    return this.data[y][x];
  }

  setAt({ x, y }: Position, value: T) {
    this.data[y][x] = value;
  }
}

interface Momentum {
  dir: Dir;
  count: number;
}

interface Visit {
  pos: Position;
  prev: Visit | null;
  cost: number;
  momentum: Momentum;
}
function cheapestPath({ cost: a }: Visit, { cost: b }: Visit): number {
  return a - b;
}
function visitKey({ pos: { x, y }, momentum: { dir, count } }: Visit): string {
  return `${x},${y},${dir},${count}`;
}

class City {
  grid: Grid<number>;
  minMomentum: number;
  maxMomentum: number;

  constructor(input: string[], minMomentum: number, maxMomentum: number) {
    this.grid = new Grid<number>({
      data: input.map(line => line.split('').map(n => parseInt(n)))
    });
    this.minMomentum = minMomentum;
    this.maxMomentum = maxMomentum;
  }

  inBounds({ x, y }: Position): boolean {
    return x >= 0 && x < this.grid.width &&
           y >= 0 && y < this.grid.height;
  }

  momentum(dir: Dir, momentum: Momentum): Momentum {
    if (dir === momentum.dir)
      return { dir, count: momentum.count + 1 };
    else
      return { dir, count: 1 };
  }

  neighbour(dir: Dir, prev: Visit): Visit | undefined {
    const pos = move(prev.pos, dir);
    if (dir === REVERSE_DIR[prev.momentum.dir]) return;
    if (!this.inBounds(pos)) return;

    const momentum = this.momentum(dir, prev.momentum);
    if (momentum.count > this.maxMomentum) return;

    return {
      pos, prev, momentum,
      cost: prev.cost + this.grid.getAt(pos),
    };
  }

  neighbours(visit: Visit): Visit[] {
    const { x, y } = visit.pos;

    return (visit.momentum.count < this.minMomentum ?
      [this.neighbour(visit.momentum.dir, visit)] :
      [
        this.neighbour('R', visit),
        this.neighbour('L', visit),
        this.neighbour('U', visit),
        this.neighbour('D', visit)
      ]
    ).filter(v => v !== undefined)
  }

  search(start: Position, end: Position): Visit {
    const queue = new PriorityQueue<Visit>({ comparator: cheapestPath });
    queue.queue({ pos: start, prev: null, cost: 0, momentum: { dir: 'R', count: 0 } });
    queue.queue({ pos: start, prev: null, cost: 0, momentum: { dir: 'D', count: 0 } });
    const visited = {};

    while (queue.length > 0) {
      const next: Visit = queue.dequeue();
      if (posEq(next.pos, end) && next.momentum.count >= this.minMomentum)
        return next;

      const key = visitKey(next);
      if (visited[key])
        continue;
      visited[key] = true;

      for (const neighbour of this.neighbours(next)) {
        queue.queue(neighbour);
      }
    }

    throw 'Not found!';
  }
}

console.log('Part 1:');
const city = new City(input, 0, 3);
const start = { x: 0, y: 0 };
const end = { x: city.grid.width - 1, y: city.grid.height - 1 };
console.log(city.search(start, end).cost);

console.log('Part 2:');
const ultra = new City(input, 4, 10);
// Between 1213 and 1240
console.log(ultra.search(start, end).cost);


function printPath(path: Visit) {
  const trail = new Grid<boolean>({ width: city.grid.width, height: city.grid.height, fill: false });
  let next = path;
  while (next) {
    trail.setAt(next.pos, true);
    next = next.prev;
  }
  for (let y = 0; y < trail.height; y++) {
    for (let x = 0; x < trail.width; x++) {
      if (trail.getAt({ x, y }))
        process.stdout.write('#');
      else
        process.stdout.write(`${city.grid.getAt({ x, y })}`);
    }
    console.log();
  }
}
// printPath(ultra.search(start, end));
