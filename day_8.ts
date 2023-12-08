import { readInputLines } from './input/read';
const lcm = require('compute-lcm');

const input: string[] = readInputLines(8);

const instructions = input[0].toLowerCase();

interface Node {
  name: string;
  left: string;
  right: string;

  l?: Node;
  r?: Node;
}

const NODE_RE = /([A-Z0-9]{3}) = \(([A-Z0-9]{3}), ([A-Z0-9]{3})\)/
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

type DonePredicate = (n: Node) => boolean;
function navigate(
  nodes: Node[], instructions: string, start: Node, done: DonePredicate
): number {
  let current = start;
  let steps = 0;

  for (let i = 0; !done(current); ++steps, i = (i + 1) % instructions.length)
    current = current[instructions[i]];

  console.log(current.name);
  return steps;
}

// Takes too long
function ghostNav(nodes: Node[], instructions: string): number {
  let current = nodes.filter(({ name }) => name.endsWith('A'));
  let steps = 0;

  for (let i = 0; !current.every(({ name }) => name.endsWith('Z')); ++steps, i = (i + 1) % instructions.length) {
    current = current.map(node => node[instructions[i]]);
  }

  return steps;
}

console.log('Part 1:');
const aaa = nodes.find(({ name }) => name === 'AAA');
const isZzz = ({ name }: Node) => name === 'ZZZ';
console.log(navigate(nodes, instructions, aaa, isZzz));

console.log('Part 2:');
const ghostStarts = nodes.filter(({ name }) => name.endsWith('A'));
const ghostDone = ({ name }: Node) => name.endsWith('Z');
const ghostDistances = ghostStarts.map(node => navigate(nodes, instructions, node, ghostDone));
console.log(lcm(...ghostDistances));
