import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Player, Charactor, PlayerArray, Cell, CellArray, CellType, LineageClass, LineageClassInfo } from '../model/model';
import { Positions } from '../api/collections';
import PlayerRepository from '../repositories/PlayerRepository';
import CellRepository from '../repositories/CellRepository';

class Position extends Component {
  constructor(props) {
    super(props);
    this.state = {
      cells: new CellArray(),
      positions: [], // [cellIndex , charactorId]
    };

    this.positionId = null;
    this.dragItem = null;

    const cellRepository = new CellRepository();
    this.cells = cellRepository.getCells();

    const playerPepos = new PlayerRepository();
    this.players = playerPepos.getPlayers();
  }

  render() {
    const { params } = this.props.match;
    this.positionId = params.id;

    // ドラッグ中にデータが変わったらドラッグも中断
    this.dragItem = null;
    const positions = this.props.positions ? this.props.positions : [];

    console.log("render");
    console.log(positions);

    this.cells.clear();
    this.cells.applyInfo(positions, this.players);

    const boxCharactorCount = this.cells.occupies.filter(c => c.charactor.canBox).length;
    const totalCharactorCount = this.cells.occupies.length;
    return (
      <div>
        <div className="container">
          <div className="cell-container clear">
            {this.cells.map(this.renderCell)}
          </div>
        </div>
        <div className="info-container">
          <div className="info-text">{`Box:${boxCharactorCount} Total:${totalCharactorCount}`}</div>
        </div>
        <div className="pl-container">
          {this.players.map(this.renderPlayer)}
        </div>
      </div >
    );
  }

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
    return (<div key={charactor.Id}
      className={className}
      draggable
      onDoubleClick={e => this.handleCharactorDoubleClick(charactor)}
      onDragStart={e => this.handleCharactorDragstart(e, charactor)}
    >
      {charactor.name}
    </div>
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
    if (this.cells.occupies.some(x => x.charactor.Id == charactor.Id)) {
      return;
    }

    let target = this.cells.vacants.find(x => x.cellType == charactor.cellType);
    if (target == null) {
      target = this.cells.vacants.find(x => x);
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
    const positions = this.cells.getInfo();
    Meteor.call('positions.updatePositions', this.positionId, positions);
    //this.setState(newState);
  }
}

export default withTracker(props => {
  const { params } = props.match;
  const posrow = Positions.findOne({_id:params.id});
  
  return {
    positions: (posrow) ? posrow.positions : null,
  };
})(Position);