import { readInputChunks } from './input/read';

const [input] = readInputChunks(19);

type Category = 'x' | 'm' | 'a' | 's';
type Operator = '>' | '<';

interface Rule {
  category: Category;
  op: Operator;
  value: number;
  out: string;
}
const RULE_RE = /(?<category>[xmas])(?<op>[><])(?<value>\d+):(?<out>[a-z]+)/i

interface Workflow {
  name: string;
  rules: Rule[];
  out: string;
}

const WORKFLOW_RE = /(?<name>[a-z]+)\{(?<spec>.+)\}/

function parseWorkflow(line: string): Workflow {
  const { name, spec } = line.match(WORKFLOW_RE).groups;

  const parts = spec.split(',');
  const out = parts.pop();
  const rules: Rule[] = parts.map(str => {
    const { category, op, value, out } = str.match(RULE_RE).groups;
    return {
      category: <Category>category,
      op: <Operator>op,
      value: parseInt(value),
      out,
    };
  });

  return { name, rules, out };
}

interface Range {
  min: number;
  max: number;
}
interface Ranges {
  x: Range;
  m: Range;
  a: Range;
  s: Range;
}

function countPermutations(ranges: Ranges): number {
  return Object.values(ranges).reduce((acc, { min, max }) => acc * (max - min + 1), 1);
}

/**
 * Split a range into two. First range is values that match the predicate,
 * second range is those that don't.
 */
function splitRange(range: Range, op: Operator, value: number): [Range | null, Range | null] {
  const { min, max } = range;
  if (op === '<') {
    if (value <= min)
      return [null, range];
    if (value > max)
      return [range, null];

    return [{ min, max: value - 1}, { min: value, max }];
  } else {
    if (value >= max)
      return [null, range];
    if (value < min)
      return [range, null];

    return [{ min: value + 1, max }, { min, max: value }];
  }
}

function splitRanges(ranges: Ranges, { category, op, value }: Rule): [Ranges | null, Ranges | null] {
  const [included, excluded] = splitRange(ranges[category], op, value);
  return [
    included ? { ...ranges, [category]: included } : null,
    excluded ? { ...ranges, [category]: excluded } : null
  ];
}

class System {
  workflows: { [name: string]: Workflow } = {};

  constructor(workflows: Workflow[]) {
    workflows.forEach(workflow => this.workflows[workflow.name] = workflow);
  }

  acceptedPermutations(name: string, ranges: Ranges): number {
    if (name === 'A') return countPermutations(ranges);
    if (name === 'R') return 0;

    const workflow = this.workflows[name];
    let count = 0;
    let remainder: Ranges = ranges;
    for (const rule of workflow.rules) {
      const [included, excluded] = splitRanges(remainder, rule);
      if (included) count += this.acceptedPermutations(rule.out, included);

      remainder = excluded;
      if (!remainder) break;
    }

    if (remainder) count += this.acceptedPermutations(workflow.out, remainder);

    return count;
  }

  allAcceptedPermutations(): number {
    const full: Ranges = {
      x: { min: 1, max: 4000 },
      m: { min: 1, max: 4000 },
      a: { min: 1, max: 4000 },
      s: { min: 1, max: 4000 }
    };

    return this.acceptedPermutations('in', full);
  }
}

const system = new System(input.map(parseWorkflow));
console.log('Part 2:');
console.log(system.allAcceptedPermutations());
