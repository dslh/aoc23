export type Dir = 'U' | 'D' | 'L' | 'R';

export interface Position {
  x: number;
  y: number;
}

export function posAdd(a: Position, b: Position): Position {
  return { x: a.x + b.x, y: a.y + b.y };
}
export function posMul({ x, y }: Position, factor: number): Position {
  return { x: x * factor, y: y * factor };
}

const DIR_TO_POS: { [dir: string]: Position } = {
  'U': { x: 0, y: -1 },
  'D': { x: 0, y:  1 },
  'L': { x: -1, y: 0 },
  'R': { x:  1, y: 0 },
};

export function move(pos: Position, dir: Dir): Position {
  return posAdd(pos, DIR_TO_POS[dir]);
}

export function moveBy(pos: Position, dir: Dir, distance: number): Position {
  return posAdd(pos, posMul(DIR_TO_POS[dir], distance));
}

export function adjacent({ x, y }: Position): Position[] {
  return [
    { x: x - 1, y },
    { x: x + 1, y },
    { x, y: y - 1 },
    { x, y: y + 1 }
  ];
}

export const REVERSE_DIR = {
  'L': 'R',
  'R': 'L',
  'U': 'D',
  'D': 'U'
};

export function posEq(a: Position, b: Position): boolean {
  return a.x === b.x && a.y === b.y;
}
