import { UUIDGenerator } from './id-generator';

describe('UUIDGenerator', () => {
  test('generate() returns a string', () => {
    const generator = new UUIDGenerator();
    const id = generator.generate();
    expect(typeof id).toBe('string');
  });

  test('generate() returns a valid UUIDv4 format', () => {
    const generator = new UUIDGenerator();
    const id = generator.generate();
    expect(id).toMatch(
      /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/
    );
  });

  test('generate() returns different IDs each time', () => {
    const generator = new UUIDGenerator();
    const id1 = generator.generate();
    const id2 = generator.generate();
    expect(id1).not.toBe(id2);
  });
});
