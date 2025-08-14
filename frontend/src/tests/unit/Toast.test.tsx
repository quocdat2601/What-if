import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Toast from '../../components/Toast';

describe('Toast Component', () => {
  const defaultProps = {
    message: 'Test message',
    type: 'success' as const,
    onClose: vi.fn(),
    duration: 3000,
    isVisible: true
  };

  it('should render toast with correct message', () => {
    render(<Toast {...defaultProps} />);
    expect(screen.getByText('Test message')).toBeInTheDocument();
  });

  it('should render different toast types with correct styling', () => {
    const { rerender } = render(<Toast {...defaultProps} type="success" />);
    expect(screen.getByRole('alert')).toHaveClass('bg-green-500');

    rerender(<Toast {...defaultProps} type="error" />);
    expect(screen.getByRole('alert')).toHaveClass('bg-red-500');

    rerender(<Toast {...defaultProps} type="warning" />);
    expect(screen.getByRole('alert')).toHaveClass('bg-yellow-500');

    rerender(<Toast {...defaultProps} type="info" />);
    expect(screen.getByRole('alert')).toHaveClass('bg-blue-500');
  });

  it('should call onClose when close button is clicked', () => {
    const onClose = vi.fn();
    render(<Toast {...defaultProps} onClose={onClose} />);
    
    const closeButton = screen.getByRole('button');
    fireEvent.click(closeButton);
    
    expect(onClose).toHaveBeenCalledTimes(1);
  });

  it('should auto-close after duration', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    
    render(<Toast {...defaultProps} onClose={onClose} duration={2000} />);
    
    expect(onClose).not.toHaveBeenCalled();
    
    vi.advanceTimersByTime(2000);
    
    expect(onClose).toHaveBeenCalledTimes(1);
    
    vi.useRealTimers();
  });

  it('should not auto-close if duration is 0', () => {
    vi.useFakeTimers();
    const onClose = vi.fn();
    
    render(<Toast {...defaultProps} onClose={onClose} duration={0} />);
    
    vi.advanceTimersByTime(5000);
    
    expect(onClose).not.toHaveBeenCalled();
    
    vi.useRealTimers();
  });

  it('should render close button with correct accessibility', () => {
    render(<Toast {...defaultProps} />);
    
    const closeButton = screen.getByRole('button');
    expect(closeButton).toHaveAttribute('aria-label', 'Close');
  });

  it('should apply correct animation classes', () => {
    render(<Toast {...defaultProps} />);
    
    const toast = screen.getByRole('alert');
    expect(toast).toHaveClass('animate-in', 'slide-in-from-top-2');
  });
}); 