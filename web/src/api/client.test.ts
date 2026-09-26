import { describe, it, expect } from 'vitest';
import { lookup, listCards, saveCard, deleteCard, getMe, login, logout } from './client';

describe('API client (interim Step 0)', () => {
  it('lookup returns lexemes and senses for known word "run"', async () => {
    const res = await lookup('run');
    expect(res.query).toBe('run');
    expect(res.lexemes.length).toBeGreaterThan(0);

    const verb = res.lexemes.find((l) => l.pos === 'verb');
    expect(verb).toBeDefined();
    expect(verb?.senses[0].translation_ru).toBe('бежать');
  });

  it('lookup handles empty string gracefully', async () => {
    const res = await lookup('   ');
    expect(res.query).toBe('');
    expect(res.lexemes).toEqual([]);
  });

  it('listCards returns saved cards', async () => {
    const cards = await listCards();
    expect(Array.isArray(cards)).toBe(true);
    expect(cards.length).toBeGreaterThan(0);
    expect(cards[0].lemma).toBe('run');
  });

  it('saveCard adds a new card and deleteCard removes it', async () => {
    const newCard = await saveCard('sense_bank_n_1');
    expect(newCard.sense_id).toBe('sense_bank_n_1');
    expect(newCard.lemma).toBe('bank');

    const updated = await listCards();
    expect(updated.some((c) => c.sense_id === 'sense_bank_n_1')).toBe(true);

    await deleteCard(newCard.id);
    const afterDelete = await listCards();
    expect(afterDelete.some((c) => c.sense_id === 'sense_bank_n_1')).toBe(false);
  });

  it('handles auth lifecycle: getMe, logout, login', async () => {
    const initialUser = await getMe();
    expect(initialUser).not.toBeNull();
    expect(initialUser?.email).toBe('learner@example.com');

    await logout();
    const loggedOutUser = await getMe();
    expect(loggedOutUser).toBeNull();

    const loggedInUser = await login({ email: 'new@example.com', password: 'password123' });
    expect(loggedInUser.email).toBe('new@example.com');
  });
});
