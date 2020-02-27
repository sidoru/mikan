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
    return this.assortedCells.map((cells, index) => ({
      box: this.assortedBoxCells[index].occupies.length,
      total: cells.occupies.length
    }));
  }

  // スケジュールデータ適用
  applySchedule(schedule) {
    this.schedule = schedule;

    // ラウンド毎に配置適用
    const applyCells = (cells, positions, round) => {
      cells.clear();
      if (positions === undefined) {
        return;
      }

      for (let [index, charactorId] of Object.entries(positions)) {
        const charactor = this.players.findCharactorById(charactorId);
        if (charactor != null) {
          charactor.entryRound = round;
          cells[Number(index)].charactor = charactor;
        }
      };
    }

    const rounds = schedule && schedule.positions ? schedule.positions : [[], []];
    this.players.clearCharactorAttendance();

    // 全セル全配置のデータをラウンド毎に分けて処理
    for (let i in this.assortedCells) {
      if (rounds.length <= i) {
        break;
      }

      const round = Number(i);

      const partCells = this.assortedCells[i];
      const partPositions = rounds[i].positions;
      applyCells(partCells, partPositions, round);

      const partBoxCells = this.assortedBoxCells[i];
      const partBoxPositions = rounds[i].boxPositions;
      applyCells(partBoxCells, partBoxPositions, round);
    }
  }

  // State取得 return array[roundIndex, {positions:[cellIndex , charactorId], boxPositions:[cellIndex , charactorId]}]
  getPostionInfo() {
    const rounds = [];
    this.assortedCells.forEach((partCells, roundIndex) => {

      const positions = {};
      partCells.forEach((cell, index) => {
        if (!cell.isVacant) {
          positions[String(index)] = cell.charactor.Id;
        }
      });

      const partBoxCells = this.assortedBoxCells[roundIndex];
      const boxPositions = {};
      partBoxCells.forEach((cell, index) => {
        if (!cell.isVacant) {
          boxPositions[String(index)] = cell.charactor.Id;
        }
      });

      rounds.push({ positions, boxPositions });
    });

    return rounds;
  }

  isExistCharactorOtherRound(charactor) {
    return this.allCells.occupies.some(x => x.charactor == charactor)
      && !this.roundCells.occupies.some(x => x.charactor == charactor);
  }

  isExistCharactor(charactor) {
    return this.allCells.occupies.some(x => x.charactor == charactor);
  }

  // キャラ入場  場所は適当に決まる
  entryCharactor(charactor) {
    if (this.isExistCharactor(charactor)) {
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
  exitCharactor(obj) {
    let cell;
    if (obj instanceof CellModel) {
      cell = obj;
    } else if (obj instanceof CharactorModel) {
      cell = this.allCells.find(x => x.charactor == obj);
    }

    if (cell !== null && cell.charactor === null) {
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
