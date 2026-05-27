import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import EphemeralSuccess from './EphemeralSuccess';

const LINK = 'https://tfke.id/p/abc123#SECRETKEY';

describe('EphemeralSuccess', () => {
  beforeEach(() => {
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText: vi.fn().mockResolvedValue(undefined) },
    });
  });

  it('shows the full link including the #fragment', () => {
    render(<EphemeralSuccess link={LINK} onDone={() => {}} />);
    expect(screen.getByTestId('share-link').value).toBe(LINK);
  });

  it('copies the FULL link (with fragment) to the clipboard', async () => {
    render(<EphemeralSuccess link={LINK} onDone={() => {}} />);
    fireEvent.click(screen.getByText('Copy link'));
    expect(navigator.clipboard.writeText).toHaveBeenCalledWith(LINK);
  });

  it('gates Done behind the "I\'ve saved my link" confirmation', () => {
    const onDone = vi.fn();
    render(<EphemeralSuccess link={LINK} onDone={onDone} />);
    const done = screen.getByText('Done');
    expect(done).toBeDisabled();
    fireEvent.click(done);
    expect(onDone).not.toHaveBeenCalled();

    fireEvent.click(screen.getByLabelText(/saved my link/i));
    expect(done).not.toBeDisabled();
    fireEvent.click(done);
    expect(onDone).toHaveBeenCalledTimes(1);
  });
});
