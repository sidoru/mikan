import React, { useMemo, useState } from 'react';
import { useTracker } from 'meteor/react-meteor-data';

import Paper from '@material-ui/core/Paper';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Badge from '@material-ui/core/Badge';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import InboxIcon from '@material-ui/icons/Inbox';
import CloseIcon from '@material-ui/icons/Close';
import Snackbar from '@material-ui/core/Snackbar';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';

import { CharactorModel, CellModel, CellRole } from '../model/models';
import { Schedules } from '../api/collections';
import PositionBoardModel from '../model/PositionBoardModel';
import Helper from './Helper';
import TabPanel from './TabPanel.jsx';
import ResponsiveDialog from './ResponsiveDialog.jsx';

export default function ({ match }) {
  const [tabIndex, setTabIndex] = useState(0);
  const [listDialogOpen, setListDialogOpen] = React.useState(false);
  const [message, setMessage] = React.useState({});
  const [selectedCharactor, setSelectedCharactor] = React.useState(null);
  const [isDisplayCharackterName, setIsDisplayCharackterName] = React.useState(false);

  const scheduleId = match.params.scheduleId;
  const { schedule } = useTracker(() => {
    let schedule;
    if (Meteor.subscribe('schedule', scheduleId).ready()) {
      schedule = Schedules.findOne({ _id: scheduleId });
    }

    return { schedule };
  }, [scheduleId]);

  const model = useMemo(() => new PositionBoardModel(), []);
  if (!schedule) {
    return (<div></div>);
  }

  model.apply(schedule.positions);
  model.round = tabIndex;

  // ドラッグ中にデータが変わったらドラッグ中断
  let dragItem = null;

  // メッセージ
  const showMessage = (message, actionTitle, onAction) => {
    const onClose = () => {
      setMessage(null);
    }

    setMessage({ message, actionTitle, onAction, onClose });
  }

  // タブ切替
  const handleTabChange = (event, newValue) => {
    setTabIndex(newValue);
  };

  // キャラクリック
  const handleCharactorDoubleClick = charactor => {

    if (model.isExistCharactorOtherRound(charactor)) {
      const round = charactor.entryRound + 1;
      const exitAction = () => {
        model.exitCharactor(charactor);
        setMessage(null);
        onCellChanged();
      };

      showMessage(`${round}回目に参加してます。`, `${round}回目から外す`, exitAction);
      return;
    } else if (model.isExistAccount(charactor)) {
      showMessage(`このキャラのアカウントは既に参加してます。`);
      return;
    }

    if (model.entryCharactor(charactor, tabIndex)) {
      onCellChanged();
    }
  }

  // キャラDragstart
  const handleCharactorDragstart = (e, charactor) => {
    dragItem = charactor;
  }

  // セルDragstart
  const handleCellDragstart = (e, cell) => {
    dragItem = cell;
  }

  // セルDragover
  const handleCellDragover = e => {
    e.stopPropagation();
    if (dragItem != null) {
      e.preventDefault();
    }
  }

  // セルDrop
  const handleCellDrop = (e, dstCell) => {
    e.stopPropagation();

    let changed = false;
    if (dragItem instanceof CellModel) {
      changed = model.swapCell(dragItem, dstCell);

    } else if (dragItem instanceof CharactorModel) {
      if (model.isExistAccount(dragItem)) {
        showMessage(`このキャラのアカウントは既に参加してます。`);
      } else {
        changed = model.allocate(dragItem, dstCell);
      }
    }

    dragItem = null;
    if (changed) {
      onCellChanged();
    }
  }

  // セルダブルクリック
  const handleCellDoubleClick = cell => {
    if (model.exitCharactor(cell)) {
      onCellChanged();
    }
  }

  // セル変更時
  const onCellChanged = () => {
    const positions = model.getPostions();
    Meteor.call('schedules.updatePosition', schedule._id, positions);
  }

  // コピー一覧の選択時
  const handleScheduleListSelected = selectedSchedule => {
    setListDialogOpen(false);
    model.apply(selectedSchedule.positions);
    onCellChanged();
  }

  // ラウンド入れ替え
  const handleSwapRound = () => {
    model.swapRound();
    onCellChanged();
  }
  // キャラ名表示
  const handleIsDisplayCharackterNameChange = ()=> event =>{
    setIsDisplayCharackterName(event.target.checked);
  }

  // セルコンテナ
  const CellContainer = ({ cells, cellWaterMark, className }) => {
    return (
      <div className={className}>
        {cells.map((cell, index) =>
          <Cell key={index} cell={cell} cellWaterMark={cellWaterMark} />
        )}
      </div>
    );
  };

  // セル
  const Cell = ({ cell, cellWaterMark }) => {
    let selectedClassName;
    if ((selectedCharactor !== null && selectedCharactor == cell.charactor)) {
      selectedClassName = "accent";
    }

    const className = ['box', cellRoleToClass(cell.cellRole), selectedClassName].join(' ');
    const text = (cell.charactor == null) ? "" : isDisplayCharackterName ? cell.charactor.charactorName : cell.charactor.name;
    return (
      <div
        className={className}
        draggable
        onMouseOver={e => setSelectedCharactor(cell.charactor)}
        onMouseLeave={e => setSelectedCharactor(null)}
        onDoubleClick={e => handleCellDoubleClick(cell)}
        onDragStart={e => handleCellDragstart(e, cell)}
        onDrop={e => handleCellDrop(e, cell)}
        onDragOver={handleCellDragover}
      >
        <div className="text">
          {
            (cellWaterMark !== undefined && cell.isVacant)
              ? <div className="text-water-mark">{cellWaterMark}</div>
              : text
          }
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
  const Charactor = ({ charactor }) => {
    let selectedClassName;
    if ((selectedCharactor !== null && selectedCharactor == charactor)) {
      selectedClassName = "accent";
    }

    const className = ['charactor-name', cellRoleToClass(charactor.cellRole), selectedClassName].join(' ');
    const color = (charactor.entryRound == 0) ? "primary" : "secondary";
    const text = isDisplayCharackterName ? charactor.charactorName : charactor.name;

    return (
      <Badge key={charactor.Id}
        badgeContent={charactor.entryRound + 1}
        color={color}
        overlap="circle"
        anchorOrigin={{ vertical: 'top', horizontal: 'left', }}>
        <div
          className={className}
          draggable
          onMouseOver={e => setSelectedCharactor(charactor)}
          onMouseLeave={e => setSelectedCharactor(null)}
          onDoubleClick={e => handleCharactorDoubleClick(charactor)}
          onDragStart={e => handleCharactorDragstart(e, charactor)}>
          {text}
        </div>
      </Badge>
    );
  };

  const entryCounts = model.getEntryCounts();
  const executionDate = Helper.formatDate(schedule.executionDate, "MM月dd日");
  return (
    <div>
      <Paper square>
        <div style={{ display: "inline-block", margin: "0px 80px" }}>
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
          <div className="cell-container-group">
            <div style={{ display: "inline-block" }}>
              <CellContainer cells={model.assortedCells[0]} className="cell-container clear" />
              <CellContainer cells={model.assortedBoxCells[0]} cellWaterMark="BOX" className="cell-container clear" />
            </div>
            <div style={{ display: "inline-block" }}>
              <div className="party-title">PT1</div>
              <CellContainer cells={model.assortedPartyCells[0].slice(0, 7)} cellWaterMark="PT1" className="party-cell-container clear " />
            </div>
            <div style={{ display: "inline-block" }}>
              <div className="party-title">PT2</div>
              <CellContainer cells={model.assortedPartyCells[0].slice(8, 15)} cellWaterMark="PT2" className="party-cell-container clear" />
            </div>
          </div>
        </div>
      </TabPanel>
      <TabPanel value={tabIndex} index={1}>
        <div>
          <div className="cell-container-group">
            <div style={{ display: "inline-block" }}>
              <CellContainer cells={model.assortedCells[1]} className="cell-container clear" />
              <CellContainer cells={model.assortedBoxCells[1]} cellWaterMark="BOX" className="cell-container clear" />
            </div>
            <div style={{ display: "inline-block" }}>
              <div className="party-title">PT1</div>
              <CellContainer cells={model.assortedPartyCells[1].slice(0, 7)} cellWaterMark="PT1" className="party-cell-container clear " />
            </div>
            <div style={{ display: "inline-block" }}>
              <div className="party-title">PT2</div>
              <CellContainer cells={model.assortedPartyCells[1].slice(8, 15)} cellWaterMark="PT2" className="party-cell-container clear" />
            </div>
          </div>
        </div>
      </TabPanel>
      <div className="pl-container">
        {model.players.map((player, index) =>
          <Player key={index} player={player} />
        )}
      </div>

      <Button variant="outlined" color="primary" onClick={e => setListDialogOpen(true)}>別の日の配置をコピー</Button>
      <Button variant="outlined" color="primary" onClick={e => handleSwapRound()}>1回目と2回目入替</Button>
      
      <FormControlLabel
        style={{marginLeft:"auto"}}
        control={
          <Checkbox
            checked={isDisplayCharackterName}
            onChange={handleIsDisplayCharackterNameChange()}
            color="primary"
          />
        }
        label="キャラ名を表示"
      />

      <ScheduleListDialog
        open={listDialogOpen}
        onClose={e => setListDialogOpen(false)}
        onSelected={s => handleScheduleListSelected(s)}
        exclusionId={schedule._id} />
      <MesageSnackbar {...message} />
    </div >
  );
}

// セルタイプをcssクラスに変換
const cellRoleToClass = ct =>
  ct == CellRole.BLOCK ? "block" :
    ct == CellRole.TARGET ? "target" :
      ct == CellRole.ONE_CELL ? "one-cell" :
        ct == CellRole.TWO_CELL ? "two-cell" :
          ct == CellRole.SUPPORTER ? "supporter" :
            ct == CellRole.DANCER ? "dancer" : "";

// 予定リストのダイアログ
function ScheduleListDialog({ open, onClose, onSelected, exclusionId }) {
  // 開いてないときはどうでもいい
  if (!open) {
    return <div></div>;
  }

  const { isLoading, schedules } = useTracker(() => {
    const isLoading = !Meteor.subscribe('schedules').ready();
    const schedules = Schedules.find({ _id: { $not: exclusionId } }, { sort: [["executionDate", "desc"], ["createAt", "desc"]] }).fetch();

    return { isLoading, schedules };
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  handleItemClick = schedule => {
    onSelected(schedule);
  }

  return (
    <ResponsiveDialog
      fullWidth={true}
      onClose={onClose}
      title="コピー元選択"
      open={open}
      content={
        <Grid>
          <List component="nav">
            {schedules.map((schedule, index) =>
              <ListItem key={index} button onClick={e => handleItemClick(schedule)}>
                <ListItemIcon>
                  <InboxIcon />
                </ListItemIcon>
                <ListItemText primary={Helper.formatDate(schedule.executionDate, "MM月dd日")}
                  secondary={schedule.description} />
              </ListItem>
            )}
          </List>
        </Grid>
      }
    />
  )
}

function MesageSnackbar({ message, actionTitle, onAction, onClose }) {
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    onClose();
  };

  const open = !!message;

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      open={open}
      autoHideDuration={6000}
      onClose={handleClose}
      message={message}
      action={
        <React.Fragment>
          {
            (onAction) ?
              <Button color="secondary" size="small" onClick={onAction}>
                {actionTitle}
              </Button>
              : null
          }
          <IconButton size="small" aria-label="close" color="inherit" onClick={handleClose}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </React.Fragment>
      }
    />
  );
}