import { readInputLines } from './input/read';

const input: string[] = readInputLines(8);

const instructions = input[0].toLowerCase();

interface Node {
  name: string;
  left: string;
  right: string;

  l?: Node;
  r?: Node;
}

const NODE_RE = /([A-Z]{3}) = \(([A-Z]{3}), ([A-Z]{3})\)/
function parseNode(line: string): Node {
  const [, name, left, right] = line.match(NODE_RE);

  return { name, left, right };
}

function parseTree(input: string[]): Node[] {
  const nodes: Node[] = input.map(parseNode);
  const nodeMap: { [name: string]: Node } = {};

  for (const node of nodes)
    nodeMap[node.name] = node;

  for (const node of nodes) {
    node.l = nodeMap[node.left];
    node.r = nodeMap[node.right];
  }

  return nodes;
}

const nodes: Node[] = parseTree(input.slice(2));

function fromAaaToZzz(nodes: Node[], instructions: string): number {
  let current = nodes.find(({ name }) => name === 'AAA');
  let steps = 0;

  for (let i = 0; current.name !== 'ZZZ'; ++steps, i = (i + 1) % instructions.length)
    current = current[instructions[i]];

  return steps;
}

console.log('Part 1:');
console.log(fromAaaToZzz(nodes, instructions));
