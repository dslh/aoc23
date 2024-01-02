import { useState } from 'react'
import './App.css'

import GridVisualization from './GridVisualization'
import Input from './input/21.text'
import Test from './input/21.test'

import { toGrid, findStart, shortestPaths } from './lib/21'

function App() {
  const grid = toGrid(Input);
  const start = findStart(Input);

  const { distances, tree } = shortestPaths(grid, start);
  console.log(Test);
  console.log(grid);

  return (
    <>
      <GridVisualization grid={grid} start={start} distances={distances} tree={tree} />
    </>
  )
}

export default App
