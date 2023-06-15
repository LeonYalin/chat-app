import { MouseEventHandler, createContext, useContext, useState } from 'react';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { noop } from '../utils/app.utils';
import Toast from '@client/shared/Toast';
import { AlertColor } from '@mui/material';

interface AppDialogsApi {
  confirm: ConfirmDialogApi;
  toast: ToastApi;
}

export interface ToastOptions {
  open?: boolean;
  severity?: AlertColor;
  autoHideDuration?: number;
  title?: string;
  message?: string;
  action?: React.ReactNode;
  onClick?: MouseEventHandler<HTMLDivElement> | undefined;
  onClose?: () => void;
}

interface ToastApi {
  show: (data: ToastOptions) => void;
  getState(): ToastOptions;
}

export interface ConfirmDialogOptions {
  open?: boolean;
  title?: string;
  content?: string;
  confirmButtonText?: string;
  cancelButtonText?: string;
  onClose?: () => void;
  onConfirm?: () => void;
  onCancel?: () => void;
}

interface ConfirmDialogApi {
  show: (data: ConfirmDialogOptions) => void;
  close: () => void;
  getState(): ConfirmDialogOptions;
}

const defaultDialogsApi: AppDialogsApi = {
  confirm: {
    show: noop,
    close: noop,
    getState: () => ({} as ConfirmDialogOptions),
  },
  toast: {
    show: noop,
    getState: () => ({} as ToastOptions),
  },
};

const AppDialogsCtx = createContext<AppDialogsApi>(defaultDialogsApi);

type Props = {
  children: React.ReactNode;
};

export function AppDialogsProvider(props: Props) {
  const [confirmDialogState, setConfirmDialogState] = useState<ConfirmDialogOptions>({ open: false });
  const [toastState, setToastState] = useState<ToastOptions>({ open: false });

  const confirm: ConfirmDialogApi = {
    show: (data: ConfirmDialogOptions) => {
      setConfirmDialogState({
        ...data,
        open: true,
        onClose: () => {
          data.onClose?.();
          setConfirmDialogState({
            open: false,
          });
        },
        onCancel: () => {
          data.onCancel?.();
          setConfirmDialogState({
            open: false,
          });
        },
        onConfirm: () => {
          data.onConfirm?.();
          setConfirmDialogState({
            open: false,
          });
        },
      });
    },
    close: () => {
      setConfirmDialogState({
        open: false,
      });
    },
    getState: () => {
      return confirmDialogState;
    },
  };

  const toast: ToastApi = {
    show: (data: ToastOptions) => {
      setToastState({
        ...data,
        open: true,
        onClose: () => {
          data.onClose?.();
          setToastState({
            open: false,
          });
        },
      });
    },
    getState: () => {
      return toastState;
    },
  };

  const dialogsApi = {
    confirm,
    toast,
  };

  return (
    <AppDialogsCtx.Provider value={dialogsApi}>
      {props.children}
      <ConfirmDialog {...confirmDialogState}></ConfirmDialog>
      <Toast {...toastState}></Toast>
    </AppDialogsCtx.Provider>
  );
}

export function useDialog() {
  return useContext(AppDialogsCtx);
}
