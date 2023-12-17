import { readInputLines } from './input/read';

interface Photon {
  x: number;
  y: number;
  dX: number;
  dY: number;
}
function advancePhoton({ x, y, dX, dY }: Photon): Photon {
  return { dX, dY, x: x + dX, y: y + dY };
}
function photonString({ x, y, dX, dY }: Photon): string {
  return `${x},${y},${dX},${dY}`;
}

type Apparatus = (photon: Photon, out: Photon[]) => void;
const APPARATI: { [pictogram: string]: Apparatus } = {
  '.': (photon: Photon, out: Photon[]) => { out.push(photon); },
  '|': (photon: Photon, out: Photon[]) => {
    if (photon.dX) {
      out.push({ ...photon, dX: 0, dY: -1 });
      out.push({ ...photon, dX: 0, dY:  1 });
    } else {
      out.push(photon);
    }
  },
  '-': (photon: Photon, out: Photon[]) => {
    if (photon.dY) {
      out.push({ ...photon, dX: -1, dY: 0 });
      out.push({ ...photon, dX:  1, dY: 0 });
    } else {
      out.push(photon);
    }
  },
  '/': ({ x, y, dX, dY }: Photon, out: Photon[]) => {
    out.push({ x, y, dX: -dY, dY: -dX });
  },
  '\\': ({ x, y, dX, dY }: Photon, out: Photon[]) => {
    out.push({ x, y, dX: dY, dY: dX });
  }
}

class Contraption {
  photons: Photon[] = [{ x: -1, y: 0, dX: 1, dY: 0 }];
  grid: Apparatus[][];
  width: number;
  height: number;
  visits: number[][];
  seen: { [photonStr: string]: boolean } = {};

  constructor(input: string[]) {
    this.grid = input.map(line => line.split('').map(c => APPARATI[c]));

    this.width = input[0].length;
    this.height = input.length;
    this.visits = Array(this.height).fill(null).map(() => Array(this.width).fill(0));
  }

  visit(photons: Photon[]) {
    photons.forEach(photon => this.seen[photonString(photon)] = true);
    photons.forEach(({ x, y }) => this.visits[y][x] += 1);
  }

  visited(): number {
    return this.visits.map(row => row.filter(n => n).length)
                      .reduce((acc, n) => acc + n);
  }

  advance() {
    const moved = this.photons.map(advancePhoton).filter(
      ({ x, y }) => (x >= 0 && x < this.width && y >= 0 && y < this.height)
    ).filter(photon => !this.seen[photonString(photon)]);
    this.visit(moved);
    this.photons = [];
    moved.forEach(photon => this.grid[photon.y][photon.x](photon, this.photons));
  }

  run() {
    while (this.photons.length)
      this.advance();
  }
}

console.log('Part 1:');
const contraption = new Contraption(readInputLines(16));
contraption.run();
console.log(contraption.visited());
