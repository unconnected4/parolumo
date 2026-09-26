import { describe, it, expect } from 'vitest';
import { lookup, listCards, saveCard, deleteCard, getMe, login, logout, register } from './client';

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

  it('isolates saved cards and saved flag between different users', async () => {
    // User 1 has the seeded card "run"
    const user1Cards = await listCards();
    expect(user1Cards.length).toBe(1);
    expect(user1Cards[0].lemma).toBe('run');

    // Register User 2
    await register({ email: 'user2@example.com', password: 'secret123' });
    const user2Cards = await listCards();
    expect(user2Cards).toEqual([]);

    // Senses for User 2 show saved: false
    const lookupResUser2 = await lookup('run');
    expect(lookupResUser2.lexemes[0].senses[0].saved).toBe(false);

    // User 2 saves bank
    await saveCard('sense_bank_n_1');
    const user2Updated = await listCards();
    expect(user2Updated.length).toBe(1);
    expect(user2Updated[0].lemma).toBe('bank');

    // Log back in as User 1
    await login({ email: 'learner@example.com', password: 'pwd' });
    const user1After = await listCards();
    expect(user1After.length).toBe(1);
    expect(user1After[0].lemma).toBe('run');
  });
});
