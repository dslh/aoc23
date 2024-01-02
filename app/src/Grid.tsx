// Define the enumeration for grid square values
export enum GridValue {
  Empty = "empty",
  Wall = "wall",
  Even = "even",
  Odd = "odd",
}

const CELL = 4;

// Define the props for the Grid component
interface GridProps {
  gridData: GridValue[][];
}

// Define the Grid component
const Grid: React.FC<GridProps> = ({ gridData }) => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {gridData.map((row, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex' }}>
          {row.map((cell, cellIndex) => (
            <div key={cellIndex} style={getStyleForGridValue(cell)} />
          ))}
        </div>
      ))}
    </div>
  );
};

// Helper function to determine the style based on the grid value
function getStyleForGridValue(value: GridValue): React.CSSProperties {
  switch (value) {
    case GridValue.Empty:
      return { width: CELL, height: CELL, border: '1px solid rgba(0.5, 0.5, 0.5, 0.1)' };
    case GridValue.Wall:
      return { width: CELL, height: CELL, backgroundColor: 'black', border: '1px solid black' };
    case GridValue.Even:
      return { width: CELL, height: CELL, backgroundColor: 'green' };
    case GridValue.Odd:
      return { width: CELL, height: CELL, backgroundColor: 'red' };
    default:
      return { width: CELL, height: CELL };
  }
}

export default Grid;

