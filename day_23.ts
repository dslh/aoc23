import { readInputLines } from './input/read';
import { Position, adjacent, posAdd, posEq } from './lib/pos';
import { Graph, Edge, Path, longestPath, bidirectional } from './lib/graph';

type Slope = '>' | '<' | '^' | 'v';
const DOWNWARD: {[slope: string]: Position} = {
  '>': { x:  1, y:  0 },
  '<': { x: -1, y:  0 },
  'v': { x:  0, y:  1 },
  '^': { x:  0, y: -1 }
};

class Grid {
  lines: string[];
  width: number;
  height: number;
  start: Position;
  end: Position;

  constructor(input: string[]) {
    this.lines = input;

    this.height = input.length;
    this.width = input[0].length;

    this.start = { y: 0, x: input[0].indexOf('.') };
    this.end = {
      y: this.height - 1,
      x: input[this.height - 1].indexOf('.')
    };
  }

  at({ x, y }: Position): string {
    return this.lines[y][x];
  }

  adjacent(pos: Position): Position[] {
    return adjacent(pos).filter(adj => this.at(adj) !== '#');
  }

  isVertex(pos: Position): boolean {
    return this.at(pos) !== '#' &&
           (posEq(pos, this.start) || posEq(pos, this.end) ||
           this.adjacent(pos).length > 2);
  }

  next(pos: Position, prev: Position): Position {
    return this.adjacent(pos).filter(adj => !posEq(adj, prev))[0];
  }

  toGraph(): Graph {
    const graph: Graph = {};
    const vertCoords = {};

    const posStr = ({ x, y }: Position) => `${x},${y}`;
    const addVert = (name, pos) => {
      graph[name] = [];
      vertCoords[posStr(pos)] = name;
    };
    const getVert = (pos) => vertCoords[posStr(pos)];

    addVert('start', this.start);
    addVert('end', this.end);

    let id = 0;
    const innerVerts: Position[] = [];
    for (let y = 1; y + 1 < grid.height; ++y) {
      for (let x = 1; x + 1 < grid.width; ++x) {
        const pos = { x, y };
        if (!this.isVertex(pos)) continue;

        addVert((++id).toString(), pos);
        innerVerts.push(pos);
      }
    }

    const followEdge = (name: string, from: Position, start: Position) => {
      let length = 1;
      let prev = from;
      let pos = start;
      while (!getVert(pos)) {
        const next = this.next(pos, prev);
        length++;
        prev = pos;
        pos = next;
      }

      graph[name].push({ weight: length, dest: getVert(pos) });
    };

    followEdge('start', this.start, { x: this.start.x, y: 1 });

    for (const vert of innerVerts) {
      const name = getVert(vert);
      for (const pos of this.adjacent(vert)) {
        const tile = this.at(pos);
        if (posEq(vert, posAdd(pos, DOWNWARD[tile])))
          continue;

        followEdge(name, vert, pos);
      }
    }

    return graph;
  }
}

const grid = new Grid(readInputLines(23));
const graph = grid.toGraph();

console.log('Part 1:');
console.log(longestPath(graph, 'start', 'end').weight);

console.log('Part 2:');
console.log(longestPath(bidirectional(graph), 'start', 'end').weight);
