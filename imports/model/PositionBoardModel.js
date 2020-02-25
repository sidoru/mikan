import PlayerRepository from '../repositories/PlayerRepository';
import CellRepository from '../repositories/CellRepository';
import { PositionBinder, CharactorModel, CellModel, CellArray, CellType } from '../model/models';

// 配置作成する画面のモデルに該当
export default class {
  constructor() {
    const cellRepository = new CellRepository();

    // ラウンド毎のセル
    this.assortedCells = [cellRepository.getCells(), cellRepository.getCells()];
    this.assortedBoxCells = [cellRepository.getBoxCells(), cellRepository.getBoxCells()];

    // 全セル
    this.allCells = new CellArray();
    for (let cell of this.assortedCells.reduce((x, y) => [...x, ...y], [])) {
      this.allCells.push(cell);
    }

    const playerPepos = new PlayerRepository();
    this.players = playerPepos.getPlayers();

    this.round = 0;
    this.schedule = null;
  }

  get roundCells() { return this.assortedCells[this.round]; }
  get roundBoxCells() { return this.assortedBoxCells[this.round]; }

  // セルかキャラからラウンドセル取得
  getRoundCells = obj => this.assortedCells.find(x => x.some(x => x === obj || x.charactor === obj));
  getRoundBoxCells = obj => this.assortedBoxCells.find(x => x.some(x => x === obj || x.charactor === obj));
  isBoxCell = cell => !this.allCells.some(x => x === cell);

  getEntryCounts() {
    return this.assortedCells.map((cells,index) => ({
      box: this.assortedBoxCells[index].occupies.length,
      total: cells.occupies.length
    }));
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
  entryCharactor(charactor) {
    if (this.allCells.occupies.some(x => x.charactor.Id == charactor.Id)) {
      return false;
    }

    let cell = this.roundCells.vacants.find(x => x.cellType == charactor.cellType);
    if (cell == null) {
      cell = this.roundCells.vacants.find(x => x);
    }

    if (cell != null) {
      cell.charactor = charactor;
      this.entryBoxCharactor(charactor);
      return true;
    }

    return false;
  }

  // キャラ退場
  exitCharactor(cell) {
    if (cell.charactor === null) {
      return false;
    }

    if (!this.isBoxCell(cell)) {
      this.removeBoxCharactor(cell.charactor);
    }

    cell.clear();

    return true;
  }

  // キャラをセルに割当て
  allocateCharactor(charactor, cell) {
    if (this.roundBoxCells.some(x => x == cell)) {
      this.allocateBoxCharactor(charactor, cell);
    } else {
      this.removeCharactor(charactor);
      cell.charactor = charactor;
      this.entryBoxCharactor(charactor);
    }

    return true;
  }

  // セル移動
  swapCell(srcCell, dstCell) {
    // 両方のセルが空っぽまたは変わってない場合は何もしなくて良い
    if (srcCell === dstCell || srcCell.charactor === dstCell.charactor) {
      return false;
    }

    const isSrcBox = this.isBoxCell(srcCell);
    const isDstBox = this.isBoxCell(dstCell);
    
    if (isSrcBox === isDstBox) {
      srcCell.swap(dstCell);
    } else if (srcCell.charactor) {
      if (isSrcBox) {
        // BOX -> 配置
        this.allocateCharactor(srcCell.charactor, dstCell);
      } else {
        // 配置 -> BOX
        this.allocateBoxCharactor(srcCell.charactor, dstCell)
      }
    }

    return true;
  }

  // キャラ削除
  removeCharactor(charactor) {
    const existedCell = this.allCells.find(x => x.charactor === charactor);
    if (existedCell == null) {
      return false;
    }

    existedCell.clear();

    return true;
  }

  // キャラをBOXセルに割当て
  allocateBoxCharactor(charactor, cell) {
    const existedCell = this.roundBoxCells.find(x => x.charactor == charactor)
    if (existedCell != null) {
      existedCell.swap(cell);
    } else {
      cell.charactor = charactor;
    }
  }

  // BOX可でBOXに入ってなかったら突っ込む
  entryBoxCharactor(charactor) {
    if (charactor.canBox && !this.roundBoxCells.some(x => x.charactor == charactor)) {
      const cell = this.roundBoxCells.find(x => x.isVacant);
      if (cell != null) {
        cell.charactor = charactor;
      }
    }
  }

  // BOXに入ってたら削除
  removeBoxCharactor(charactor) {
    const cells = this.getRoundBoxCells(charactor);
    if (cells != null) {
      const existedBoxCell = cells.find(x => x.charactor == charactor);
      existedBoxCell.clear();
    }
  }
}
