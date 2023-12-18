import { readInputLines } from './input/read';
import { Dir, Position, posAdd, moveBy } from './lib/pos';

const input: string[] = readInputLines(18);
interface Instruction {
  dir: Dir;
  distance: number;
}
const DIR_CODES: { [code: string]: Dir } = {
  '0': 'R', '1': 'D', '2': 'L', '3': 'U'
};
function readInstruction(line: string): Instruction {
  const { dist, dir } = line.match(/#(?<dist>[a-f0-9]{5})(?<dir>\d)/).groups;
  return { dir: DIR_CODES[dir], distance: parseInt(dist, 16) };
}

const CORNERS: { [corner: string]: Position[] } = {
  'RD': [{ x:  0.5, y: -0.5 }, { x: -0.5, y:  0.5 }],
  'RU': [{ x: -0.5, y: -0.5 }, { x:  0.5, y:  0.5 }],
  'LD': [{ x:  0.5, y:  0.5 }, { x: -0.5, y: -0.5 }],
  'LU': [{ x: -0.5, y:  0.5 }, { x:  0.5, y: -0.5 }],
  'DR': [{ x:  0.5, y: -0.5 }, { x: -0.5, y:  0.5 }],
  'DL': [{ x:  0.5, y:  0.5 }, { x: -0.5, y: -0.5 }],
  'UR': [{ x: -0.5, y: -0.5 }, { x:  0.5, y:  0.5 }],
  'UL': [{ x: -0.5, y:  0.5 }, { x:  0.5, y: -0.5 }],
};

const instructions = input.map(readInstruction);

function leftAndRightLoops(instructions: Instruction[]): Position[][] {
  const firstCorner = instructions[instructions.length - 1].dir + instructions[0].dir;
  const loops: Position[][] = [
    [CORNERS[firstCorner][0]],
    [CORNERS[firstCorner][1]]
  ];

  let cursor: Position = { x: 0, y: 0 };
  for (let i = 0; i < instructions.length; ++i) {
    const { dir, distance } = instructions[i];
    cursor = moveBy(cursor, dir, distance);
    const [ left, right ] = CORNERS[dir + instructions[(i + 1) % instructions.length].dir];
    loops[0].push(posAdd(cursor, left));
    loops[1].push(posAdd(cursor, right));
  }

  return loops;
}

function area(loop: Position[]): number {
  let area: number = 0;

  const l = loop.length;
  for (let i = 1; i <= l; ++i) {
    area += loop[i % l].x * (loop[(i + 1) % l].y - loop[i - 1].y)
  }

  return area / 2;
}

const [ left, right ] = leftAndRightLoops(instructions);
console.log(Math.max(...leftAndRightLoops(instructions).map(area)));
