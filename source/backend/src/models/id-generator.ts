export interface IDGenerator {
  generate(): string;
}

export class CounterGenerator implements IDGenerator{
    count: number
    constructor(){
        this.count = 0;
    }
    generate(): string {
        this.count++;
        return this.count.toString();
    }
}