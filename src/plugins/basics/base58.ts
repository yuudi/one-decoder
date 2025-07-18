import bs58 from 'bs58';
import { Plugin } from '../../decoders/decorators';

@Plugin({ id: 'base58', name: 'Base58' })
export class Base58Decoder {
  checkString(input: string): number {
    if (/^[A-HJ-NP-Za-km-z1-9]+$/.test(input)) {
      return Math.min(90, 10 + input.length * 4);
    }

    return 0;
  }

  decode(input: string): string {
    const decoded = bs58.decode(input);
    return new TextDecoder().decode(decoded);
  }

  encode(input: string): string {
    return bs58.encode(new TextEncoder().encode(input));
  }
}
