import { eliminate, echelonOrder, reducedRowEchelonForm } from './gauss';

describe('echelonOrder', () => {
  test('reduced row echelon form', () => {
    const matrix = [
      [0, 0, 1, -1],
      [1, 0, 0,  2],
      [0, 1, 0,  3],
    ];

    expect(matrix.sort(echelonOrder)).toEqual([
      [1, 0, 0,  2],
      [0, 1, 0,  3],
      [0, 0, 1, -1]
    ]);
  });
});

describe('eliminate', () => {
  test('negation', () => {
    const a = [2, 1, -1, 8];
    const b = [-2, 1, 2, -3];

    eliminate(a, b, 0);

    console.log(b);
    expect(b).toEqual([0, 2, 1, 5]);
  });
});

describe('reducedRowEchelonForm', () => {
  test('wikipedia example', () => {
    const matrix = [
      [ 2,  1, -1,   8],
      [-3, -1,  2, -11],
      [-2,  1,  2,  -3]
    ];

    reducedRowEchelonForm(matrix);

    expect(matrix).toEqual([
      [1, 0, 0,  2],
      [0, 1, 0,  3],
      [0, 0, 1, -1]
    ]);
  });
});
