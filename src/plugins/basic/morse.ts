import { EncodeError, EncodeErrorCode } from '../../decoders/errors';
import { type DecoderPlugin } from '../../decoders/types';

export class MorseDecoder implements DecoderPlugin {
  id = 'morse';
  name = '摩斯电码';
  encoderHelpMessage = '只支持字母和数字，字母不区分大小写';

  checkString(input: string): number {
    if (/^[.-/| ]+$/.test(input)) {
      // possible dividers: "|" "/" ""
      return 95;
    }

    return 0;
  }

  decode(input: string): string {
    const codes = input.split(/[/| ]/);
    return codes.map((code) => MorseDecoder.revMap[code] ?? '█').join('');
  }

  encode(input: string): string {
    const results = [];
    for (const char of input.toLocaleLowerCase().split('')) {
      if (char === ' ') {
        // 忽略空格
        continue;
      }
      const code = MorseDecoder.charMap[char];
      if (code === undefined) {
        throw new EncodeError('不支持的字符：' + char, {
          code: EncodeErrorCode.InvalidInput,
        });
      }
      results.push(code);
    }
    return results.join('/');
  }

  private static readonly charMap: Record<string, string> = {
    '0': '-----',
    '1': '.----',
    '2': '..---',
    '3': '...--',
    '4': '....-',
    '5': '.....',
    '6': '-....',
    '7': '--...',
    '8': '---..',
    '9': '----.',
    a: '.-',
    b: '-...',
    c: '-.-.',
    d: '-..',
    e: '.',
    f: '..-.',
    g: '--.',
    h: '....',
    i: '..',
    j: '.---',
    k: '-.-',
    l: '.-..',
    m: '--',
    n: '-.',
    o: '---',
    p: '.--.',
    q: '--.-',
    r: '.-.',
    s: '...',
    t: '-',
    u: '..-',
    v: '...-',
    w: '.--',
    x: '-..-',
    y: '-.--',
    z: '--..',
    '.': '.-.-.-',
    ',': '--..--',
    '?': '..--..',
    '!': '-.-.--',
    '-': '-....-',
    '/': '-..-.',
    '@': '.--.-.',
    '(': '-.--.',
    ')': '-.--.-',
  };

  private static readonly revMap: Record<string, string> = {
    '-----': '0',
    '.----': '1',
    '..---': '2',
    '...--': '3',
    '....-': '4',
    '.....': '5',
    '-....': '6',
    '--...': '7',
    '---..': '8',
    '----.': '9',
    '.-': 'a',
    '-...': 'b',
    '-.-.': 'c',
    '-..': 'd',
    '.': 'e',
    '..-.': 'f',
    '--.': 'g',
    '....': 'h',
    '..': 'i',
    '.---': 'j',
    '-.-': 'k',
    '.-..': 'l',
    '--': 'm',
    '-.': 'n',
    '---': 'o',
    '.--.': 'p',
    '--.-': 'q',
    '.-.': 'r',
    '...': 's',
    '-': 't',
    '..-': 'u',
    '...-': 'v',
    '.--': 'w',
    '-..-': 'x',
    '-.--': 'y',
    '--..': 'z',
    '.-.-.-': '.',
    '--..--': ',',
    '..--..': '?',
    '-.-.--': '!',
    '-....-': '-',
    '-..-.': '/',
    '.--.-.': '@',
    '-.--.': '(',
    '-.--.-': ')',
  };
}
