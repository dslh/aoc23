import { useState, useEffect } from 'react';
import { Position } from './lib/21'

interface GridProps {
  grid: boolean[][];
  start: Position;
  distances: number[][];
  tree: (Position | null)[][];
}

interface Position {
  i: number;
  j: number;
}

const GridVisualization: React.FC<GridProps> = ({ grid, start, distances, tree }) => {
  const rows = grid.length;
  const cols = grid[0].length;
  const cellSize = 6; // Size of each cell in the grid

  const renderCell = (i: number, j: number) => {
    const isWall = grid[i][j] || distances[i][j] === Infinity;
    const isStart = i === start.i && j === start.j;
    const isOddDistance = distances[i][j] % 2 !== 0;

    let fill = isWall ? '#221D23' : isOddDistance ? '#DDB967' : '#D0E37F';
    if (isStart) fill = '#D1603D';

    return <rect key={`${i}-${j}`} x={j * cellSize} y={i * cellSize} width={cellSize} height={cellSize} fill={fill} />;
  };

  const renderTree = () => {
    return tree.flatMap((row, i) =>
      row.map((parent, j) => {
        if (!parent || grid[i][j]) return null;
        const x1 = parent.j * cellSize + cellSize / 2;
        const y1 = parent.i * cellSize + cellSize / 2;
        const x2 = j * cellSize + cellSize / 2;
        const y2 = i * cellSize + cellSize / 2;
        return <line key={`${i}-${j}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#4F3824" />;
      }),
    );
  };

  return (
    <svg width={cols * cellSize} height={rows * cellSize} style={{ border: '1px solid black' }}>
      {Array.from({ length: rows }, (_, i) => Array.from({ length: cols }, (_, j) => renderCell(i, j)))}
      {renderTree()}
    </svg>
  );
};

export default GridVisualization;
