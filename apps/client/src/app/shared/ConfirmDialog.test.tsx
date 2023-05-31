import { renderWithProviders } from '@client/utils/test-utils';
import { ConfirmDialog } from './ConfirmDialog';
import { fireEvent, screen } from '@testing-library/react';
import { ConfirmDialogOptions } from '@client/hooks/useConfirm';

it('should render successfully', () => {
  const { baseElement } = renderWithProviders(<ConfirmDialog />);
  expect(baseElement).toBeTruthy();
});

it('should render right text and content options, and fire callbacks', () => {
  const options: ConfirmDialogOptions = {
    open: true,
    title: 'Dialog Title',
    content: 'Dialog Content',
    confirmButtonText: 'Confirm text',
    cancelButtonText: 'Cancel text',
    onConfirm: jest.fn(() => {
      /**/
    }),
    onCancel: jest.fn(() => {
      /**/
    }),
    onClose: jest.fn(() => {
      /**/
    }),
  };
  const { baseElement } = renderWithProviders(<ConfirmDialog {...options} />);
  expect(screen.queryByText(String(options.title))).toBeTruthy();
  expect(screen.queryByText(String(options.content))).toBeTruthy();
  expect(screen.queryByText(String(options.confirmButtonText))).toBeTruthy();
  expect(screen.queryByText(String(options.cancelButtonText))).toBeTruthy();

  // Click confirm button
  expect(options.onConfirm).not.toHaveBeenCalled();
  fireEvent.click(screen.getByText(String(options.confirmButtonText)));
  expect(options.onConfirm).toHaveBeenCalled();

  // Click cancel button
  expect(options.onCancel).not.toHaveBeenCalled();
  fireEvent.click(screen.getByText(String(options.cancelButtonText)));
  expect(options.onCancel).toHaveBeenCalled();

  // Click outside
  expect(options.onClose).not.toHaveBeenCalled();
  const mask = baseElement.getElementsByClassName('MuiBackdrop-root').item(0);
  expect(mask).toBeTruthy();
  fireEvent.click(mask as Element);
  expect(options.onClose).toHaveBeenCalled();
});
