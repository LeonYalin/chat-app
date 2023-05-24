import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

type Props = {
  open: boolean;
  title: string;
  content: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onClose?: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
};

export function ConfirmDialog(props: Props) {
  return (
    <Dialog open={props.open} onClose={props.onClose} aria-labelledby="confirm-dialog-title" aria-describedby="confirm-dialog-description">
      <DialogTitle id="confirm-dialog-title">{props.title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="confirm-dialog-description">{props.content}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={props.onCancel}>{props.cancelButtonText || 'Cancel'}</Button>
        <Button onClick={props.onConfirm} autoFocus>
          {props.confirmButtonText || 'OK'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
