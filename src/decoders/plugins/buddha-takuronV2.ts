import { type DecoderPlugin } from '../decoder';
import CryptoJS from 'crypto-js';

export class BuddhaDecoder implements DecoderPlugin {
  name = '佛曰V2';
  description = 'takuron版与佛论禅V2';

  private static defaultPassword = 'takuron.top';

  checkString(input: string): number {
    if (input.startsWith('佛又曰：')) {
      return 100;
    }

    return 0;
  }

  decode(input: string, data: { key?: string }): string {
    const { key } = data;
    const base64 = input
      .slice(4)
      .replace(/./, (v) => BuddhaDecoder.buddhaCharset[v]);

    return CryptoJS.AES.decrypt(
      'U2FsdGVkX1' + base64,
      key || BuddhaDecoder.defaultPassword,
    ).toString(CryptoJS.enc.Utf8);
  }

  private static buddhaCharset: Record<string, string> = {
    啰: 'e',
    羯: 'E',
    婆: 't',
    提: 'T',
    摩: 'a',
    埵: 'A',
    诃: 'o',
    迦: 'O',
    耶: 'i',
    吉: 'I',
    娑: 'n',
    佛: 'N',
    夜: 's',
    驮: 'S',
    那: 'h',
    谨: 'H',
    悉: 'r',
    墀: 'R',
    阿: 'd',
    呼: 'D',
    萨: 'l',
    尼: 'L',
    陀: 'c',
    唵: 'C',
    唎: 'u',
    伊: 'U',
    卢: 'm',
    喝: 'M',
    帝: 'w',
    烁: 'W',
    醯: 'f',
    蒙: 'F',
    罚: 'g',
    沙: 'G',
    嚧: 'y',
    他: 'Y',
    南: 'p',
    豆: 'P',
    无: 'b',
    孕: 'B',
    菩: 'v',
    伽: 'V',
    怛: 'k',
    俱: 'K',
    哆: 'j',
    度: 'J',
    皤: 'x',
    阇: 'X',
    室: 'q',
    地: 'Q',
    利: 'z',
    遮: 'Z',
    穆: '0',
    参: '1',
    舍: '2',
    苏: '3',
    钵: '4',
    曳: '5',
    数: '6',
    写: '7',
    栗: '8',
    楞: '9',
    咩: '+',
    输: '/',
    漫: '=',
  };
}
