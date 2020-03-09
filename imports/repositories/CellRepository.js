
import { CellModel, CellRole, CellArray, CellType } from '../model/models';

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
      const cell = new CellModel(CellType.POSITION_CELL);
      cells.push(cell);
      if (blockCells.indexOf(i) > -1) {
        cell.cellRole = CellRole.BLOCK;
      }
      if (targetCells.indexOf(i) > -1) {
        cell.cellRole = CellRole.TARGET;
      }
      if (oneCellCells.indexOf(i) > -1) {
        cell.cellRole = CellRole.ONE_CELL;
      }
      if (twoCellCells.indexOf(i) > -1) {
        cell.cellRole = CellRole.TWO_CELL;
      }
      if (spporterCells.indexOf(i) > -1) {
        cell.cellRole = CellRole.SUPPORTER;
      }
      if (dancerCells.indexOf(i) > -1) {
        cell.cellRole = CellRole.DANCER;
      }
    }

    return cells;
  }

  getBoxCells() {
    const cells = new CellArray();
    for (let cell of [...Array(8).keys()].map(x => new CellModel(CellType.BOX_CELL))) {
      cells.push(cell);
    }

    return cells;
  }

  getPartyCells() {
    const cells = new CellArray();
    for (let cell of [...Array(16).keys()].map(x => new CellModel(CellType.PARTY_CELL))) {
      cells.push(cell);
    }

    return cells;
  }
};