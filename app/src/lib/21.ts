import PriorityQueue from './PriorityQueue'

export function toGrid(input: string): boolean[][] {
  return input.split('\n').map(line => line.split('').map(c => c == '#'))
}

export function findStart(input: string): Position {
  const lines = input.split('\n');
  const i = lines.findIndex(line => line.includes('S'));
  const j = lines[i].indexOf('S');

  return { i, j };
}

export interface Position {
  i: number;
  j: number;
}

interface Node {
  position: Position;
  distance: number;
  parent: Position | null;
}

export function shortestPaths(grid: boolean[][], start: Position): { distances: number[][], tree: (Position | null)[][] } {
  const rows = grid.length;
  const cols = grid[0].length;
  const distances: number[][] = Array.from({ length: rows }, () => Array(cols).fill(Infinity));
  const tree: (Position | null)[][] = Array.from({ length: rows }, () => Array(cols).fill(null));
  const pq = new PriorityQueue<Node>((a, b) => a.distance - b.distance);
  const visited: boolean[][] = Array.from({ length: rows }, () => Array(cols).fill(false));

  distances[start.i][start.j] = 0;
  pq.push({ position: start, distance: 0, parent: null });

  while (!pq.empty()) {
    const currentNode = pq.pop();
    if (!currentNode) break;
    const { position, distance, parent } = currentNode;

    if (visited[position.i][position.j]) continue;
    visited[position.i][position.j] = true;
    tree[position.i][position.j] = parent;

    const neighbors = getNeighbors(position, rows, cols);
    for (const neighbor of neighbors) {
      if (grid[neighbor.i][neighbor.j] || visited[neighbor.i][neighbor.j]) continue;
      const newDistance = distance + 1;
      if (newDistance < distances[neighbor.i][neighbor.j]) {
        distances[neighbor.i][neighbor.j] = newDistance;
        pq.push({ position: neighbor, distance: newDistance, parent: position });
      }
    }
  }

  return { distances, tree };
}

function getNeighbors(position: Position, rows: number, cols: number): Position[] {
  const { i, j } = position;
  const neighbors: Position[] = [];
  if (i > 0) neighbors.push({ i: i - 1, j });
  if (i < rows - 1) neighbors.push({ i: i + 1, j });
  if (j > 0) neighbors.push({ i, j: j - 1 });
  if (j < cols - 1) neighbors.push({ i, j: j + 1 });
  return neighbors;
}

