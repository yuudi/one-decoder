import { type DecoderPlugin } from '../decoder';

export class BuddhaDecoder implements DecoderPlugin {
  id = 'buddha';
  name = '与佛论禅';
  description = 'takuron版与佛论禅（与佛论禅流传的版本较多，本站无法全部收集）';
  link = 'https://github.com/takuron/talk-with-buddha';
  encoderHelpMessage = '本站使用原作者第二版默认密码："takuron.top"';
  needKey = true;

  // different default passwords from different deployments
  private static readonly defaultPasswords = [
    'takuron.top',
    'TakuronDotTop',
    'hahaka.com',
  ];

  checkString(input: string): number {
    if (input.startsWith('佛曰：')) {
      return 100;
    }
    if (input.startsWith('佛又曰：')) {
      return 100;
    }
    if (input.startsWith('熊曰：')) {
      return 100;
    }

    return 0;
  }

  async decode(input: string, data: { key?: string }): Promise<string> {
    const { default: CryptoJS } = await import('crypto-js');
    const { key } = data;
    const charset =
      input.startsWith('佛曰：') || input.startsWith('佛又曰：')
        ? BuddhaDecoder.buddhaCharset
        : input.startsWith('熊曰：')
          ? BuddhaDecoder.bearCharset
          : null;
    if (!charset) throw Error('unknown charset');
    const content = input.startsWith('佛又曰：')
      ? input.slice(4)
      : input.slice(3);
    const base64 = content.replace(/./g, (v) => charset[v]);
    if (key) {
      return CryptoJS.AES.decrypt('U2FsdGVkX1' + base64, key).toString(
        CryptoJS.enc.Utf8,
      );
    } else {
      for (const possibleKey of BuddhaDecoder.defaultPasswords) {
        try {
          console.debug('try password: ' + possibleKey);
          const result = CryptoJS.AES.decrypt(
            'U2FsdGVkX1' + base64,
            possibleKey,
          ).toString(CryptoJS.enc.Utf8);
          if (result.length === 0) continue;
          return result;
        } catch {
          continue;
        }
      }
      throw new Error('需要密码');
    }
  }

  async encode(input: string, key?: string): Promise<string> {
    const { default: CryptoJS } = await import('crypto-js');
    const encrypted = CryptoJS.AES.encrypt(
      input,
      key || BuddhaDecoder.defaultPasswords[0],
    ).toString();
    const offsetData = encrypted.slice(10);
    const mapped = offsetData.replace(
      /./g,
      (v) => BuddhaDecoder.buddhaMap[v] || '？',
    );
    return '佛曰：' + mapped;
  }

  private static bearCharset: Record<string, string> = {
    蛇: 'e',
    獾: 'E',
    豹: 't',
    鱼: 'T',
    鹌: 'a',
    牛: 'A',
    羊: 'o',
    雁: 'O',
    鹑: 'i',
    鸠: 'I',
    鹞: 'n',
    熊: 'N',
    鸮: 's',
    狸: 'S',
    鸡: 'h',
    鹎: 'H',
    貔: 'r',
    鸽: 'R',
    豚: 'd',
    狐: 'D',
    鸟: 'l',
    鹤: 'L',
    兔: 'c',
    狮: 'C',
    龟: 'u',
    鳐: 'U',
    鼠: 'm',
    虎: 'M',
    龙: 'w',
    鲲: 'W',
    鹿: 'f',
    鸰: 'F',
    雀: 'g',
    鲑: 'G',
    鸵: 'y',
    鲨: 'Y',
    豺: 'p',
    驴: 'P',
    鹰: 'b',
    鳗: 'B',
    狒: 'v',
    狗: 'V',
    蜂: 'k',
    猪: 'K',
    鲆: 'j',
    狼: 'J',
    鸭: 'x',
    貂: 'X',
    貅: 'q',
    蜜: 'Q',
    鹂: 'z',
    马: 'Z',
    鼬: '0',
    猴: '1',
    鸬: '2',
    鹅: '3',
    象: '4',
    鳅: '5',
    猫: '6',
    鹄: '7',
    鸢: '8',
    鲸: '9',
    鳄: '+',
    鳖: '/',
    猩: '=',
  };

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

  private static buddhaMap: Record<string, string> = {
    e: '啰',
    E: '羯',
    t: '婆',
    T: '提',
    a: '摩',
    A: '埵',
    o: '诃',
    O: '迦',
    i: '耶',
    I: '吉',
    n: '娑',
    N: '佛',
    s: '夜',
    S: '驮',
    h: '那',
    H: '谨',
    r: '悉',
    R: '墀',
    d: '阿',
    D: '呼',
    l: '萨',
    L: '尼',
    c: '陀',
    C: '唵',
    u: '唎',
    U: '伊',
    m: '卢',
    M: '喝',
    w: '帝',
    W: '烁',
    f: '醯',
    F: '蒙',
    g: '罚',
    G: '沙',
    y: '嚧',
    Y: '他',
    p: '南',
    P: '豆',
    b: '无',
    B: '孕',
    v: '菩',
    V: '伽',
    k: '怛',
    K: '俱',
    j: '哆',
    J: '度',
    x: '皤',
    X: '阇',
    q: '室',
    Q: '地',
    z: '利',
    Z: '遮',
    '0': '穆',
    '1': '参',
    '2': '舍',
    '3': '苏',
    '4': '钵',
    '5': '曳',
    '6': '数',
    '7': '写',
    '8': '栗',
    '9': '楞',
    '+': '咩',
    '/': '输',
    '=': '漫',
  };
}
