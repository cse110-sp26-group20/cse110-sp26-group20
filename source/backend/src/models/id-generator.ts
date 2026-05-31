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
  count: number;
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
}
