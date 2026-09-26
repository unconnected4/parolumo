import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect } from 'vitest';
import App from './App';

describe('Paralumo App', () => {
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
});
