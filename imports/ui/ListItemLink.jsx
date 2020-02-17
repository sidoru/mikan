import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {Link } from 'react-router-dom';

import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

export default ListItemLink = (props) => {
  const { icon, primary, to, onClick, selected } = props;
  
  const renderLink = React.useMemo(
    () => React.forwardRef((itemProps, ref) => <Link to={to} ref={ref} {...itemProps} />),
    [to],
  );

  return (
    <li>
      <ListItem button
        component={renderLink}
        onClick={onClick}
        selected={selected}>
        {icon ? <ListItemIcon style={{ color: '#FFFFFF' }}>{icon}</ListItemIcon> : null}
        <ListItemText primary={<Typography style={{ color: '#FFFFFF' }}>{primary}</Typography>} />
      </ListItem>
    </li>
  );
}
