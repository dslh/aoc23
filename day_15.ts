import readInput from './input/read';

const instructions: string[] = readInput(15).split(',');

function hash(str: string): number {
  let hash = 0;

  for (let i = 0; i < str.length; ++i)
    hash = ((hash + str.charCodeAt(i)) * 17) % 256;

  return hash;
}

console.log('Part 1:');
console.log(instructions.map(hash).reduce((acc, n) => acc + n));

type LensBox = { [label: string]: number };
class Boxes {
  boxes: LensBox[] = Array(256).fill(null).map(() => ({}));

  op(op: string) {
    if (op.endsWith('-'))
      this.removeLens(op.slice(0, op.length - 1));
    else {
      const [label, focalLength] = op.split('=', 2);
      this.insertLens(label, parseInt(focalLength));
    }
  }

  removeLens(label: string) {
    delete this.boxes[hash(label)][label];
  }

  insertLens(label: string, focalLength: number) {
    this.boxes[hash(label)][label] = focalLength;
  }

  boxPower(box: LensBox): number {
    return Object.values(box)
                 .map((focalLength, i) => focalLength * (i + 1))
                 .reduce((acc, n) => acc + n, 0);
  }

  focusingPower(): number {
    return this.boxes.map((box, i) => (i + 1) * this.boxPower(box))
                     .reduce((acc, n) => acc + n);
  }
}

console.log('Part 2:');
const boxes = new Boxes();
instructions.forEach(op => boxes.op(op));
console.log(boxes.boxes);
console.log(boxes.focusingPower());
