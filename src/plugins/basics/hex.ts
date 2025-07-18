import { Plugin } from '../../decoders/decorators';

@Plugin({ id: 'hex', name: '16进制' })
export class HexDecoder {
  checkString(input: string) {
    if (input.length % 2 === 0 && /^[a-fA-F0-9]+$/.test(input)) {
      return Math.min(98, 10 + input.length * 10);
    }

    if (/^(?:\\x[a-fA-F0-9]{2})+$/.test(input)) {
      return Math.min(98, 10 + input.length * 10);
    }

    return 0;
  }

  decode(input: string): string {
    if (input.startsWith('\\x')) {
      input = input.replace(/\\x/g, '');
    }
    const bytes = [];
    for (let i = 0; i < input.length; i += 2) {
      bytes.push(parseInt(input.slice(i, i + 2), 16));
    }
    const uint8Array = new Uint8Array(bytes);
    return new TextDecoder('utf-8').decode(uint8Array);
  }

  encode(input: string): string {
    const encoder = new TextEncoder();
    const uint8Array = encoder.encode(input);
    return Array.from(uint8Array)
      .map((byte) => byte.toString(16).padStart(2, '0'))
      .join('');
  }
}
