
import { Player, Charactor, PlayerArray, CellType, LineageClassInfo } from '../model/model';

export default class {
  playerTsv = `
  うさぎ	WIZ	86+	不可能	メイン活動中	２周目	応援
  うさぎ	プリ	80-	不可能	Lv77HP1685STR42(未装備）	１周目	2セル
  ちゃく	DE	86+	可能		１周目	1セル
  ちゃく	プリ	80+	可能		２周目	2セル
  ちゃく	戦士	80+	可能	1/17には８１なります。	２周目	タゲ
  ちゃく	WIZ	84+	可能		１周目	応援
  がーらんど	ナイト	84+	可能		２周目	2セル
  かてん	エルフ(風)	86+	可能		２周目	応援
  かてん	戦士	80+	可能	タゲ用	１周目	タゲ
  かてん	プリ	80+	可能	爆弾終了後	１周目	2セル
  かてん	WIZ	80-	不可能		２周目	応援
  かてん	プリ	80+	可能	☆爆弾終了後（DEとILLと同じアカウント）	２周目	2セル
  かよわわ	エルフ(風)	86+	可能		１周目	応援
  かよわわ	ILL	82+	不可能		２周目	応援
  かよわわ	DE	80-	不可能	爆弾終了後　～79	１周目	1セル
  かよわわ	プリ	80+	可能		２周目	2セル
  くれーじゅ	ナイト	88+	可能		１周目	2セル
  ねふ	WIZ	84+	不可能	ILLとWIZは同垢	１周目	応援
  ねふ	プリ	80+	不可能		２周目	2セル
  ぴぎ	ナイト	86+	可能		１周目	2セル
  ぴぎ	プリ	80-	不可能		２周目	2セル
  ミルド	エルフ(火)	86+	可能		２周目	1セル
  ミルド	DE	80+	不可能		２周目	1セル
  ミルド	プリ	80+	不可能		１周目	2セル
  ミルド	ILL	80-	不可能		１周目	応援
  ゆっきー	エルフ(水)	84+	不可能		１周目	応援
  ゆっきー	エルフ(水)	82+	不可能		２周目	応援
  ゆっきー	プリ	80-	不可能	爆弾終了後	１周目	2セル
  ゆっきー	ILL	82+	不可能		２周目	応援
  らちぇ	WIZ	80-	不可能	FA＆音ゲーマー	１周目	音ゲー
  らちぇ	WIZ	80-	不可能	FA＆音ゲーマー	２周目	音ゲー
  紫衣座	DRK	86+	可能	DrkとDEは同じ垢	１周目	2セル
  紫衣座	DRK	80+	可能	メインと別垢	２周目	2セル
  うさぎ	エルフ(水)	80-	不可能	Lv76INT型		応援
    `;

  parsePlayerTsv(tsv) {
    const list = [];

    const rows = tsv.split("\n");
    for (let row of rows) {
      const columns = row.split("\t").map(c => c.trim());
      if (columns.length != 7) {
        continue;
      }

      // 長い名前は表示の都合でぶった切る
      const playerName = (columns[0].length > 3) ? columns[0].substring(0, 3) : columns[0];
      const className = columns[1];
      // LV高いほど大きな値が入っていればそれでいい
      const levelIndex = "80-80+82+84+86+88+90+".indexOf(columns[2]);
      const canBox = columns[3] == "可能";
      const role = columns[6];

      const charactorCellType =
        (role == "1セル") ? CellType.ONE_CELL
          : (role == "2セル") ? CellType.TWO_CELL
            : (role == "タゲ") ? CellType.TARGET
              : (role == "音ゲー") ? CellType.DANCER
                : CellType.SUPPORTER;

      const classInfo = LineageClassInfo.find(x => x.sourceName == className);
      if (classInfo == null) {
        console.log(`未知のクラスがいるらしい ${className}`);
        continue;
      }

      var charactorName = playerName + classInfo.shortName;

      list.push({
        playerName,
        charactorName,
        lineageClass: classInfo.lineageClass,
        cellType: charactorCellType,
        levelIndex: levelIndex,
        canBox: canBox
      });
    }

    return list;
  }

  getPlayers() {
    const players = new PlayerArray();
    const tsvPlayers = this.parsePlayerTsv(this.playerTsv);
    for (let tp of tsvPlayers) {
      let player = players.find(x => x.name == tp.playerName);
      if (player == undefined) {
        player = new Player(tp.playerName);
        players.push(player);
      }

      player.charactors.push(new Charactor(tp.charactorName, tp.lineageClass, tp.cellType, tp.levelIndex, tp.canBox));

      // キャラ名重複奴に連番振る
      for (let c of player.charactors) {
        if (player.charactors.some(x => x != c && x.name == c.name)) {
          let seq = 1;
          for (let dupe of player.charactors.filter(x => x.name == c.name)) {
            dupe.name = `${dupe.name}${seq}`;
            seq++;
          }
        }
      }
    }

    return players;
  }
};