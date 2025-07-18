import { Plugin } from '../../decoders/decorators';
import { DecodeError, DecodeErrorCode } from '../../decoders/errors';

@Plugin({
  id: 'bilibili.bv',
  name: 'BV号',
  link: 'https://www.zhihu.com/question/381784377/answer/1099438784',
  hide: true,
})
export class BVDecoder {
  private av2bv: (src: bigint | number | string) => string;
  private bv2av: (src: string) => bigint;

  constructor() {
    const magicStr =
      'FcwAPNKTMug3GV5Lj7EJnHpWsx4tb8haYeviqBz6rkCy12mUSDQX9RdoZf';
    const table: Record<string, bigint> = {};
    for (let i = 0; i < magicStr.length; i++) table[magicStr[i]] = BigInt(i);
    const s = [0, 1, 2, 9, 7, 5, 6, 4, 8, 3, 10, 11];
    const BASE = 58n,
      MAX = 1n << 51n,
      LEN = 12;
    const XOR = 23442827791579n,
      MASK = 2251799813685247n;

    this.av2bv = (src) => {
      if (typeof src !== 'bigint') src = BigInt(src);
      const r = Array.from('BV1         ');
      let it = LEN - 1;
      let tmp = (src | MAX) ^ XOR;
      while (tmp !== 0n) {
        r[s[it]] = magicStr[Number(tmp % BASE)];
        tmp /= BASE;
        it--;
      }
      return r.join('');
    };

    this.bv2av = (src) => {
      let r = 0n;
      for (let i = 3; i < LEN; i++) {
        r = r * BASE + BigInt(table[src[s[i]]]);
      }
      return (r & MASK) ^ XOR;
    };
  }

  checkString(input: string): number {
    if (/^BV[1-9A-HJ-NP-Za-km-z]{10}$/.test(input)) {
      return 100;
    }
    if (/^av\d+$/.test(input)) {
      return 90;
    }
    return 0;
  }

  decode(input: string): string {
    if (input.startsWith('BV')) {
      const av = this.bv2av(input);
      return 'https://www.bilibili.com/video/av' + av.toString();
    }
    if (input.startsWith('av')) {
      return 'https://www.bilibili.com/video/' + input;
    }
    throw new DecodeError('不支持的格式', {
      code: DecodeErrorCode.Unknown,
    });
  }
}
