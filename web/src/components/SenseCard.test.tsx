import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { SenseCard } from './SenseCard';
import type { Sense } from '../api/types';

describe('SenseCard', () => {
  const sampleSense: Sense = {
    id: 'sense_test_1',
    translation_ru: 'бежать',
    synonyms_ru: ['мчаться', 'нестись'],
    meanings_en: ['move fast using legs'],
    examples: [{ en: 'She runs every morning.', ru: 'Она бегает каждое утро.' }],
    saved: false,
  };

  it('renders translation, synonyms, meanings, and examples', () => {
    render(<SenseCard sense={sampleSense} onSave={vi.fn()} />);

    expect(screen.getByText('бежать')).toBeInTheDocument();
    expect(screen.getByText('(мчаться, нестись)')).toBeInTheDocument();
    expect(screen.getByText('move fast using legs')).toBeInTheDocument();
    expect(screen.getByText('She runs every morning.')).toBeInTheDocument();
    expect(screen.getByText('Она бегает каждое утро.')).toBeInTheDocument();
  });

  it('renders Save button when not saved and triggers onSave callback', () => {
    const handleSave = vi.fn();
    render(<SenseCard sense={sampleSense} onSave={handleSave} />);

    const saveBtn = screen.getByRole('button', { name: /save/i });
    expect(saveBtn).toBeInTheDocument();

    fireEvent.click(saveBtn);
    expect(handleSave).toHaveBeenCalledWith('sense_test_1');
  });

  it('renders Saved badge when sense is saved', () => {
    const savedSense = { ...sampleSense, saved: true };
    render(<SenseCard sense={savedSense} onSave={vi.fn()} />);

    expect(screen.getByText('Saved')).toBeInTheDocument();
    expect(screen.queryByRole('button', { name: /save/i })).not.toBeInTheDocument();
  });
});
