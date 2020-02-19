import React, { Component } from 'react'

import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Link from '@material-ui/core/Link';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { withStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import Alert from '@material-ui/lab/Alert';
import Collapse from '@material-ui/core/Collapse';


const styles = theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  message: {
    width: '100%',
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: null
    };
    
    if (Meteor.userId() !== null) {
      console.log("ログイン済みなので飛ばす");
      //this.props.history.push("/");
    }
    console.log(this.props.history);
  }

  handleSubmit(e) {
    e.preventDefault();

    let username = document.getElementById('username').value;
    let password = document.getElementById('password').value;

    Meteor.loginWithPassword(username, password, err => {
      if (err) {
        this.setState({ ...this.state, error: err.reason });
      } else {
        let referer = "/";
        const locationState = this.props.history.location.state;
        console.log("IM LOCATION", locationState);
        if(locationState){
          referer = locationState.referrer ? locationState.referrer : "/";
        }
        
        console.log("ログインしたので帰る", referer);
        this.props.history.push(referer);
      }
    });
  }

  render() {
    const { classes } = this.props;

    const Copyright = props => {
      return (
        <Typography variant="body2" color="textSecondary" align="center">
          {'Copyright © '}
          <Link color="inherit" href="https://mikan-box.da.yo/">
            mikan-box.da.yo
          </Link>{' '}
          {new Date().getFullYear()}
          {'.'}
        </Typography>
      );
    };

    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form className={classes.form} noValidate onSubmit={e => this.handleSubmit(e)}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="username"
              label="UserName"
              name="username"
              autoFocus
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
            >
              Box In
            </Button>
          </form>
          <Collapse in={this.state.error !== null} className={classes.message}>
            <Alert severity="error">{this.state.error}</Alert>
          </Collapse>
        </div>
        <Box mt={8}>
          <Copyright />
        </Box>
      </Container>
    );
  }
}
export default withStyles(styles)(Login);