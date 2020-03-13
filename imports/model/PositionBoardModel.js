import PlayerRepository from '../repositories/PlayerRepository';
import CellRepository from '../repositories/CellRepository';
import { CharactorModel, CellModel, CellArray, CellType } from '../model/models';

// 配置作成する画面のモデルに該当
export default class {
  constructor() {
    const cellRepository = new CellRepository();

    // ラウンド毎のセル
    this.assortedCells = [cellRepository.getCells(), cellRepository.getCells()];
    this.assortedBoxCells = [cellRepository.getBoxCells(), cellRepository.getBoxCells()];
    this.assortedPartyCells = [cellRepository.getPartyCells(), cellRepository.getPartyCells()];

    // 全セル
    this.allCells = new CellArray();
    for (let cell of this.assortedCells.reduce((x, y) => [...x, ...y], [])) {
      this.allCells.push(cell);
    }

    const playerPepos = new PlayerRepository();
    this.players = playerPepos.getPlayers();

    this.round = 0;
  }

  get roundCells() { return this.assortedCells[this.round]; }
  get roundBoxCells() { return this.assortedBoxCells[this.round]; }
  get roundPartyCells() { return this.assortedPartyCells[this.round]; }

  getEntryCounts() {
    return this.assortedCells.map((cells, index) => ({
      box: this.assortedBoxCells[index].occupies.length,
      total: cells.occupies.length
    }));
  }

  // スケジュールデータ適用
  apply(positions) {
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

    const rounds = positions ? positions : [[], []];
    this.players.clearCharactorAttendance();

    // 全セル全配置のデータをラウンド毎に分けて処理
    for (let round of [0, 1]) {
      if (rounds.length <= round) {
        break;
      }

      applyCells(this.assortedCells[round], rounds[round].positions, round);
      applyCells(this.assortedBoxCells[round], rounds[round].boxPositions, round);
      applyCells(this.assortedPartyCells[round], rounds[round].partyPositions, round);
    }
  }

  // State取得 return array[roundIndex, {positions:[cellIndex , charactorId], boxPositions:[cellIndex , charactorId]}]
  getPostions() {
    const createIndexData = cells => {
      const roundCells = cells;
      const positions = {};
      roundCells.forEach((cell, index) => {
        if (!cell.isVacant) {
          positions[String(index)] = cell.charactor.Id;
        }
      });

      return positions;
    }

    const rounds = [];
    for (let round of [0, 1]) {
      const positions = createIndexData(this.assortedCells[round]);
      const boxPositions = createIndexData(this.assortedBoxCells[round]);
      const partyPositions = createIndexData(this.assortedPartyCells[round]);
      rounds.push({ positions, boxPositions, partyPositions });
    }

    return rounds;
  }

  // 1回目と2回目入れ替え
  swapRound() {
    const positions = this.getPostions();
    this.apply(positions);
    console.log(positions);
  }

  isExistCharactorOtherRound(charactor) {
    return this.allCells.occupies.some(x => x.charactor == charactor)
      && !this.roundCells.occupies.some(x => x.charactor == charactor);
  }

  isExistCharactor(charactor) {
    return this.allCells.occupies.some(x => x.charactor == charactor);
  }

  isExistAccount(charactor) {
    return this.allCells.occupies.some(x => x.charactor !== charactor && x.charactor.accountId !== "" && x.charactor.accountId == charactor.accountId);
  }

  // キャラ入場  場所は適当に決まる
  entryCharactor(charactor) {
    if (this.isExistCharactor(charactor)) {
      return false;
    }

    const cell = this.roundCells.vacants.find(x => x.cellRole == charactor.cellRole)
              || this.roundCells.vacants.find(x => x);
    if (cell != null) {
      cell.charactor = charactor;
      this.entryBoxCharactor(charactor);
      this.entryPartyCharactor(charactor);
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

    if (cell !== null && cell.charactor == null) {
      return false;
    }

    if (cell.cellType === CellType.POSITION_CELL) {
      this.removeCharactor(this.roundBoxCells, cell.charactor);
      this.removeCharactor(this.roundPartyCells, cell.charactor);
    }

    cell.clear();

    return true;
  }

  // セルからそのセルの含まれるリスト判定
  determinCells(cell) {
    return cell.cellType === CellType.POSITION_CELL ? this.allCells
      : cell.cellType === CellType.BOX_CELL ? this.roundBoxCells
        : this.roundPartyCells;
  }

  // キャラをセルに割当て
  allocate(charactor, cell) {
    const cells = this.determinCells(cell);

    const existedCell = cells.find(x => x.charactor == charactor)
    if (existedCell != null) {
      existedCell.swap(cell);
    } else {
      cell.charactor = charactor;
    }

    return true;
  }

  // セル移動
  swapCell(srcCell, dstCell) {
    // 両方のセルが空っぽまたは変わってない場合は何もしなくて良い
    if (srcCell === dstCell || srcCell.charactor === dstCell.charactor) {
      return false;
    }

    if (srcCell.cellType === dstCell.cellType) {
      srcCell.swap(dstCell);
    } else if (srcCell.charactor) {
      this.allocate(srcCell.charactor, dstCell);
    }

    return true;
  }

  // BOX可でBOXに入ってなかったら突っ込む
  entryBoxCharactor(charactor) {
    if (charactor.canBox && !this.roundBoxCells.some(x => x.charactor === charactor)) {
      const cell = this.roundBoxCells.find(x => x.isVacant);
      if (cell != null) {
        cell.charactor = charactor;
      }
    }
  }

  // PTに入ってなかったら突っ込む
  entryPartyCharactor(charactor) {
    if (!this.roundPartyCells.some(x => x.charactor === charactor)) {
      const cell = this.roundPartyCells.find(x => x.isVacant);
      if (cell != null) {
        cell.charactor = charactor;
      }
    }
  }

  // 入ってたら削除
  removeCharactor(cells, charactor) {
    const existedBoxCell = cells.find(x => x.charactor == charactor);
    if (existedBoxCell != null) {
      existedBoxCell.clear();
      return true;
    }

    return false;
  }
}
