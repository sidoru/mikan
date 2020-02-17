
// 何かしらexport defaultしてたらオブジェクトリテラルをexportできた
export default dummy = {};

// セルの種類
export const CellType = {
  NONE: 0,
  ONE_CELL: 1,
  TWO_CELL: 2,
  BLOCK: 3,
  TARGET: 4,
  SUPPORTER: 5,
  DANCER: 6,
};

// リネのクラス
export const LineageClass = {
  WIZ: 1,
  KNI: 2,
  WAR: 3,
  ILL: 4,
  DE: 5,
  PRI: 6,
  DRK: 7,
  ELF_FIRE: 8,
  ELF_WIND: 9,
  ELF_WATER: 10,
  ELF_EARTH: 11,
};

// クラスデータ
export const LineageClassInfo = [
  { lineageClass: LineageClass.WIZ, shortName: "WIZ", sourceName: "WIZ" },
  { lineageClass: LineageClass.KNI, shortName: "K", sourceName: "ナイト" },
  { lineageClass: LineageClass.WAR, shortName: "戦", sourceName: "戦士" },
  { lineageClass: LineageClass.DRK, shortName: "DRK", sourceName: "DRK" },
  { lineageClass: LineageClass.DE, shortName: "DE", sourceName: "DE" },
  { lineageClass: LineageClass.PRI, shortName: "P", sourceName: "プリ" },
  { lineageClass: LineageClass.ILL, shortName: "ILL", sourceName: "ILL" },
  { lineageClass: LineageClass.ELF_FIRE, shortName: "火", sourceName: "エルフ(火)" },
  { lineageClass: LineageClass.ELF_WIND, shortName: "風", sourceName: "エルフ(風)" },
  { lineageClass: LineageClass.ELF_EARTH, shortName: "地", sourceName: "エルフ(地)" },
  { lineageClass: LineageClass.ELF_WATER, shortName: "水", sourceName: "エルフ(水)" },
];

export class Player {
  constructor(name) {
    this.name = name;
    this.charactors = [];
  }

  get Id() { return this.name; }
}

export class Charactor {
  constructor(name, lineageClass, cellType, levelIndex, canBox) {
    this.name = name;
    this.lineageClass = lineageClass;
    this.cellType = cellType;
    this.levelIndex = levelIndex;
    this.canBox = canBox;

    this.entryRound = 0;// 0は不参加
  }

  get Id() { return this.name; }
}

export class PlayerArray extends Array {
  findById = id => this.find(x => x.Id == id);
  findByCharactorName = charactorName => this.find(x => x.charactors.some(y => y.name == charactorName));
  findCharactorById = charactorId => {
    for (let p of this) {
      const charactor = p.charactors.find(c => c.Id == charactorId);
      if (charactor != undefined) {
        return charactor;
      }
    }

    return null;
  };
}

export class Cell {
  constructor() {
    this.cellType = CellType.NONE;
    this.charactor = null;
  }

  get text() { return (this.charactor == null) ? "" : this.charactor.name; }
  get isVacant() { return this.charactor == null; }

  swap = other => {
    const temp = other.charactor;
    other.charactor = this.charactor;
    this.charactor = temp;
  };
  clear = () => this.charactor = null;
}

export class CellArray extends Array {
  get occupies() { return this.filter(x => !x.isVacant); }
  get vacants() { return this.filter(x => x.isVacant); }
  findByCharactor = charactor => this.find(x => x.charactor.Id = charactor.Id);

  clear() {
    for (let cell of this) {
      cell.clear();
    }
  }

  getInfo = () => {
    const results = {};
    this.forEach((cell, i) => {
      if (cell.charactor != null) {
        results[String(i)] = cell.charactor.Id;
      }
    });

    return results;
  };

  applyInfo = (info, players, round) => {
    this.clear();

    for (let [index, charactorId] of Object.entries(info)) {
      const charactor = players.findCharactorById(charactorId);
      if (charactor == null) {
        continue;
      }

      charactor.entryRound = round;
      this[index].charactor = charactor;
    }
  };
}
