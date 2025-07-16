import { type DecoderPlugin } from '../../decoders/types';

export class EscapeDecoder implements DecoderPlugin {
  id = 'escape';
  name = '转义字符';
  hide = true;

  checkString(input: string): number {
    if (/^(\\u[a-fA-F0-9]{4})+$/.test(input)) {
      return 100;
    }
    return 0;
  }

  decode(input: string): string {
    return JSON.stringify('"' + input + '"');
  }
}
