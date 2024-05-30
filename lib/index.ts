export class Cuid {
  public static readonly defaultLength = 24;
  public static readonly bigLength = 32;
  private counter: () => number;
  private fingerprint: Promise<string>;

  public static async create(): Promise<string> {
    const cuid = new Cuid();
    return await cuid.generate();
  }

  public static isCuid(
    id: string,
    minLength: number = 2,
    maxLength: number = Cuid.bigLength,
  ): boolean {
    const length = id.length;
    const regex = /^[0-9a-z]+$/;
    return (
      typeof id === "string" &&
      length >= minLength &&
      length <= maxLength &&
      regex.test(id)
    );
  }

  constructor() {
    this.counter = this.createCounter(Math.floor(Math.random() * 476782367));
    this.fingerprint = this.createFingerprint();
  }

  private createEntropy(length: number = 4): string {
    let entropy = "";
    while (entropy.length < length) {
      entropy += Math.floor(Math.random() * 36).toString(36);
    }
    return entropy;
  }

  private bufToBigInt(buf: Uint8Array): bigint {
    const bits = 8n;
    let value = 0n;
    for (const i of buf.values()) {
      const bi = BigInt(i);
      value = (value << bits) + bi;
    }
    return value;
  }

  private async hash(input: string): Promise<string> {
    const textEncoder = new TextEncoder();
    const digest = new Uint8Array(
      await crypto.subtle.digest("SHA-512", textEncoder.encode(input)),
    );
    return (await this.bufToBigInt(digest)).toString(36).slice(1);
  }

  private randomLetter(): string {
    const alphabet = Array.from(
      { length: 26 },
      (_x, i) => String.fromCharCode(i + 97),
    );
    return alphabet[Math.floor(Math.random() * alphabet.length)];
  }

  private async createFingerprint(): Promise<string> {
    const globals = Object.keys(navigator).toString();
    const sourceString = globals + await this.createEntropy(Cuid.bigLength);
    const hashResult = await this.hash(sourceString);
    return hashResult.substring(0, Cuid.bigLength);
  }

  private createCounter(initialCount: number): () => number {
    let count = initialCount;
    return () => count++;
  }

  public async generate(): Promise<string> {
    const firstLetter = this.randomLetter();
    const time = Date.now().toString(36);
    const count = this.counter().toString(36);
    const salt = await this.createEntropy(Cuid.defaultLength);
    const fingerprint = await this.fingerprint;
    const hashInput = `${time + salt + count + fingerprint}`;
    const hashResult = await this.hash(hashInput);
    return `${firstLetter + hashResult.substring(1, Cuid.defaultLength)}`;
  }
}
