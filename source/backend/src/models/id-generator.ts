import { randomUUID } from 'crypto';

export interface IDGenerator {
  generate(): string;
}

//Generates UUIDv4 IDs for globally unique file identification.

export class UUIDGenerator implements IDGenerator {
  generate(): string {
    return randomUUID();
  }
}

export class CounterGenerator implements IDGenerator {
  private count: number;
  constructor() {
    this.count = 0;
  }
  /**
   * It will generate ID sequentially, starting from `1` and incrementing by 1 each time.
   * @returns ID (e.g. `1`, `2` ... `100`)
   */
  generate(): string {
    this.count++;
    return this.count.toString();
  }
  /** resets the counter back to zero so the next generated ID will be `'1'`. */
  reset(): void {
    this.count = 0;
  }
  /**
   * advances the counter so the next generated ID equals `index`.
   * @param index - the next value that `generate()` should return.
   */
  startFrom(index: number): void {
    this.count = index - 1;
  }
}
