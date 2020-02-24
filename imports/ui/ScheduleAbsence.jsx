import React, { useMemo } from 'react'
import { withTracker } from 'meteor/react-meteor-data'

import { makeStyles } from '@material-ui/core/styles';
import FormLabel from '@material-ui/core/FormLabel';
import FormControl from '@material-ui/core/FormControl';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';

import { Schedules } from '../api/collections';
import PositionBoardModel from '../model/PositionBoardModel';
import PlayerRepository from '../repositories/PlayerRepository';
import { TextField } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex',
  },
  formControl: {
    margin: theme.spacing(3),
  },
}));

function ScheduleAbsence(props) {
  const { schedule } = props;
  if (schedule == null) {
    return (<div></div>);
  }

  const classes = useStyles();

  const players = useMemo(() => {
    const playerPepos = new PlayerRepository();
    return playerPepos.getPlayers();
  }, []);

  //const model = useRef(new PositionBoardModel()).current;
  //model.applySchedule(schedule);

  const [checkedStates, setCheckedStates] = React.useState(players.map(p => p.isEntry));
  const [comments, setComments] = React.useState(players.map(p => p.comment));
  console.log(checkedStates);
  const handleChange = index => event => {
    setCheckedStates({ ...checkedStates, [index]: event.target.checked });
  };

  return (
    <Grid>
      {schedule.executionDate.toString()}

      <Grid container justify="center" direction="column" >
        {
          players.map((player, index) =>
          <Grid key={player.Id}>
            <FormControlLabel
              label={player.name}
              control={
                <Checkbox                  
                
                  checked={checkedStates[index]}
                  onChange={handleChange(index)} />
              }
            />
            <TextField  width="200px"/>
            </Grid>
          )
        }
        </Grid>
    </Grid>
  );
}
export default withTracker(props => {
  const { params } = props.match;

  let schedule;
  if (Meteor.subscribe('schedule', params.scheduleId).ready()) {
    schedule = Schedules.findOne({ _id: params.scheduleId });
  }

  return { schedule };
})(ScheduleAbsence);