import React from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';

import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import { red } from '@material-ui/core/colors';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { makeStyles } from '@material-ui/core/styles';
import GridOnIcon from '@material-ui/icons/GridOn';
import TextField from '@material-ui/core/TextField';
import Grid from '@material-ui/core/Grid';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { Schedules } from '../api/collections';
import ResponsiveDialog from './ResponsiveDialog.jsx';
import Helper from './Helper';

export default withTracker(() => {
  let schedules;
  if (Meteor.subscribe('schedules').ready()) {
    schedules = Schedules.find({}, { sort: [["executionDate", "desc"], ["createAt", "desc"]] }).fetch();
  }

  return { schedules };
})(ScheduleList);

function ScheduleList({ classes, schedules }) {
  if (!schedules) {
    return <div></div>;
  }

  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [selectedSchedule, setSelectedSchedule] = React.useState("");
  const [dialogMode, setDialogMode] = React.useState("");

  const handleAddClick = () => {
    setDialogMode("insert");
    setSelectedSchedule(null);
    setDialogOpen(true);
  }

  const handleUpdateClick = schedule => {
    setDialogMode("update");
    setSelectedSchedule(schedule);
    setDialogOpen(true);
  }

  const handleDeleteClick = schedule => {
    setDialogMode("delete");
    setSelectedSchedule(schedule);
    setDialogOpen(true);
  }

  return (
    <div>
      <div>yotei</div>

      <Button variant="outlined" color="primary" onClick={e => handleAddClick()}>追加</Button>
      <ScheduleEditDialog open={dialogOpen} mode={dialogMode} schedule={selectedSchedule} onClose={e => setDialogOpen(false)} />

      {schedules.map((schedule, index) =>
        <Schedule key={index}
          schedule={schedule}
          onUpdateClick={handleUpdateClick}
          onDeleteClick={handleDeleteClick}
          positionUrl={`/schedules/${schedule._id}/position`} />
      )}
    </div>
  );
}

const useStyles = makeStyles(theme => ({
  root: {
    maxWidth: 445,
  },
  positionIcon: {
    transform: 'rotate(45deg)',
  },
  positionIconButton: {
    marginLeft: 'auto',
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
}));

// リストの行
const Schedule = ({ onUpdateClick, onDeleteClick, schedule, positionUrl }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const classes = useStyles();

  const handleMenuOpenClick = (event) => {
    setAnchorEl(event.currentTarget);
  }
  const handleMenuClose = () => {
    setAnchorEl(null);
  }

  const handleUpdateClick = () => {
    onUpdateClick(schedule);
    setAnchorEl(null);
  }

  const handleDeleteClick = () => {
    onDeleteClick(schedule);
    setAnchorEl(null);
  }

  const executionDate = Helper.formatDate(schedule.executionDate, "MM月dd日");

  return (
    <Card className={classes.root} variant="outlined" style={{ margin: '5px' }}>
      <CardHeader
        avatar={<Avatar aria-label="recipe" className={classes.avatar}>V</Avatar>}
        action={<MenuButton onClick={handleMenuOpenClick} />}
        title={<Typography> {executionDate}</Typography>}
      />
      <CardContent>
        <Typography color="textPrimary" component="p" style={{ whiteSpace: 'pre-line' }}>
          {schedule.description || "ノーコメント"}
        </Typography>
      </CardContent>
      <CardActions>
        <IconButton className={classes.positionIconButton}>
          <Link to={positionUrl}>
            <GridOnIcon className={classes.positionIcon} />
          </Link>
        </IconButton>
      </CardActions>

      <Menu
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}>
        <MenuItem onClick={e => handleUpdateClick()}>更新</MenuItem>
        <MenuItem onClick={e => handleDeleteClick()}>削除</MenuItem>
      </Menu>
    </Card>
  )
};

// 予定の編集ダイアログ
function ScheduleEditDialog({ open, onClose, mode, schedule }) {
  // 開いてないときはどうでもいい
  if (!open) {
    return <div></div>;
  }

  const initialSchedule = mode == "insert" ?
    {
      executionDate: Helper.formatDate(new Date(), "yyyy-MM-dd"),
      description: "",
    } : {
      executionDate: Helper.formatDate(schedule.executionDate, "yyyy-MM-dd"),
      description: schedule.description,
    };

  const [executionDate, setExecutionDate] = React.useState(initialSchedule.executionDate);
  const [description, setDescription] = React.useState(initialSchedule.description);

  handleDone = e => {
    const exeDate = new Date(executionDate + "T00:00");

    if (mode == "insert") {
      Meteor.call('schedules.insert', exeDate.toUTCString(), description);
    } else if (mode == "update") {
      Meteor.call('schedules.update', schedule._id, exeDate.toUTCString(), description);
    } else if (mode == "delete") {
      Meteor.call('schedules.delete', schedule._id);
    }

    onClose();
  }

  let doneCaption = "";
  if (mode == "insert") {
    doneCaption = "登録";
  } else if (mode == "update") {
    doneCaption = "更新";
  } else if (mode == "delete") {
    doneCaption = "削除";
  }

  return (

    <ResponsiveDialog
      onDone={e => handleDone(e)}
      onClose={onClose}
      title="予定編集"
      doneCaption={doneCaption}
      cancelCaption="キャンセル"
      open={open}
      content={
        <Grid>
          <TextField
            label="討伐日"
            type="date"
            margin="normal"
            fullWidth
            defaultValue={executionDate}
            onChange={e => setExecutionDate(e.target.value)}
            InputLabelProps={{
              shrink: true,
            }}
          />

          <TextField placeholder="ざっくり時間とか何かあれば"
            variant="outlined"
            label="コメント"
            margin="normal"
            fullWidth
            multiline
            onChange={e => setDescription(e.target.value)}
            value={description} />
        </Grid>
      }
    />
  )
}

const MenuButton = ({ onClick }) =>
  <IconButton aria-label="settings" onClick={onClick}>
    <MoreVertIcon />
  </IconButton>
  ;

