import { readInputLines } from './input/read';
import { sample, eachConsPair } from './lib/iter';
import Queue from './lib/queue';

const input = readInputLines(25);

type Edge = [string, string];
type Connections = { [component: string]: string[] };
interface Wiring {
  components: Set<string>;
  connections: Connections;
  edges: Edge[];
}

function parseWiring(input: string[]): Wiring {
  const components = new Set<string>();
  const connections = {};
  const edges = [];

  for (const line of input) {
    const [component, connecteds] = line.split(': ');
    components.add(component);

    for (const connected of connecteds.split(' ')) {
      components.add(connected);
      (connections[component] ||= []).push(connected);
      (connections[connected] ||= []).push(component);
      edges.push([component, connected].sort());
    }
  }

  return { components, connections, edges };
}

function cutWires(connections: Connections, edges: Edge[]): Connections {
  const cut = {};

  for (const [component, connecteds] of Object.entries(connections)) {
    cut[component] = connecteds.filter(connected => (
      !edges.some(([a, b]) => (a === component && b === connected) || (b === component && a == connected))
    ));
  }

  return cut;
}

function cluster(connections: Connections, start: string): Set<string> {
  const connected = new Set<string>();
  const neighbours: string[] = [];

  connected.add(start);
  neighbours.push(...connections[start]);
  while (neighbours.length) {
    const next = neighbours.pop();
    if (connected.has(next)) continue;

    connected.add(next);
    neighbours.push(...connections[next]);
  }

  return connected;
}

function clusters(connections: Connections): Set<string>[] {
  let remainder = new Set<string>(Object.keys(connections));
  const clusters = [];

  while (remainder.size) {
    const next = cluster(connections, remainder.values().next().value);
    clusters.push(next);
    for (const component of next.values())
      remainder.delete(component);
  }

  return clusters;
}

function clusterCounts(connections: Connections): number[] {
  return clusters(connections).map(cluster => cluster.size);
}

function path(connections: Connections, start: string, end: string): string[] {
  const visited = new Set<string>();
  const prev = new Map<string, string>();
  const queue = new Queue<string>();

  queue.push(start);
  visited.add(start);
  while (!queue.empty) {
    const current = queue.pop();
    if (current === end) break;

    for (const next of connections[current]) {
      if (visited.has(next)) continue;

      prev.set(next, current);
      visited.add(next);
      queue.push(next);
    }
  }

  const path = [end];
  let current = end;
  while (prev.has(current)) {
    current = prev.get(current);
    path.push(current);
  }

  return path;
}

function toEdges(path: string[]): string[] {
  const edges = [];

  eachConsPair(path, (a, b) => { edges.push([a, b].sort().join('|')) });

  return edges;
}

function sampleEdgeFrequencies(connections: Connections, iterations: number): { [edge: string]: number } {
  const frequencies = {};

  const components = [...Object.keys(connections)];
  for (let i = 0; i < iterations; ++i) {
    const a = sample(components);
    const b = sample(components);
    if (a === b) continue;

    for (const edge of toEdges(path(connections, a, b))) {
      frequencies[edge] ||= 0;
      frequencies[edge] += 1;
    }
  }

  return frequencies;
}

function cutValue(connections: Connections): number {
  const frequencies = sampleEdgeFrequencies(connections, 1000);
  const edges = [...Object.keys(frequencies)]
    .sort((a, b) => frequencies[b] - frequencies[a])
    .slice(0, 3)
    .map(edge => edge.split('|'));

  const cut = cutWires(connections, edges);
  const [a, b] = clusterCounts(cut);

  return a * b;
}

const wiring = parseWiring(input);
console.log('Part 1:');
console.log(cutValue(wiring.connections));
