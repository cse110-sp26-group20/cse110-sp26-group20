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
