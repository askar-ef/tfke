import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Routes, Route } from 'react-router-dom';

vi.mock('../lib/api', () => ({ api: { get: vi.fn() } }));
vi.mock('../lib/webcrypto', () => ({ decryptPayload: vi.fn() }));

import { api } from '../lib/api';
import { decryptPayload } from '../lib/webcrypto';
import EphemeralView from './EphemeralView';

function renderView() {
  return render(
    <MemoryRouter initialEntries={['/p/tok123']}>
      <Routes>
        <Route path="/p/:token" element={<EphemeralView />} />
      </Routes>
    </MemoryRouter>,
  );
}

describe('EphemeralView', () => {
  beforeEach(() => {
    window.location.hash = '';
    vi.clearAllMocks();
  });
  afterEach(() => {
    window.location.hash = '';
  });

  it('shows a broken-link state and makes NO API call when the fragment is missing', async () => {
    renderView();
    expect(await screen.findByText(/incomplete or broken/i)).toBeInTheDocument();
    expect(api.get).not.toHaveBeenCalled();
  });

  it('shows an expired state on 410 (gone)', async () => {
    window.location.hash = '#thekey';
    api.get.mockRejectedValue({ kind: 'gone' });
    renderView();
    expect(await screen.findByText(/has expired/i)).toBeInTheDocument();
    expect(screen.getByText(/create your own/i)).toBeInTheDocument();
  });

  it('shows a not-found state on 404', async () => {
    window.location.hash = '#thekey';
    api.get.mockRejectedValue({ kind: 'notFound' });
    renderView();
    expect(await screen.findByText(/doesn.t exist/i)).toBeInTheDocument();
  });

  it('decrypts and renders fields, then strips the fragment', async () => {
    window.location.hash = '#thekey';
    const replaceSpy = vi.spyOn(window.history, 'replaceState');
    api.get.mockResolvedValue({ blob: 'BASE64BLOB' });
    decryptPayload.mockResolvedValue({
      displayName: 'Askar',
      infos: [{ platformId: 'bca', value: '1234567890', accountName: 'Askar E' }],
    });
    renderView();
    expect(await screen.findByTestId('ephemeral-view')).toBeInTheDocument();
    expect(screen.getByText('Askar')).toBeInTheDocument();
    expect(screen.getByText('1234567890')).toBeInTheDocument();
    expect(decryptPayload).toHaveBeenCalledWith('BASE64BLOB', 'thekey');
    expect(replaceSpy).toHaveBeenCalled(); // fragment stripped after decrypt
  });

  it('shows a decrypt-failed state when the key is wrong/tampered', async () => {
    window.location.hash = '#wrongkey';
    api.get.mockResolvedValue({ blob: 'BASE64BLOB' });
    decryptPayload.mockRejectedValue(new Error('OperationError'));
    renderView();
    expect(await screen.findByText(/can.t be opened/i)).toBeInTheDocument();
  });
});
