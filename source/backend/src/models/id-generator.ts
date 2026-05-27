export interface IDGenerator {
  generate(): string;
}

export class TimestampIDGenerator implements IDGenerator {
  private counter = 0;
  generate(): string {
    this.counter++;
    return `${Date.now()}-${this.counter}`;
  }
}
