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
  generate(): string {
    this.count++;
    return this.count.toString();
  }
}
export const counterGenerator = new CounterGenerator();
