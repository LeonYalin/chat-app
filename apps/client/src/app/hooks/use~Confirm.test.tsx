import { renderHook } from '@testing-library/react';
import { ConfirmDialogProvider, useConfirm } from './useConfirm';
import { act } from 'react-dom/test-utils';
import { JSXElementConstructor, ReactElement } from 'react';

type WrapperEl =
  | JSXElementConstructor<{
      children: ReactElement<any, string | JSXElementConstructor<any>>;
    }>
  | undefined;

describe('useConfirm', () => {
  it('should provide the confirm dialog API', () => {
    const wrapper: WrapperEl = ({ children }) => <ConfirmDialogProvider>{children}</ConfirmDialogProvider>;

    const { result } = renderHook(() => useConfirm(), { wrapper });

    expect(result.current.showConfirm).toBeDefined();
    expect(result.current.closeConfirm).toBeDefined();
    expect(result.current.getState).toBeDefined();
  });

  it('should update the state when showConfirm is called', () => {
    const wrapper: WrapperEl = ({ children }) => <ConfirmDialogProvider>{children}</ConfirmDialogProvider>;

    const { result } = renderHook(() => useConfirm(), { wrapper });

    act(() => {
      result.current.showConfirm({
        open: true,
        title: 'Confirmation',
        content: 'Are you sure?',
      });
    });

    expect(result.current.getState().open).toBe(true);
    expect(result.current.getState().title).toBe('Confirmation');
    expect(result.current.getState().content).toBe('Are you sure?');
  });

  it('should update the state when closeConfirm is called', () => {
    const wrapper: WrapperEl = ({ children }) => <ConfirmDialogProvider>{children}</ConfirmDialogProvider>;

    const { result } = renderHook(() => useConfirm(), { wrapper });

    act(() => {
      result.current.closeConfirm();
    });

    expect(result.current.getState().open).toBe(false);
  });
});
