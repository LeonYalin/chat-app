import { renderHook, waitFor } from '@testing-library/react';
import { AppDialogsProvider, useDialog } from './useDialog';
import { act } from 'react-dom/test-utils';
import { JSXElementConstructor } from 'react';

type WrapperEl =
  | JSXElementConstructor<{
      children: React.ReactNode;
    }>
  | undefined;

describe('useConfirm', () => {
  it('should provide the confirm dialog API', () => {
    const wrapper: WrapperEl = ({ children }) => <AppDialogsProvider>{children}</AppDialogsProvider>;
    const { result } = renderHook(() => useDialog(), { wrapper });

    expect(result.current.confirm.show).toBeDefined();
    expect(result.current.confirm.close).toBeDefined();
    expect(result.current.confirm.getState).toBeDefined();
  });

  it('should update the state when showConfirm is called', async () => {
    const wrapper: WrapperEl = ({ children }) => <AppDialogsProvider>{children}</AppDialogsProvider>;
    const { result } = renderHook(() => useDialog(), { wrapper });

    act(() => {
      result.current.confirm.show({
        title: 'Confirmation',
        content: 'Are you sure?',
      });
    });

    await waitFor(() => {
      expect(result.current.confirm.getState().open).toBe(true);
      expect(result.current.confirm.getState().title).toBe('Confirmation');
      expect(result.current.confirm.getState().content).toBe('Are you sure?');
    });
  });

  it('should update the state when closeConfirm is called', async () => {
    const wrapper: WrapperEl = ({ children }) => <AppDialogsProvider>{children}</AppDialogsProvider>;
    const { result } = renderHook(() => useDialog(), { wrapper });
    const confirm = result.current.confirm;

    act(() => {
      confirm.close();
    });
    await waitFor(() => {
      expect(confirm.getState().open).toBe(false);
    });
  });
});
