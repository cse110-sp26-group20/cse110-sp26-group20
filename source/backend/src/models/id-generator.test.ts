import { TimestampIDGenerator } from './id-generator';

describe('TimestampIDGenerator', () => {
  test('generate() returns a string', () => {
    const generator = new TimestampIDGenerator();
    const id = generator.generate();
    expect(typeof id).toBe('string');
  });

  test('generate() returns an ID with timestamp-counter format', () => {
    const generator = new TimestampIDGenerator();
    const id = generator.generate();
    expect(id).toMatch(/^\d+-\d+$/);
  });

  test('generate() returns different IDs each time', () => {
    const generator = new TimestampIDGenerator();
    const id1 = generator.generate();
    const id2 = generator.generate();
    expect(id1).not.toBe(id2);
  });

  test('counter increases each time generate() is called', () => {
    const generator = new TimestampIDGenerator();
    const id1 = generator.generate();
    const id2 = generator.generate();
    const counter1 = Number(id1.split('-')[1]);
    const counter2 = Number(id2.split('-')[1]);
    expect(counter2).toBe(counter1 + 1);
  });
});
