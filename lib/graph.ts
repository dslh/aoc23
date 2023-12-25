import { sum, max } from './iter';

export interface Edge {
  weight: number;
  dest: string;
}

export type Graph = { [vert: string]: Edge[] };

export interface Path {
  start: string;
  edges: Edge[];
  weight: number;
}

export function allPaths(graph: Graph, start: string, end: string): Path[] {
  const paths: Path[] = [];

  const path: Edge[] = [];
  const visited = new Set<string>();

  const search = (vertex: string) => {
    if (visited.has(vertex)) return;

    if (vertex === end) {
      paths.push({ start, edges: [...path], weight: sum(path, e => e.weight) });
      return;
    }

    visited.add(vertex);

    for (const edge of graph[vertex]) {
      path.push(edge);
      search(edge.dest);
      path.pop();
    }

    visited.delete(vertex);
  };

  search(start);

  return paths;
}

export function longestPath(graph: Graph, start: string, end: string): Path {
  return max(allPaths(graph, start, end), path => path.weight);
}

export function bidirectional(other: Graph): Graph {
  const graph: Graph = {};

  for (const [vert, edges] of Object.entries(other)) {
    graph[vert] ||= [];
    for (const edge of edges) {
      graph[vert].push(edge);
      (graph[edge.dest] ||= []).push({ weight: edge.weight, dest: vert });
    }
  }

  return graph;
}
