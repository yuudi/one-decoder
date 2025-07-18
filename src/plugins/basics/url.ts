import { Plugin } from '../../decoders/decorators';

@Plugin({ id: 'url', name: 'URL编码' })
export class UrlDecoder {
  checkString(input: string): number {
    if (/^(?:%[a-fA-F0-9]{2})+$/.test(input)) {
      return 100;
    }
    return 0;
  }

  decode(input: string): string {
    return decodeURIComponent(input);
  }

  encode(input: string): string {
    const encoder = new TextEncoder();
    const uint8Array = encoder.encode(input);
    return Array.from(uint8Array)
      .map((byte) => '%' + byte.toString(16).toUpperCase().padStart(2, '0'))
      .join('');
  }
}
