import { type DecoderPlugin } from '../decoder';

export class UrlDecoder implements DecoderPlugin {
  id = 'url';
  name = 'URL编码';
  hide = true;

  checkString(input: string): number {
    if (/^(%[a-fA-F0-9]{2})+$/.test(input)) {
      return 100;
    }
    return 0;
  }

  decode(input: string): string {
    return decodeURIComponent(input);
  }
}
