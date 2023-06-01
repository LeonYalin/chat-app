import { createContext, useContext, useState } from 'react';
import { ConfirmDialog } from '../shared/ConfirmDialog';
import { noop } from '../utils/app.utils';

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
  showConfirm: (data: ConfirmDialogOptions) => void;
  closeConfirm: () => void;
  getState(): ConfirmDialogOptions;
}

const defaultDialogApi: ConfirmDialogApi = {
  showConfirm: noop,
  closeConfirm: noop,
  getState: () => ({} as ConfirmDialogOptions),
};

const ConfirmDialogCtx = createContext<ConfirmDialogApi>(defaultDialogApi);

type Props = {
  children: React.ReactNode;
};

export function ConfirmDialogProvider(props: Props) {
  const [state, setState] = useState<ConfirmDialogOptions>({ open: false });

  const confirmApi: ConfirmDialogApi = {
    showConfirm: (data: ConfirmDialogOptions) => {
      setState({
        ...data,
        open: true,
      });
    },
    closeConfirm: () => {
      setState({
        open: false,
      });
    },
    getState: () => {
      return state;
    },
  };

  return (
    <ConfirmDialogCtx.Provider value={confirmApi}>
      {props.children}
      <ConfirmDialog {...state}></ConfirmDialog>
    </ConfirmDialogCtx.Provider>
  );
}

export function useConfirm() {
  return useContext(ConfirmDialogCtx);
}
