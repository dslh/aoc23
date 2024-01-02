import { findIndexAfter } from './iter';

type Row = number[];
type Matrix = Row[];

const nonZero = n => n;

function echelonIndex(row: Row): number {
  return row.findIndex(nonZero);
}

export function echelonOrder(a: Row, b: Row): number {
  const nonZero = n => n;
  let aI = echelonIndex(a);
  let bI = echelonIndex(b);

  while (aI !== -1 && aI === bI) {
    aI = findIndexAfter(a, aI, nonZero);
    bI = findIndexAfter(b, bI, nonZero);
  }

  if (aI === -1) return bI - aI;

  return aI - bI;
}

export function eliminate(src: Row, dest: Row, col: number) {
  if (!src[col]) throw 'Elimination with zero-valued source';
  if (!dest[col]) return;

  const factor = dest[col] / src[col];
  for (let i = 0; i < dest.length; ++i)
    dest[i] -= src[i] * factor;
}

function isEchelonForm(matrix: Matrix): boolean {
  for (let i = 0; i < matrix.length; ++i) {
    const echelon = echelonIndex(matrix[i]);
    if (echelon < i) return false;
    if (echelon > i) throw `Missing row for ${i}th value`;
  }

  return true;
}

function toEchelonForm(matrix: Matrix) {
  matrix.sort(echelonOrder);

  while (!isEchelonForm(matrix)) {
    for (let i = 1; i < matrix.length; ++i) {
      const src = matrix[i - 1];
      const dest = matrix[i];
      const echelon = echelonIndex(src);
      if (echelon === echelonIndex(dest)) {
        eliminate(src, dest, echelon);
        break;
      }
    }

    matrix.sort(echelonOrder);
  }
}

function backSubstitution(matrix: Matrix) {
  for (let i = matrix.length - 1; i >= 0; --i) {
    const src = matrix[i];
    const echelon = echelonIndex(src);
    const value = src[echelon];
    for (const j in src)
      src[j] /= value;

    for (let j = 0; j < i; j++)
      eliminate(src, matrix[j], echelon);
  }
}

function validateMatrix(matrix: Matrix) {
  for (const row of matrix)
    if (row.length !== matrix.length + 1)
      throw 'Malformed matrix';
}

export function reducedRowEchelonForm(matrix: Matrix) {
  validateMatrix(matrix);

  toEchelonForm(matrix);

  backSubstitution(matrix);
}
