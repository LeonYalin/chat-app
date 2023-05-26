import { createContext, useContext, useState } from 'react';
import { ConfirmDialog, ConfirmDialogOptions } from '../shared/ConfirmDialog';
import { noop } from '../shared/utils';

type ConfirmDialogApi = [(data: ConfirmDialogOptions) => void, () => void];

const ConfirmDialogCtx = createContext<ConfirmDialogApi>([noop, noop]);

type Props = {
  children: React.ReactNode;
};

export function ConfirmDialogProvider(props: Props) {
  const [state, setState] = useState<ConfirmDialogOptions>({ open: false });
  const confirm = (data: ConfirmDialogOptions) => {
    setState({
      ...data,
      open: true,
    });
  };
  const closeConfirm = () => {
    setState({
      open: false,
    });
  };
  const confirmApi: ConfirmDialogApi = [confirm, closeConfirm];

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
