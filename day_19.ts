import { readInputChunks } from './input/read';

const [flows, partsStr] = readInputChunks(19);

interface Part {
  x: number;
  m: number;
  a: number;
  s: number;
}

function parsePart(line: string): Part {
  const part = {};

  line.match(/[xmas]=\d+/g).forEach(match => {
    const [category, value] = match.split('=');
    part[category] = parseInt(value);
  });

  return <Part>part;
}
const parts: Part[] = partsStr.map(parsePart);

function partScore(part: Part) {
  return Object.values(part).reduce((acc, n) => acc + n);
}

type Rule = (part: Part) => string | undefined;
interface Workflow {
  name: string;
  rules: Rule[];
  exec: (part: Part) => string;
}

function operator(op: string, cmp: number): (value: number) => boolean {
  if (op === '>')
    return (value: number) => value > cmp;
  else
    return (value: number) => value < cmp;
}

function parseWorkflow(line: string): Workflow {
  const { name, spec } = line.match(/(?<name>[a-z]+)\{(?<spec>.+)\}/).groups;

  const rules: Rule[] = spec.split(',').map(str => {
    if (str.match(/^[a-z]+$/i))
      return () => str;

    const { cat, opSym, value, out } = str.match(
      /(?<cat>[xmas])(?<opSym>[><])(?<value>\d+):(?<out>[a-z]+)/i
    ).groups;
    const op = operator(opSym, parseInt(value));
    return (part: Part): string | undefined => {
      if (op(part[cat])) return out;
    }
  });

  const exec = (part: Part): string => {
    for (const rule of rules) {
      const out = rule(part);
      if (out) return out;
    }
    throw 'Exit not found';
  }

  return { name, rules, exec };
}

class System {
  workflows: { [name: string]: Workflow } = {};

  constructor(input: string[]) {
    input.map(parseWorkflow).forEach(workflow => {
      this.workflows[workflow.name] = workflow;
    });
  }

  accept(part: Part): boolean {
    let workflow = this.workflows.in;
    while(true) {
      const out = workflow.exec(part);
      if (out === 'A') return true;
      if (out === 'R') return false;
      workflow = this.workflows[out];
    }
  }
}
const system = new System(flows);

console.log('Part 1:');
console.log(parts.filter(part => system.accept(part)).map(partScore).reduce((acc, n) => acc + n));
