import { Plugin } from '../../decoders/decorators';

@Plugin({ id: 'escape', name: '转义字符' })
export class EscapeDecoder {
  checkString(input: string): number {
    if (/^(\\u[a-fA-F0-9]{4})+$/.test(input)) {
      return 100;
    }
    return 0;
  }

  decode(input: string): string {
    return JSON.stringify('"' + input + '"');
  }

  encode(input: string): string {
    return input.replace(/./g, function (char) {
      return '\\u' + ('0000' + char.charCodeAt(0).toString(16)).slice(-4);
    });
  }
}
