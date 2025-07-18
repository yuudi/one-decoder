import punycode from 'punycode/';
import { Plugin } from '../../decoders/decorators';

@Plugin({
  id: 'punycode',
  name: 'Punycode',
  encoderHelpMessage: '字母不区分大小写，转化为小写',
})
export class PunycodeDecoder {
  checkString(input: string): number {
    if (/^xn--[a-z0-9-]+$/.test(input)) {
      return 100;
    }

    return 0;
  }

  decode(input: string): string {
    return punycode.toUnicode(input);
  }

  encode(input: string): string {
    return punycode.toASCII(input);
  }
}
