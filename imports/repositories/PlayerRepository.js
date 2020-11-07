
import { PlayerModel, CharactorModel, PlayerArray, CellRole, LineageClassInfo } from '../model/models';

export default class {
  playerTsv = `
  みっふぃ一	要	うさぎ	10	1	11	WIZ	86+	不可能	メイン活動中
  鶯丸	要	うさぎ	10	2	12	プリ	80-	不可能	Lv77HP1685STR42(未装備）
  みっぴー	要	うさぎ	10	2	12	エルフ(水)	80-	不可能	Lv76INT型
  Chakura	要	ちゃく	20	1	21	DE	86+	可能	
  Brittany	要	ちゃく	20	2	22	プリ	80+	可能	
  ぉッョィ	要	ちゃく	20	3	23	戦士	80+	可能	
  HystericBlue	要	ちゃく	20	4	24	WIZ	84+	可能	
  Karly	要	ちゃく	20	5	25	エルフ(火)	80-	不可能	埋めるだけ
  Garland	要	がーらんど	30	1	31	ナイト	84+	可能	
  さんま蒲焼き	要	がーらんど	30	2	32	ILL	80-	不可能	
  Candidate	要	かてん	40	1	41	エルフ(風)	88+	可能	
  Dimachaerus		かてん	40	2	42	剣士	84+	可能	
  ぐーすか		かてん	40	2	42	DE	80+	可能	
  Riemann	要	かてん	40	2	42	ILL	80-	不可能	
  Flint		かてん	40	3	43	戦士	80+	可能	たえる2号
  こなかんてん	要	かてん	40	3	43	エルフ(水)	80-	不可能	EFD用
  Lionni	要	かてん	40	3	43	WIZ	80-	不可能	
  たえるやつ	要	かてん	40	4	44	戦士	80+	可能	
  夢はおっきく		かてん	40	4	44	ILL	80+	可能	
  BondNo9	要	かてん	40	5	45	プリ	80+	可能	
  Alvor		かてん	40	5	45	エルフ(風)	80+	不可能	EFD用、属性自由
  NavierStokes		かてん	40	6	46	WIZ	80+	不可能	ゆっくりいくせいちゅう
  今日の主役		かてん	40	6	46	WIZ	80-	不可能	必要なさそうなConWiz
  ヵょゎぃ	要	かよわわ	50	1	51	エルフ(風)	86+	可能	
  Schweizer	要	かよわわ	50	2	52	ILL	82+	不可能	ゆっきーも起動可能
  のゎの	要	かよわわ	50	3	53	DE	80-	不可能	
  sheltie	要	かよわわ	50	4	54	プリ	80+	可能	
  くれーじゅ	要	くれーじゅ	60	1	61	ナイト	88+	可能	
  くくれーじゅ		くれーじゅ	60	2	62	剣士	82+	可能	
  小松菜奈		くれーじゅ	60	3	63	プリ	80-	不可能	
  Nepthys	要	ねふ	70	1	71	WIZ	84+	可能	
  Thrud	要	ねふ	70	2	72	プリ	80+	不可能	
  Crespighi	要	ぴぎ	80	1	81	ナイト	86+	可能	
  CADebussy	要	ぴぎ	80	2	82	プリ	80-	不可能	
  ミルド	要	ミルド	90	1	91	エルフ(火)	86+	可能	
  焼きぽん	要	ミルド	90	2	92	DE	82+	不可能	
  Fanaxis	要	ミルド	90	3	93	プリ	80+	不可能	
  ユメヒゴロ	要	ミルド	90	4	94	ILL	80+	不可能	
  Fatalis	要	ミルド	90	5	95	DRK	86+	不可能	
  砂雪	要	ゆっきー	100	1	101	エルフ(水)	84+	可能	
  リチェルカ	要	ゆっきー	100	2	102	エルフ(水)	82+	可能	
  LunaScioscia	要	ゆっきー	100	3	103	プリ	80-	不可能	
  Schweizer_ゆっきー	要	ゆっきー	100	4	104	ILL	82+	不可能	かよわも起動可能
  Schall	要	らちぇ	110	1	111	WIZ	80-	不可能	
  梓月	要	らちぇ	110	2	112	WIZ	80-	不可能	
  アギー		あぎー	120	1	121	エルフ(風)	86+	不可能	
  アギーナイト		あぎー	120	2	122	ナイト	80+	可能	
  REXULTI		あげは	130	1	131	DE	86+	可能	
  あげはILL		あげは	130	2	132	ILL	80+	不可能	
`;

  parsePlayerTsv(tsv) {
    const list = [];

    const rows = tsv.split("\n");
    for (let row of rows) {
      const columns = row.split("\t").map(c => c.trim());
      if (columns.length != 10) {
        console.log(`列数変やで 列数=${columns.length} 中身=${columns}`);
        continue;
      }

      // 長い名前は表示の都合でぶった切る
      const charactorName = columns[0];
      const playerName = columns[2];
      const accountId = columns[5];
      const className = columns[6];
      // LV高いほど大きな値が入っていればそれでいい
      const levelIndex = "80-80+82+84+86+88+90+".indexOf(columns[7]);
      const canBox = columns[8] == "可能";
      const role = "応援";

      const charactorCellRole =
        (role == "1セル") ? CellRole.ONE_CELL
          : (role == "2セル") ? CellRole.TWO_CELL
            : (role == "タゲ") ? CellRole.TARGET
              : (role == "音ゲー") ? CellRole.DANCER
                : CellRole.SUPPORTER;

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
        accountId,
        charactorNickname,
        lineageClass: classInfo.lineageClass,
        cellRole: charactorCellRole,
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

      player.charactors.push(new CharactorModel(tp.charactorName, tp.charactorNickname, tp.accountId, tp.lineageClass, tp.cellRole, tp.levelIndex, tp.canBox));
    }

    // キャラ名重複奴に連番振る
    for (let player of players) {
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