import { Position } from './pos';

export interface Grid<T> {
  getAt: (pos: Position) => T | undefined;
  setAt: (pos: Position, value: T) => void;
}
export function createGrid<T>(): Grid<T> {
  const grid: T[][] = [];

  return {
    getAt({ x, y }: Position): T | undefined {
      if (!grid[y]) return;

      return grid[y][x];
    },

    setAt({ x, y }: Position, value: T) {
      (grid[y] ||= [])[x] = value;
    }
  };
}

