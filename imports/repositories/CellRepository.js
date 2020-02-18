
import { Cell, CellType, CellArray } from '../model/models';

export default class {
  getCells() {
    const blockCells = [64, 73, 74, 82, 83, 84, 85, 91, 92, 93, 94, 101, 102, 103, 104, 111, 112, 113];
    const targetCells = [65];
    const oneCellCells = [52, 61, 62];
    const twoCellCells = [33, 53, 60, 80, 81, 90];
    const spporterCells = [16, 23, 32, 33, 41, 54];
    const dancerCells = [43, 44];

    const cells = new CellArray();
    for (let i = 0; i < 114; i++) {
      const cell = new Cell();
      cells.push(cell);
      if (blockCells.indexOf(i) > -1) {
        cell.cellType = CellType.BLOCK;
      }
      if (targetCells.indexOf(i) > -1) {
        cell.cellType = CellType.TARGET;
      }
      if (oneCellCells.indexOf(i) > -1) {
        cell.cellType = CellType.ONE_CELL;
      }
      if (twoCellCells.indexOf(i) > -1) {
        cell.cellType = CellType.TWO_CELL;
      }
      if (spporterCells.indexOf(i) > -1) {
        cell.cellType = CellType.SUPPORTER;
      }
      if (dancerCells.indexOf(i) > -1) {
        cell.cellType = CellType.DANCER;
      }
    }

    return cells;
  }
};