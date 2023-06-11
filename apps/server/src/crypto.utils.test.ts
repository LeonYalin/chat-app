import { comparePasswordAndHash, hashPassword } from './crypto.utils';

describe('Crypto utils tests', () => {
  beforeEach(async () => {
    jest.clearAllMocks();
  });

  test('should test hashPassword and comparePasswordAndHash', async () => {
    const password = '123456';
    const hash = await hashPassword(password);

    expect(hash).toBeDefined();
    expect(hash).not.toEqual(password);

    const compare = await comparePasswordAndHash(password, hash);
    expect(compare).toBeTruthy();
  });
});
