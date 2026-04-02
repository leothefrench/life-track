import { RegisterSchema } from '@life-track/shared';

describe('Validation du compte (RegisterSchema)', () => {
  test('Devrait accepter un compte valide', () => {
    const result = RegisterSchema.safeParse({
      name: 'Léo',
      email: 'leo@test.com',
      password: 'Password123!',
    });
    expect(result.success).toBe(true);
  });

  test('Devrait refuser un mot de passe trop court', () => {
    const result = RegisterSchema.safeParse({
      name: 'Léo',
      email: 'leo@test.com',
      password: '123',
    });
    expect(result.success).toBe(false);
  });

  test('Devrait refuser un email mal formé', () => {
    const result = RegisterSchema.safeParse({
      name: 'Léo',
      email: 'pas-un-email',
      password: 'Password123!',
    });
    expect(result.success).toBe(false);
  });
});
