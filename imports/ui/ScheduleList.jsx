import React, { Component } from 'react';
import { withTracker } from 'meteor/react-meteor-data';
import { Link } from 'react-router-dom';

import moment from 'moment';
import 'moment/locale/ja'

moment.locale("ja");
import Moment from 'react-moment';

import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Card from '@material-ui/core/Card';
import CardHeader from '@material-ui/core/CardHeader';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import { red } from '@material-ui/core/colors';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ShareIcon from '@material-ui/icons/Share';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import { withStyles } from '@material-ui/core/styles';
import GridOnIcon from '@material-ui/icons/GridOn';
import TextField from '@material-ui/core/TextField';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import Grid from '@material-ui/core/Grid';

import { Schedules } from '../api/collections';
import ResponsiveDialog from './ResponsiveDialog.jsx';

const styles = theme => ({
  root: {
    maxWidth: 445,
  },
  positionIcon: {
    transform: 'rotate(45deg)',
    marginLeft: 'auto',
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
  avatar: {
    backgroundColor: red[500],
  },
});

class ScheduleList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      executionDate: new moment().format("YYYY-MM-DD"),
      description: "",
      registerDialogOpen: false,
    };
  }

  render() {
    const { classes } = this.props;
    const schedules = this.props.schedules ? this.props.schedules : [];

    const Schedule = ({ executionDate, description, positionUrl }) => {
      return (
        <Card className={classes.root} variant="outlined" style={{margin: '5px'}}>
          <CardHeader
            avatar={<Avatar aria-label="recipe" className={classes.avatar}>V</Avatar>}
            action={
              <IconButton aria-label="settings">
                <MoreVertIcon />
              </IconButton>
            }
            title={<Moment format="MM月DD日">{executionDate}</Moment>}
          />
          <CardContent>
            <Typography variant="body2" color="textPrimary" component="p" style={{whiteSpace: 'pre-line'}}>
              {description || "ノーコメント"}
            </Typography>
          </CardContent>
          <CardActions>
            <IconButton className={classes.positionIcon}>
              <Link to={positionUrl}>
                <GridOnIcon />
              </Link>
            </IconButton>
          </CardActions>
        </Card>
      )
    };

    return (
      <div>
        <div>yotei</div>

        <Button variant="outlined" color="primary" onClick={e => this.handleOpenDialogClick(e)}>
          tuika
        </Button>
        <ResponsiveDialog
          onDone={e => this.handleRegistDone(e)}
          onClose={e => this.handleRegistClose(e)}
          title="予定編集"
          doneCaption="保存"
          cancelCaption="キャンセル"
          open={this.state.registerDialogOpen}
          content={
            <Grid>
              <TextField
                label="討伐日"
                type="date"
                margin="normal"
                fullWidth
                defaultValue={this.state.executionDate}
                onChange={e => this.handleExecutionDateChange(e.target.value)}
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
                onChange={e => this.handleDescriptionChange(e.target.value)}
                value={this.state.description} />
            </Grid>
          }
        />

        {schedules.map((schedule, index) =>
          <Schedule key={index}
            executionDate={schedule.executionDate}
            description={schedule.description}
            positionUrl={`/schedules/${schedule._id}/position`} />
        )}
      </div>
    );
  }

  handleExecutionDateChange(date) {
    this.setState({ ...this.state, executionDate: date });
  }
  handleDescriptionChange(description) {
    this.setState({ ...this.state, description });
  }

  handleRegistDone(e) {
    const exeDate = new Date(this.state.executionDate +"T00:00" );
    console.log(this.state.executionDate);
    console.log(exeDate);
    console.log(exeDate.toUTCString());
    Meteor.call('schedules.insert', exeDate.toUTCString(), this.state.description);

    this.setState({ ...this.state, registerDialogOpen: false });
  }

  handleRegistClose(e) {
    this.setState({ ...this.state, registerDialogOpen: false });
  }

  handleOpenDialogClick(e) {
    this.setState({ ...this.state, registerDialogOpen: true });
  }
}

export default withTracker(() => {
  let schedules;
  if (Meteor.subscribe('schedules').ready()) {
    schedules = Schedules.find({}, { sort: [["executionDate", "desc"], ["createAt", "desc"]] }).fetch();
  }

  return { schedules };
})(withStyles(styles)(ScheduleList));
