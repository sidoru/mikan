
import { PlayerModel, CharactorModel, PlayerArray, CellType, LineageClassInfo } from '../model/models';

export default class {
  playerTsv = `
  みっふぃ一	要	うさぎ	WIZ	86+	不可能	メイン活動中	２周目	応援
  鶯丸	要	うさぎ	プリ	80-	不可能	Lv77HP1685STR42(未装備）	１周目	2セル
  Chakura	要	ちゃく	DE	86+	可能		１周目	1セル
  Brittany	要	ちゃく	プリ	80+	可能		２周目	2セル
  ぉッョィ	要	ちゃく	戦士	80+	可能	1/17には８１なります。	２周目	タゲ
  HystericBlue	要	ちゃく	WIZ	84+	可能		１周目	応援
  Garland	要	がーらんど	ナイト	84+	可能		２周目	2セル
  GarlandILL	要	がーらんど	ILL	80-	不可能			応援
  花天月地	要	かてん	エルフ(風)	86+	可能		２周目	応援
  たえるやつ	要	かてん	戦士	80+	可能	タゲ用	１周目	タゲ
  BondoNo9	要	かてん	プリ	80+	可能	爆弾終了後	１周目	2セル
  Lionni	要	かてん	WIZ	80-	不可能		２周目	応援
  ParkLane	要	かてん	プリ	80+	可能	☆爆弾終了後（DEとILLと同じアカウント）	２周目	2セル
  ヵょゎぃ	要	かよわわ	エルフ(風)	86+	可能		１周目	応援
  Sche...	要	かよわわ	ILL	82+	不可能		２周目	応援
  のゎの	要	かよわわ	DE	80-	不可能	爆弾終了後　～79	１周目	1セル
  sheltie	要	かよわわ	プリ	80+	可能		２周目	2セル
  くれーじゅ	要	くれーじゅ	ナイト	88+	可能		１周目	2セル
  Nepthys	要	ねふ	WIZ	84+	不可能	ILLとWIZは同垢	１周目	応援
  Thrud	要	ねふ	プリ	80+	不可能		２周目	2セル
  Crespighi	要	ぴぎ	ナイト	86+	可能		１周目	2セル
  CADebussy	要	ぴぎ	プリ	80-	不可能		２周目	2セル
  ミルド	要	ミルド	エルフ(火)	86+	可能		２周目	1セル
  焼きぽん	要	ミルド	DE	80+	不可能		２周目	1セル
  Fanaxis	要	ミルド	プリ	80+	不可能		１周目	2セル
  ユメヒゴロ	要	ミルド	ILL	80-	不可能		１周目	応援
  砂雪	要	ゆっきー	エルフ(水)	84+	不可能		１周目	応援
  リチェルカ	要	ゆっきー	エルフ(水)	82+	不可能		２周目	応援
  LunaScioscia	要	ゆっきー	プリ	80-	不可能	爆弾終了後	１周目	2セル
  Schall	要	らちぇ	WIZ	80-	不可能	FA＆音ゲーマー	１周目	音ゲー
  梓月	要	らちぇ	WIZ	80-	不可能	FA＆音ゲーマー	２周目	音ゲー
  紫衣座	要	紫衣座	DRK	86+	可能	DrkとDEは同じ垢	１周目	2セル
  3D9696	要	紫衣座	DRK	80+	可能	メインと別垢	２周目	2セル
  みっぴー	要	うさぎ	エルフ(水)	80-	不可能	Lv76INT型		応援
  Fatalis	要	ミルド	DRK	80+	不可能			
    `;

  parsePlayerTsv(tsv) {
    const list = [];

    const rows = tsv.split("\n");
    for (let row of rows) {
      const columns = row.split("\t").map(c => c.trim());
      if (columns.length != 9) {
        continue;
      }

      // 長い名前は表示の都合でぶった切る
      const charactorName = columns[0];
      const playerName = columns[2];
      const className = columns[3];
      // LV高いほど大きな値が入っていればそれでいい
      const levelIndex = "80-80+82+84+86+88+90+".indexOf(columns[4]);
      const canBox = columns[5] == "可能";
      const role = columns[8];

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

      const playerNickname = (playerName.length > 3) ? playerName.substring(0, 3) : playerName;
      var charactorNickname = playerNickname + classInfo.shortName;

      list.push({
        playerName,
        charactorName,
        charactorNickname,
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
        player = new PlayerModel(tp.playerName);
        players.push(player);
      }

      player.charactors.push(new CharactorModel(tp.charactorName, tp.charactorNickname, tp.lineageClass, tp.cellType, tp.levelIndex, tp.canBox));

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