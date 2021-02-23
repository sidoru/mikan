
import { PlayerModel, CharactorModel, PlayerArray, CellRole, LineageClassInfo } from '../model/models';

export default class {
  playerTsv = `
兎葵	要	うさぎ	100	1	101	WIZ	86+	不可能	メイン活動中垢①
南泉一文字		うさぎ	100	2	102	DE	80-	不可能	垢①
うぐいす丸	要	うさぎ	100	3	103	プリ	80+	不可能	垢②
うさぎ水	要	うさぎ	100	4	104	エルフ(水)	80-	不可能	Lv76INT型垢②
亀甲貞宗		うさぎ	100	5	105	DE	80+	不可能	垢③
膝丸		うさぎ	100	6	106	フェンサー	80-	不可能	垢④Lv75STR型
Chakura	要	ちゃく	200	1	201	DE	86+	可能	
Brittany	要	ちゃく	200	2	202	プリ	80+	可能	
ぉッョィ	要	ちゃく	200	3	203	戦士	80+	可能	
HystericBlue	要	ちゃく	200	4	204	WIZ	84+	可能	
Karly	要	ちゃく	200	5	205	エルフ(火)	80-	不可能	埋めるだけ
Garland	要	がーらんど	300	1	301	ナイト	84+	可能	
さんま蒲焼き	要	がーらんど	300	2	302	ILL	80-	不可能	
がー戦士		がーらんど	300	3	303	戦士	80-	可能	
Candidate	要	かてん	400	1	401	エルフ(風)	88+	可能	
Dimachaerus		かてん	400	2	402	フェンサー	86+	可能	
ぐーすか		かてん	400	3	403	DE	80+	可能	
Riemann	要	かてん	400	4	404	ILL	80-	不可能	
Flint		かてん	400	5	405	戦士	80+	可能	たえる2号
たえるやつ	要	かてん	400	6	406	戦士	80+	可能	
BondNo9	要	かてん	400	7	407	プリ	80+	可能	
Alvor		かてん	400	8	408	エルフ(風)	80+	不可能	EFD用、属性自由
NavierStokes		かてん	400	9	409	WIZ	82+	不可能	ゆっくりいくせいちゅう
いたそう		かてん	400	10	410	戦士	80+	可能	たえる3号
いつものやつ		かてん	400	11	411	戦士	80+	可能	たえる3号
ばふくん		かてん	400	12	412	ILL	80-	不可能	ばふ
ヵょゎ	要	かよわわ	500	1	501	エルフ(風)	86+	可能	
ぇぇぃ	要	かよわわ	500	2	502	ILL	82+	不可能	ゆっきーも起動可能
のoのノ	要	かよわわ	500	3	503	DE	80-	不可能	いきてた
sheltie	要	かよわわ	500	4	504	プリ	80+	可能	
Zx		かよわわ	500	5	505	フェンサー			
くれーじゅ	要	くれーじゅ	600	1	601	ナイト	88+	可能	
くれーじゅゅ		くれーじゅ	600	2	602	フェンサー	80+	可能	Con20 str45
くわーじゅ		くれーじゅ	600	3	603	ILL	80-	不可能	初期Con そのあともCon
くくれーじゅ		くれーじゅ	600	4	604	フェンサー	86+	可能	Con19 str45
小松菜奈		くれーじゅ	600	5	605	プリ	80+	不可能	
ねふW	要	ねふ	700	1	701	WIZ	84+	可能	
ねふＰ	要	ねふ	700	2	702	プリ	82+	不可能	
ねふ剣05		ねふ	700	3	703	フェンサー	80+	可能	
ねふ剣06		ねふ	700	4	704	フェンサー	80+	可能	
ねふ剣07		ねふ	700	5	705	フェンサー	80+	可能	
ねふ剣08		ねふ	700	6	706	フェンサー	80+	可能	
ねふ剣09		ねふ	700	7	707	フェンサー	80+	可能	
ねふ剣10		ねふ	700	8	708	フェンサー	80+	可能	
ねふ風01		ねふ	700	9	709	エルフ(風)	80+	不可能	
ねふ風02		ねふ	700	10	710	エルフ(風)	80+	不可能	
ねふ風03		ねふ	700	11	711	エルフ(風)	80+	不可能	
ねふ風04		ねふ	700	12	712	エルフ(風)	80+	不可能	
Crespighi	要	ぴぎ	800	1	801	ナイト	88+	可能	
CADebussy	要	ぴぎ	800	2	802	プリ	80+	不可能	
ぴぎ剣1	要	ぴぎ	800	3	803	フェンサー	80+	可能	
ぴぎ剣2		ぴぎ	800	4	804	フェンサー	80-	可能	
ぴぎ剣3		ぴぎ	800	5	805	フェンサー	80-	可能	
ミルド	要	ミルド	900	1	901	エルフ(火)	88+	可能	
焼きぽん	要	ミルド	900	2	902	DE	82+	不可能	
マーピル	要	ミルド	900	3	903	DE	80+	不可能	
ミルドプリ1	要	ミルド	900	4	904	プリ	80+	不可能	
ちょみっと		ミルド	900	5	905	プリ	80+	不可能	
ミルド剣1	要	ミルド	900	6	906	フェンサー	80+	可能	
ミルド剣2	要	ミルド	900	7	907	フェンサー	80+	可能	
Fatalis	要	ミルド	900	8	908	DRK	86+	不可能	
うおー		ミルド	900	9	909	戦士	80+	可能	
ファーミー		ミルド	900	10	910	WIZ	84+	可能	
砂雪	要	ゆっきー	1000	1	1001	エルフ(水)	86+	可能	
蘭珠	要	ゆっきー	1000	2	1002	プリ	80+	不可能	
舞夏		ゆっきー	1000	3	1003	エルフ(水)	82+	不可能	
リチェルカ		ゆっきー	1000	4	1004	フェンサー	80+	不可能	
ノヴァーリス		ゆっきー	1000	5	1005	エルフ(水)	80+	不可能	
祈莉		ゆっきー	1000	6	1006	エルフ(水)	80-	不可能	なぅLv75
Schall	要	らちぇ	1100	1	1101	WIZ	80-	不可能	
梓月	要	らちぇ	1100	2	1102	WIZ	80-	不可能	
アギー風		あぎー	1200	1	1201	エルフ(風)	86+	可能	
アギーＫ		あぎー	1200	2	1202	ナイト	80+	可能	
アギー剣１		あぎー	1200	3	1203	フェンサー	80-	可能	
アギー剣２		あぎー	1200	4	1204	フェンサー	80-	可能	
アギーＷ		あぎー	1200	5	1205	WIZ	80-	不可能	
アギー戦		あぎー	1200	6	1206	戦士	80-	可能	
REXULTI		あげは	1300	1	1301	DE	86+	可能	
幾田りら		あげは	1300	2	1302	ILL	80+	不可能	
HIASOBI		あげは	1300	3	1303	ILL	80+	不可能	
airmax95		あげは	1300	4	1304	WIZ	80+	不可能	
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
