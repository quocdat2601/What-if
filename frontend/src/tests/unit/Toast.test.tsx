import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Toast, { ToastType, ToastProps } from '../../components/Toast';

describe('Toast Component', () => {
  const defaultProps: ToastProps = {
    message: 'Test message',
    type: 'success',
    onClose: vi.fn(),
    isVisible: true
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render toast with correct message', () => {
    render(<Toast {...defaultProps} />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('should render different toast types with correct styling', () => {
    const { rerender } = render(<Toast {...defaultProps} type="success" />);
    let toast = screen.getByRole('alert');
    expect(toast).toHaveClass('bg-green-500', 'border-green-600');

    rerender(<Toast {...defaultProps} type="error" />);
    toast = screen.getByRole('alert');
    expect(toast).toHaveClass('bg-red-500', 'border-red-600');

    rerender(<Toast {...defaultProps} type="warning" />);
    toast = screen.getByRole('alert');
    expect(toast).toHaveClass('bg-yellow-500', 'border-yellow-600');

    rerender(<Toast {...defaultProps} type="info" />);
    toast = screen.getByRole('alert');
    expect(toast).toHaveClass('bg-blue-500', 'border-blue-600');
  });

  it('should call onClose when close button is clicked', async () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    render(<Toast {...defaultProps} onClose={onClose} />);
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    fireEvent.click(closeButton);

    // Wait for animation to complete
    vi.advanceTimersByTime(300);
    
    expect(onClose).toHaveBeenCalledTimes(1);
    vi.useRealTimers();
  });

  it('should render close button with correct accessibility', () => {
    render(<Toast {...defaultProps} />);
    
    const closeButton = screen.getByRole('button', { name: /close/i });
    expect(closeButton).toHaveAttribute('aria-label', 'Close');
  });

  it('should apply correct animation classes', () => {
    render(<Toast {...defaultProps} />);
    
    const toast = screen.getByRole('alert');
    expect(toast).toHaveClass('transform', 'transition-all', 'duration-300', 'ease-in-out');
  });

  it('should not render when isVisible is false', () => {
    render(<Toast {...defaultProps} isVisible={false} />);
    
    expect(screen.queryByText('Test message')).not.toBeInTheDocument();
  });
}); 