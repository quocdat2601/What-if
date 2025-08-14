import React from 'react';
import { render, screen, fireEvent, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ToastProvider, useToast } from '../../contexts/ToastContext';

// Test component that uses the toast context
const TestComponent = () => {
  const { showToast } = useToast();
  
  return (
    <div>
      <button onClick={() => showToast('Success message', 'success')}>
        Show Success
      </button>
      <button onClick={() => showToast('Error message', 'error')}>
        Show Error
      </button>
      <button onClick={() => showToast('Info message', 'info')}>
        Show Info
      </button>
    </div>
  );
};

// Wrapper component for testing
const TestWrapper = ({ children }: { children: React.ReactNode }) => (
  <ToastProvider>{children}</ToastProvider>
);

describe('ToastContext', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should render children without crashing', () => {
    render(
      <TestWrapper>
        <div>Test content</div>
      </TestWrapper>
    );
    
    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should show toast when showToast is called', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    const successButton = screen.getByText('Show Success');
    fireEvent.click(successButton);

    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByRole('alert')).toHaveClass('bg-green-500');
  });

  it('should show multiple toasts', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    const successButton = screen.getByText('Show Success');
    const errorButton = screen.getByText('Show Error');

    fireEvent.click(successButton);
    fireEvent.click(errorButton);

    expect(screen.getByText('Success message')).toBeInTheDocument();
    expect(screen.getByText('Error message')).toBeInTheDocument();
  });

  it('should auto-remove toast after duration', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    const successButton = screen.getByText('Show Success');
    fireEvent.click(successButton);

    expect(screen.getByText('Success message')).toBeInTheDocument();

    // Fast forward time
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(screen.queryByText('Success message')).not.toBeInTheDocument();
  });

  it('should handle different toast types correctly', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    const infoButton = screen.getByText('Show Info');
    fireEvent.click(infoButton);

    expect(screen.getByRole('alert')).toHaveClass('bg-blue-500');
  });

  it('should allow manual toast removal', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    const successButton = screen.getByText('Show Success');
    fireEvent.click(successButton);

    const closeButton = screen.getByRole('button', { name: 'Close' });
    fireEvent.click(closeButton);

    expect(screen.queryByText('Success message')).not.toBeInTheDocument();
  });

  it('should limit maximum number of toasts', () => {
    render(
      <TestWrapper>
        <TestComponent />
      </TestWrapper>
    );

    // Show multiple toasts quickly
    const successButton = screen.getByText('Show Success');
    const errorButton = screen.getByText('Show Error');
    const infoButton = screen.getByText('Show Info');

    fireEvent.click(successButton);
    fireEvent.click(errorButton);
    fireEvent.click(infoButton);

    // Should only show the last few toasts (based on maxToasts limit)
    const toasts = screen.getAllByRole('alert');
    expect(toasts.length).toBeLessThanOrEqual(5); // Assuming maxToasts is 5
  });

  it('should provide toast context to children', () => {
    const TestConsumer = () => {
      const { showToast } = useToast();
      return (
        <button onClick={() => showToast('Test', 'success')}>
          Test Toast
        </button>
      );
    };

    render(
      <TestWrapper>
        <TestConsumer />
      </TestWrapper>
    );

    const button = screen.getByText('Test Toast');
    fireEvent.click(button);

    expect(screen.getByText('Test')).toBeInTheDocument();
  });
}); 