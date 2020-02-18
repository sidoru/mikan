import PlayerRepository from '../repositories/PlayerRepository';
import CellRepository from '../repositories/CellRepository';
import { PositionBinder, Charactor, Cell, CellArray, CellType } from '../model/models';

// 配置作成する画面のモデルに該当
export default class {
  constructor(onChanged) {
    this.onChanged = onChanged ? onChanged : () => { };

    const cellRepository = new CellRepository();

    // ラウンド毎のセル
    this.assortedCells = [cellRepository.getCells(), cellRepository.getCells()];

    // 全セル
    this.cells = new CellArray();
    for (let cell of this.assortedCells.reduce((x, y) => x.concat(y), [])) {
      this.cells.push(cell);
    }

    const playerPepos = new PlayerRepository();
    this.players = playerPepos.getPlayers();

    this.schedule = null;
  }

  get executionDate() { return this.schedule ? this.schedule.executionDate : null; }
  get scheduleName() { return this.schedule ? this.schedule.name : null; }
  get actorCounts() { 
    return this.assortedCells.map(cells=>{
      box: cells.occupies.filter(c => c.charactor.canBox).length 
      total: cells.occupies.length 
    });
  }

  // スケジュールデータ適用
  applySchedule(schedule) {
    this.schedule = schedule;

    // ラウンド毎に配置適用
    const applyCells = (cellArray, positions, round) => {
      cellArray.clear();

      for (let [index, charactorId] of Object.entries(positions)) {
        const charactor = this.players.findCharactorById(charactorId);
        if (charactor == null) {
          continue;
        }

        charactor.entryRound = round;
        cellArray[index].charactor = charactor;
      }
    }

    const assortedPositions = schedule.positions ? schedule.positions : [[], []];
    this.players.clearCharactorAttendance();

    // 全セル全配置のデータをラウンド毎に分けて処理
    for (let i in this.assortedCells) {
      if (assortedPositions.length <= i) {
        break;
      }

      const partCells = this.assortedCells[i];
      const partPositions = assortedPositions[i];
      const round = Number(i) + 1;
      applyCells(partCells, partPositions, round);
    }
  }

  // State取得 return array[roundIndex, [cellIndex , charactorId]]
  getPostionInfo() {
    return this.assortedCells.map(c => c.getInfo());
  }

  // キャラ入場  場所は適当に決まる
  entryCharactor(charactor, roundIndex) {
    const currentCells = this.assortedCells[roundIndex];
    if (this.cells.occupies.some(x => x.charactor.Id == charactor.Id)) {
      return false;
    }

    let cell = currentCells.vacants.find(x => x.cellType == charactor.cellType);
    if (cell == null) {
      cell = currentCells.vacants.find(x => x);
    }

    if (cell != null) {
      cell.charactor = charactor;
      return true;
    }

    return false;
  }

  // キャラ退場
  exitCharactor(charactor) {
    const existedCell = this.cells.find(x => x.charactor === charactor);
    if (existedCell == null) {
      return false;
    }

    existedCell.clear();
    return true;
  }

  // キャラをセルに割当て
  allocateCharactor(charactor, cell) {
    this.exitCharactor(charactor);
    cell.charactor = charactor;
    return true;
  }

  // セル入れ替え
  swapCell(srcCell, dstCell) {
    // 両方のセルが空っぽでも何もしなくて良い
    if (srcCell == dstCell || srcCell.charactor == dstCell.charactor) {
      return false;
    }

    srcCell.swap(dstCell);

    return true;
  }
}