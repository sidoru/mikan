import React, { Component } from 'react'
import { useTracker } from 'meteor/react-meteor-data'

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';

import { Schedules } from '../api/collections';
import PositionBoardModel from '../model/PositionBoardModel';

export const useSchedule = (scheduleId) => useTracker(() => {
  const isLoading = !Meteor.subscribe('schedule', { scheduleId }).ready();
  const schedule = Schedules.findOne({ _id: scheduleId });

  return { schedule, isLoading };
}, [scheduleId]);

export default function (props) {
  const { scheduleId } = props.match.params;
  const { schedule, isLoading } = useSchedule(scheduleId);

  console.log(scheduleId, isLoading, schedule);

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      {schedule}
    </Container>
  );
}