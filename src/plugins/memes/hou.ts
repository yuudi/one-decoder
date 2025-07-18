import { Plugin } from '../../decoders/decorators';
import { DecodeError, DecodeErrorCode } from '../../decoders/errors';

@Plugin({
  id: 'hou',
  name: '齁语', // 原名 "母猪文" 不好听
  link: 'https://msbt.seku.su/',
  hide: false,
})
export class HouDecoder {
  code: string[];
  codeMap: Record<string, number>;
  constructor() {
    this.code = [
      '齁',
      '哦',
      '噢',
      '喔',
      '咕',
      '咿',
      '嗯',
      '啊',
      '～',
      '哈',
      '！',
      '唔',
      '哼',
      '❤',
      '呃',
      '呼',
    ];
    this.codeMap = {};
    for (let index = 0; index < this.code.length; index++) {
      this.codeMap[this.code[index]] = Number(index);
    }
  }

  checkString(input: string): number {
    if (input.split('').every((c) => this.codeMap[c] !== undefined)) {
      return 100;
    }
    return 0;
  }

  decode(input: string): string {
    const bytes = [];
    for (let i = 0; i < input.length; i += 2) {
      const high = this.codeMap[input[i]];
      const low = this.codeMap[input[i + 1]];
      if (high === undefined || low === undefined) {
        throw new DecodeError('无效字符', { code: DecodeErrorCode.Unknown });
      }
      const byte = (high << 4) | low;
      bytes.push(byte);
    }
    const decoder = new TextDecoder();

    const decoded = decoder.decode(new Uint8Array(bytes));
    return decoded;
  }

  encode(input: string): string {
    const encoder = new TextEncoder();
    const bytes = encoder.encode(input);
    let encoded = '';
    for (const byte of bytes) {
      const high = (byte >> 4) & 0x0f;
      const low = byte & 0x0f;
      encoded += this.code[high] + this.code[low];
    }
    return encoded;
  }
}
