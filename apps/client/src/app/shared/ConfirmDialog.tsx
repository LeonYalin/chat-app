import { ConfirmDialogOptions } from '@client/hooks/useConfirm';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle } from '@mui/material';

export function ConfirmDialog(props: ConfirmDialogOptions) {
  return (
    <Dialog
      data-testid="confirm-dialog"
      open={props.open || false}
      onClose={props.onClose}
      aria-labelledby="confirm-dialog-title"
      aria-describedby="confirm-dialog-description"
    >
      <DialogTitle data-testid="confirm-dialog-title">{props.title || ''}</DialogTitle>
      <DialogContent>
        <DialogContentText data-testid="confirm-dialog-description">{props.content || ''}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button data-testid="confirm-dialog-cancel-btn" onClick={props.onCancel}>
          {props.cancelButtonText || 'Cancel'}
        </Button>
        <Button data-testid="confirm-dialog-confirm-btn" onClick={props.onConfirm} variant="contained" autoFocus>
          {props.confirmButtonText || 'OK'}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
