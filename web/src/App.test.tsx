import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach } from 'vitest';
import { http, HttpResponse } from 'msw';
import App from './App';
import { logout } from './api';
import { server } from './test/setup';

describe('Paralumo App', () => {
  beforeEach(() => {
    window.history.pushState({}, '', '/');
  });

  it('renders search view by default with header and initial search results', async () => {
    render(<App />);

    expect(screen.getByText('Paralumo')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /search/i })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /my words/i })).toBeInTheDocument();

    // Default query "run" loads
    await waitFor(() => {
      expect(screen.getByText('бежать')).toBeInTheDocument();
    });
  });

  it('allows searching for another word like "bank"', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText(/search an english word/i);
    await user.clear(input);
    await user.type(input, 'bank');
    await user.click(screen.getByRole('button', { name: /^search$/i }));

    await waitFor(() => {
      expect(screen.getByText('банк')).toBeInTheDocument();
      expect(screen.getByText('берег')).toBeInTheDocument();
    });
  });

  it('navigates to My Words page and displays saved cards', async () => {
    const user = userEvent.setup();
    render(<App />);

    const myWordsLink = screen.getByRole('link', { name: /my words/i });
    await user.click(myWordsLink);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: /my words/i })).toBeInTheDocument();
      expect(screen.getByText('Personal vocabulary deck saved with per-sense precision.')).toBeInTheDocument();
    });
  });

  it('shows "Word not found" when the lookup answers 404', async () => {
    window.history.pushState({}, '', '/?q=zzzz');
    render(<App />);

    expect(await screen.findByText('Word not found')).toBeInTheDocument();
  });

  it('shows "Lookup failed", not "Word not found", when the lookup fails for another reason', async () => {
    server.use(
      http.get('/api/dictionary/lookup', () =>
        HttpResponse.json({ detail: 'Dictionary provider unavailable' }, { status: 502 })
      )
    );
    render(<App />);

    expect(await screen.findByText('Lookup failed', {}, { timeout: 5000 })).toBeInTheDocument();
    expect(screen.queryByText('Word not found')).not.toBeInTheDocument();
  });

  it('sends a signed-out user from My Words to sign in', async () => {
    await logout();
    window.history.pushState({}, '', '/my-words');
    render(<App />);

    expect(await screen.findByPlaceholderText('you@example.com')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /my words/i })).not.toBeInTheDocument();
  });

  it('sends a signed-out user who clicks Save to sign in', async () => {
    const user = userEvent.setup();
    await logout();
    render(<App />);

    const saveButtons = await screen.findAllByRole('button', { name: /^save$/i });
    await user.click(saveButtons[0]);

    expect(await screen.findByPlaceholderText('you@example.com')).toBeInTheDocument();
  });

  it('does not show mock-only labels in the UI', async () => {
    render(<App />);
    await screen.findByText('бежать');

    expect(screen.queryByText(/mock/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/msw/i)).not.toBeInTheDocument();
  });
});
