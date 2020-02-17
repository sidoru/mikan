import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';

import ReactDOM from 'react-dom';
import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Typography from '@material-ui/core/Typography';
import Box from '@material-ui/core/Box';
import Badge from '@material-ui/core/Badge';

import PlayerRepository from '../repositories/PlayerRepository';
import CellRepository from '../repositories/CellRepository';
import { Player, Charactor, PlayerArray, Cell, CellArray, CellType } from '../model/model';
import { Positions } from '../api/collections';

class Position extends Component {
  constructor(props) {
    super(props);
    this.state = {
      positions: [], // [cellIndex , charactorId]
      tabIndex: 0,
    };

    console.log("constructor");
    this.scheduleId = null;
    this.dragItem = null;

    const cellRepository = new CellRepository();
    this.assortedCells = [cellRepository.getCells(), cellRepository.getCells()];

    this.cells = new CellArray();
    for (let cell of this.assortedCells.reduce((x, y) => x.concat(y), [])) {
      this.cells.push(cell);
    }

    const playerPepos = new PlayerRepository();
    this.players = playerPepos.getPlayers();
  }

  render() {
    const { params } = this.props.match;
    this.scheduleId = params.scheduleId;

    // ドラッグ中にデータが変わったらドラッグも中断
    this.dragItem = null;
    const assortedPositions = this.props.positions ? this.props.positions : [[], []];

    console.log(assortedPositions);

    for (let i in this.assortedCells) {
      if (assortedPositions.length <= i) {
        break;
      }

      const partCells = this.assortedCells[i];
      const partPositions = assortedPositions[i];
      const round = Number(i) + 1;
      partCells.applyInfo(partPositions, this.players, round);
    }

    const boxCharactorCount = this.cells.occupies.filter(c => c.charactor.canBox).length;
    const totalCharactorCount = this.cells.occupies.length;
    const TabPanel = props => {
      const { children, value, index, ...other } = props;

      return (
        <Typography
          component="div"
          role="tabpanel"
          hidden={value !== index}
          id={`nav-tabpanel-${index}`}
          aria-labelledby={`nav-tab-${index}`}
          {...other}
        >
          {value === index && <Box p={3}>{children}</Box>}
        </Typography>
      );
    }

    const CellContainer = props => {
      const { cells } = props;

      return (
        <div className="cell-container clear">
          {cells.map(this.renderCell)}
        </div>
      );
    };


    return (
      <div>
        <Paper square>
          <Tabs
            value={this.state.tabIndex}
            onChange={this.handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            centered>
            <Tab label="1回目" />
            <Tab label="2回目" />
          </Tabs>
        </Paper>
        <TabPanel value={this.state.tabIndex} index={0}>
          <CellContainer cells={this.assortedCells[0]} />
        </TabPanel>
        <TabPanel value={this.state.tabIndex} index={1}>
          <CellContainer cells={this.assortedCells[1]} />
        </TabPanel>
        <div className="info-container">
          <div className="info-text">{`Box:${boxCharactorCount} Total:${totalCharactorCount}`}</div>
        </div>
        <div className="pl-container">
          {this.players.map(this.renderPlayer)}
        </div>
      </div >
    );
  }

  handleTabChange = (event, newValue) => {
    this.setState({ tabIndex: newValue })
  };

  // セル描画
  renderCell = (cell, index) => {
    const className = ['box', this.cellTypeToClass(cell.cellType)].join(' ');
    return (
      <div key={index}
        className={className}
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
  }

  // プレイヤー描画
  renderPlayer = player => {
    const charactors = player.charactors.map(this.renderCharactor);

    return (
      <div key={player.Id} className="player-container">
        <div className="player-name">
          {player.name}
        </div>
        {charactors}
      </div >
    );
  }

  // キャラ描画
  renderCharactor = charactor => {
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
  }

  // セルタイプをcssクラスに変換
  cellTypeToClass = ct =>
    ct == CellType.BLOCK ? "block" :
      ct == CellType.TARGET ? "target" :
        ct == CellType.ONE_CELL ? "one-cell" :
          ct == CellType.TWO_CELL ? "two-cell" :
            ct == CellType.SUPPORTER ? "supporter" :
              ct == CellType.DANCER ? "dancer" : "";

  // キャラクリック
  handleCharactorDoubleClick = charactor => {
    const currentCells = this.assortedCells[this.state.tabIndex];
    if (this.cells.occupies.some(x => x.charactor.Id == charactor.Id)) {
      return;
    }

    let target = currentCells.vacants.find(x => x.cellType == charactor.cellType);
    if (target == null) {
      target = currentCells.vacants.find(x => x);
    }

    if (target != null) {
      target.charactor = charactor;
      this.onCellChanged();
    }
  }

  // 対象セルリストのキャラ削除
  clearExistedCell = charactor => {
    const existedCell = this.cells.find(x => x.charactor === charactor);
    if (existedCell != null) {
      existedCell.clear();
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

    if (this.dragItem instanceof Cell) {
      const srcCell = this.dragItem;

      // 両方のセルが空っぽでも何もしなくて良い
      if (srcCell == dstCell || srcCell.charactor == dstCell.charactor) {
        return;
      }

      srcCell.swap(dstCell);

    } else if (this.dragItem instanceof Charactor) {
      const charactor = this.dragItem;
      this.clearExistedCell(charactor);
      dstCell.charactor = charactor;
    }

    this.dragItem = null;
    this.onCellChanged();
  }

  // セルダブルクリック
  handleCellDoubleClick = cell => {
    cell.clear();
    this.onCellChanged();
  }

  // セル変更時
  onCellChanged() {
    console.log("onCellChanged");
    const positions = this.assortedCells.map(c => c.getInfo());
    Meteor.call('schedules.savePosition', this.scheduleId, positions);
    //this.setState(newState);
  }
}

export default withTracker(props => {
  const { params } = props.match;

  console.log("withTracker da");
  let positions;
  if (Meteor.subscribe('schedulePosition', params.scheduleId).ready()) {
    console.log("withTracker subsc");
    position = Meteor.call("schedules.getPosition", params.scheduleId);
    if (position != null) {
      positions = position.positions;
    }
  }

  return { positions };
})(Position);