import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

export type ConfirmDialogOptions = {
  open?: boolean;
  title?: string;
  content?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onClose?: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export function ConfirmDialog(props: ConfirmDialogOptions) {
  return (
    <Dialog
      open={props.open || false}
      onClose={props.onClose}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <DialogTitle id="confirm-dialog-title">{props.title || ''}</DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-dialog-description">{props.content || ''}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onCancel}>{props.cancelButtonText || 'Cancel'}</Button>
        <Button onClick={props.onConfirm} variant="contained" autoFocus>
          {props.confirmButtonText || 'OK'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
