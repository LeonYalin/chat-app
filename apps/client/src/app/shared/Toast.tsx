import { ToastOptions } from '@client/hooks/useDialog';
import { Alert, Snackbar, Stack, Typography } from '@mui/material';
import MuiAlert, { AlertProps } from '@mui/material/Alert';
import { forwardRef } from 'react';

export default function Toast(props: ToastOptions) {
  const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    console.log('handleClose', event, reason);
    if (reason === 'clickaway') {
      return;
    }

    props.onClose?.();
  };
  return (
    <Stack spacing={2} sx={{ width: '100%' }}>
      <Snackbar
        open={props.open ?? false}
        autoHideDuration={props.autoHideDuration ?? 6000}
        onClose={handleClose}
        action={props.action ?? null}
        onClick={props.onClick ?? undefined}
      >
        <AppAlert onClose={handleClose} severity={props.severity ?? 'info'} sx={{ width: '100%' }}>
          <Typography variant="body1">{props.title ?? 'Success!'}</Typography>
          <Typography variant="body2" color="lightgrey">
            {props.message ?? null}
          </Typography>
        </AppAlert>
      </Snackbar>
    </Stack>
  );
}

const AppAlert = forwardRef<HTMLDivElement, AlertProps>(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
