import { type DecoderPlugin } from '../../decoders/types';

export class Base64Decoder implements DecoderPlugin {
  id = 'base64';
  name = 'Base64';

  checkString(input: string): number {
    if (/^[a-zA-Z0-9+/=\n]+$/.test(input)) {
      return Math.min(98, 20 + input.length * 5);
    }
    if (/^[a-zA-Z0-9-_=\n]+$/.test(input)) {
      return Math.min(98, 20 + input.length * 5);
    }

    return 0;
  }

  decode(input: string): string {
    const base64 = input.replace(/-_\n/g, (char) =>
      char === '-' ? '+' : char === '_' ? '/' : '',
    );

    return new TextDecoder().decode(
      Uint8Array.from(atob(base64), (c) => c.charCodeAt(0)),
    );
  }

  encode(input: string): string {
    return btoa(
      new TextEncoder()
        .encode(input)
        .reduce((data, byte) => data + String.fromCharCode(byte), ''),
    );
  }
}
