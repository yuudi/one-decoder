import { Plugin } from '../../decoders/decorators';

@Plugin({ id: 'escape', name: '转义字符' })
export class EscapeDecoder {
  checkString(input: string): number {
    if (input.includes('\\')) {
      return 90;
    }
    return 0;
  }

  decode(input: string): string {
    const inputSafe = input.replace(/(?<!(?<!\\)(?:\\\\)*\\)"/g, '\\"');
    return JSON.parse('"' + inputSafe + '"');
  }

  encode(input: string): string {
    return input.replace(/./g, function (char) {
      return '\\u' + ('0000' + char.charCodeAt(0).toString(16)).slice(-4);
    });
  }
}
