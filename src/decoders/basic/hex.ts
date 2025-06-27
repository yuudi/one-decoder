import { type DecoderPlugin } from '../decoder';

export class HexDecoder implements DecoderPlugin {
  name = '16进制';

  checkString(input: string): number {
    if (input.length % 2 === 0 && /^[a-fA-F0-9]+$/.test(input)) {
      return 99;
    }

    return 0; // Low score for other cases
  }

  decode(input: string): string {
    return decodeURIComponent('%' + input.match(/../g)?.join('%'));
  }

  encode(input: string): string {
    return encodeURIComponent(input).replace(/%/g, '').toLowerCase();
  }
}
