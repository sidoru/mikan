import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Badge from '@material-ui/core/Badge';
import Moment from 'react-moment';

import { CharactorModel, CellModel, CellType } from '../model/models';
import { Schedules } from '../api/collections';
import PositionBoardModel from '../model/PositionBoardModel';


import TabPanel from './TabPanel.jsx';

class Position extends Component {
  constructor(props) {
    super(props);
    this.state = {
      positions: [], // [cellIndex , charactorId]
      tabIndex: 0,
    };

    this.dragItem = null;

    this.model = new PositionBoardModel();
  }

  render() {
    // ドラッグ中にデータが変わったらドラッグ中断
    this.dragItem = null;

    this.schedule = this.props.schedule;
    if (this.schedule == null) {
      return (<div></div>);
    }

    this.model.applySchedule(this.schedule);

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
      const className = ['box', this.cellTypeToClass(cell.cellType)].join(' ');
      return (
        <div className={className}
          draggable onDoubleClick={e => this.handleCellDoubleClick(cell)}
          onDragStart={e => this.handleCellDragstart(e, cell)}
          onDrop={e => this.handleCellDrop(e, cell)}
          onDragOver={this.handleCellDragover}
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

      const className = ['charactor-name', this.cellTypeToClass(charactor.cellType)].join(' ');
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
            onDoubleClick={e => this.handleCharactorDoubleClick(charactor)}
            onDragStart={e => this.handleCharactorDragstart(e, charactor)}>
            {charactor.name}
          </div>
        </Badge>
      );
    };

    return (
      <div>
        <Paper square>
          <div style={{ display: "inline-block", margin: "2px 20px" }}>
            <Moment format="MM月DD日">{this.model.executionDate}</Moment>
          </div>
          <div style={{ display: "inline-block" }}>
            <Tabs
              value={this.state.tabIndex}
              onChange={this.handleTabChange}
              indicatorColor="primary"
              textColor="primary">
              <Tab label="1回目" />
              <Tab label="2回目" />
            </Tabs>
          </div>
        </Paper>
        <TabPanel value={this.state.tabIndex} index={0}>
          <CellContainer cells={this.model.assortedCells[0]} />
        </TabPanel>
        <TabPanel value={this.state.tabIndex} index={1}>
          <CellContainer cells={this.model.assortedCells[1]} />
        </TabPanel>
        <div className="pl-container">
          {this.model.players.map((player, index) =>
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

  // タブ切替
  handleTabChange = (event, newValue) => {
    this.setState({ tabIndex: newValue })
  };

  // キャラクリック
  handleCharactorDoubleClick = charactor => {
    if (this.model.entryCharactor(charactor, this.state.tabIndex)) {
      this.onCellChanged();
    }
  }

  // キャラDragstart
  handleCharactorDragstart = (e, charactor) => {
    e.dataTransfer.effectAllowed = 'move';
    this.dragItem = charactor;
  }

  // セルDragstart
  handleCellDragstart = (e, cell) => {
    e.dataTransfer.effectAllowed = 'move';
    this.dragItem = cell;
  }

  // セルDragover
  handleCellDragover = e => {
    e.stopPropagation();
    if (this.dragItem != null) {
      e.preventDefault();
    }
  }

  // セルDrop
  handleCellDrop = (e, dstCell) => {
    e.stopPropagation();

    let changed = false;
    if (this.dragItem instanceof CellModel) {
      changed = this.model.swapCell(this.dragItem, dstCell);

    } else if (this.dragItem instanceof CharactorModel) {
      changed = this.model.allocateCharactor(this.dragItem, dstCell);
    }

    this.dragItem = null;
    if (changed) {
      this.onCellChanged();
    }
  }

  // セルダブルクリック
  handleCellDoubleClick = cell => {
    cell.clear();
    this.onCellChanged();
  }

  // セル変更時
  onCellChanged() {
    const position = this.model.getPostionInfo();
    Meteor.call('schedules.updatePosition', this.schedule._id, position);
    //this.setState(newState);
  }
}

export default withTracker(props => {
  const { params } = props.match;

  let schedule;
  if (Meteor.subscribe('schedule', params.scheduleId).ready()) {
    schedule = Schedules.findOne({ _id: params.scheduleId });
  }

  return { schedule };
})(Position);