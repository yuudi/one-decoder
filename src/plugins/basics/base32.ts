import { decode, encode } from 'hi-base32';
import { Plugin } from '../../decoders/decorators';

@Plugin({ id: 'base32', name: 'Base32' })
export class Base32Decoder {
  checkString(input: string): number {
    if (/^[A-Z2-7]+=*$/.test(input)) {
      return Math.min(90, 10 + input.length * 5);
    }

    return 0;
  }

  decode(input: string): string {
    return decode(input);
  }

  encode(input: string): string {
    return encode(input);
  }
}
