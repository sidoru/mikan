import React, { useMemo, useState } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Badge from '@material-ui/core/Badge';
import { makeStyles, withStyles } from '@material-ui/core/styles';

import { CharactorModel, CellModel, CellType } from '../model/models';
import { Schedules } from '../api/collections';
import PositionBoardModel from '../model/PositionBoardModel';
import Helper from './Helper';
import TabPanel from './TabPanel.jsx';
import ResponsiveDialog from './ResponsiveDialog.jsx';

export default withTracker(props => {
  const { params } = props.match;

  let schedule;
  if (Meteor.subscribe('schedule', params.scheduleId).ready()) {
    schedule = Schedules.findOne({ _id: params.scheduleId });
  }

  return { schedule };
})(Position);

function Position({ schedule }) {
  if (schedule == null) {
    return (<div></div>);
  }

  const [tabIndex, setTabIndex] = useState(0);

  const model = useMemo(() => new PositionBoardModel(), []);
  model.applySchedule(schedule);
  model.round = tabIndex;

  // ドラッグ中にデータが変わったらドラッグ中断
  let dragItem = null;

  // タブ切替
  handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  // キャラクリック
  handleCharactorDoubleClick = charactor => {
    if (model.entryCharactor(charactor, tabIndex)) {
      onCellChanged();
    }
  }

  // キャラDragstart
  handleCharactorDragstart = (e, charactor) => {
    dragItem = charactor;
  }

  // セルDragstart
  handleCellDragstart = (e, cell) => {
    dragItem = cell;
  }

  // セルDragover
  handleCellDragover = e => {
    e.stopPropagation();
    if (dragItem != null) {
      e.preventDefault();
    }
  }

  // セルDrop
  handleCellDrop = (e, dstCell) => {
    e.stopPropagation();

    let changed = false;
    if (dragItem instanceof CellModel) {
      changed = model.swapCell(dragItem, dstCell);

    } else if (dragItem instanceof CharactorModel) {
      changed = model.allocateCharactor(dragItem, dstCell);
    }

    dragItem = null;
    if (changed) {
      onCellChanged();
    }
  }

  // セルダブルクリック
  handleCellDoubleClick = cell => {
    if (model.exitCharactor(cell)) {
      onCellChanged();
    }
  }

  // セル変更時
  onCellChanged = () => {
    const position = model.getPostionInfo();
    Meteor.call('schedules.updatePosition', schedule._id, position);
  }

  // セルコンテナ
  const CellContainer = props => {
    const { cells } = props;

    return (
      <div className="cell-container clear">
        {cells.map((cell, index) =>
          <Cell key={index} cell={cell} />
        )}
      </div>
    );
  };

  // セル
  const Cell = props => {
    const { cell } = props;
    const className = ['box', cellTypeToClass(cell.cellType)].join(' ');
    return (
      <div className={className}
        draggable onDoubleClick={e => handleCellDoubleClick(cell)}
        onDragStart={e => handleCellDragstart(e, cell)}
        onDrop={e => handleCellDrop(e, cell)}
        onDragOver={handleCellDragover}
      >
        <div className="text">
          {cell.text}
        </div>
      </div>
    );
  };

  // プレイヤー
  const Player = props => {
    const { player } = props;

    return (
      <div key={player.Id} className="player-container">
        <div className="player-name">
          {player.name}
        </div>

        {player.charactors.map((charactor, index) =>
          <Charactor key={index} charactor={charactor} />
        )}
      </div >
    );
  };

  // キャラ
  const Charactor = props => {
    const { charactor } = props;

    const className = ['charactor-name', cellTypeToClass(charactor.cellType)].join(' ');
    const color = (charactor.entryRound == 1) ? "primary" : "secondary";

    return (
      <Badge key={charactor.Id}
        badgeContent={charactor.entryRound}
        color={color}
        overlap="circle"
        anchorOrigin={{ vertical: 'top', horizontal: 'left', }}>
        <div
          className={className}
          draggable
          onDoubleClick={e => handleCharactorDoubleClick(charactor)}
          onDragStart={e => handleCharactorDragstart(e, charactor)}>
          {charactor.name}
        </div>
      </Badge>
    );
  };

  const entryCounts = model.getEntryCounts();
  const executionDate = Helper.formatDate(schedule.executionDate, "MM月dd日");
  return (
    <div>
      <Paper square>
        <div style={{ display: "inline-block", margin: "0px 20px" }}>
          {executionDate}
        </div>
        <div style={{ display: "inline-block" }}>
          <Tabs
            value={tabIndex}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary">
            <Tab label={<div><div>1回目</div><div>{`TOTAL${entryCounts[0].total}:BOX${entryCounts[0].box}`}</div></div>} />
            <Tab label={<div><div>2回目</div><div>{`TOTAL${entryCounts[1].total}:BOX${entryCounts[1].box}`}</div></div>} />
          </Tabs>
        </div>
      </Paper>
      <TabPanel value={tabIndex} index={0}>
        <div>
          <CellContainer cells={model.assortedCells[0]} />
          <CellContainer cells={model.assortedBoxCells[0]} />
        </div>
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <div>
          <CellContainer cells={model.assortedCells[1]} />
          <CellContainer cells={model.assortedBoxCells[1]} />
        </div>
      </TabPanel>
      <div className="pl-container">
        {model.players.map((player, index) =>
          <Player key={index} player={player} />
        )}
      </div>
    </div >
  );
}

renderActorCounts = actorCount => (
  <div className="info-container">
    <div className="info-text">{`Box:${actorCount.box} Total:${actorCount.total}`}</div>
  </div>
);

// セルタイプをcssクラスに変換
cellTypeToClass = ct =>
  ct == CellType.BLOCK ? "block" :
    ct == CellType.TARGET ? "target" :
      ct == CellType.ONE_CELL ? "one-cell" :
        ct == CellType.TWO_CELL ? "two-cell" :
          ct == CellType.SUPPORTER ? "supporter" :
            ct == CellType.DANCER ? "dancer" : "";


// 予定リストのダイアログ
function ScheduleListDialog({ open, onClose , OnSelected}) {
  // 開いてないときはどうでもいい
  if (!open) {
    return <div></div>;
  }

  const schedules = Schedules.find({}, { sort: [["executionDate", "desc"], ["createAt", "desc"]] }).fetch();

  const [executionDate, setExecutionDate] = React.useState(initialSchedule.executionDate);

  handleDone = e => {
    OnSelected();
    onClose();
  }

  return (

    <ResponsiveDialog
      onDone={e => handleDone(e)}
      onClose={onClose}
      title="コピー元選択"
      doneCaption="コピー"
      cancelCaption="キャンセル"
      open={open}
      content={
        <Grid>
        </Grid>
      }
    />
  )
}