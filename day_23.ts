import { readInputLines } from './input/read';
import { Position, adjacent, posAdd, posEq } from './lib/pos';

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
}

type Slope = '>' | '<' | '^' | 'v';
const DOWNWARD: {[slope: string]: Position} = {
  '>': { x:  1, y:  0 },
  '<': { x: -1, y:  0 },
  'v': { x:  0, y:  1 },
  '^': { x:  0, y: -1 }
};

interface Edge {
  path: Position[];
  end: Vertex;
}
interface Vertex {
  pos: Position;
  edges: Edge[];
}

class Graph {
  grid: Grid;
  vertices: Vertex[] = [];
  start: Vertex;
  end: Vertex;

  constructor(grid: Grid) {
    this.grid = grid;
    this.start = { pos: grid.start, edges: [] };
    this.end = { pos: grid.end, edges: [] };

    this.vertices.push(this.start);
    this.vertices.push(this.end);

    const innerVerts: Vertex[] = [];
    for (let y = 1; y + 1 < grid.height; ++y) {
      for (let x = 1; x + 1 < grid.width; ++x) {
        const pos = { x, y };
        if (grid.isVertex(pos)) {
          const vertex = { pos, edges: [] };
          this.vertices.push(vertex);
          innerVerts.push(vertex);
        }
      }
    }

    this.followEdge(this.start, { x: grid.start.x, y: 1 });

    for (const vertex of innerVerts)
      this.followEdges(vertex);
  }

  followEdge(vertex: Vertex, start: Position) {
    const path: Position[] = [start];

    let prev = vertex.pos;
    let pos = start;
    while (!this.grid.isVertex(pos)) {
      const next = this.grid.next(pos, prev);
      path.push(next);
      prev = pos;
      pos = next;
    }

    const end = this.vertices.find(v => posEq(v.pos, pos));
    vertex.edges.push({ path, end });
  }

  followEdges(vertex: Vertex) {
    for (const pos of this.grid.adjacent(vertex.pos)) {
      const tile = this.grid.at(pos);
      if (tile === '.' || posEq(vertex.pos, posAdd(pos, DOWNWARD[tile])))
        continue;

      this.followEdge(vertex, pos);
    }
  }

  longestPath(): number {
    const paths: Edge[][] = [];

    this.search(this.start.edges[0], this.start.edges, paths);

    return Math.max(...paths.map(path => path.reduce((acc, edge) => acc + edge.path.length, 0)));
  }

  search(edge: Edge, path: Edge[], paths: Edge[][]) {
    if (edge.end === this.end) {
      paths.push(path);
      return;
    }

    for (const next of edge.end.edges) {
      this.search(next, [...path, next], paths);
    }
  }
}

const grid = new Grid(readInputLines(23));
const graph = new Graph(grid);

console.log('Part 1:')
console.log(graph.longestPath());
