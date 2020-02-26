import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import { useTheme } from '@material-ui/core/styles';

// 以下のやつを中身propに変えただけ
// https://material-ui.com/components/dialogs/
export default function ResponsiveDialog({title, content, doneCaption, cancelCaption, open, onDone, onClose, ...other}) {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));

  return (
      <Dialog
        {...other}
        fullScreen={fullScreen}
        open={open}
        onClose={onClose}
        aria-labelledby="responsive-dialog-title"
      >
        <DialogTitle id="responsive-dialog-title">{title || ""}</DialogTitle>
        <DialogContent　dividers>
            {content || ""}
        </DialogContent>
        <DialogActions>
          {
            (onDone === null) ? null:
            <Button autoFocus onClick={onDone} color="primary">
            {doneCaption || ""}
            </Button>
          }
          <Button onClick={onClose} color="primary" autoFocus>
            {cancelCaption || "キャンセル"}
          </Button>
        </DialogActions>
      </Dialog>
  );
}
