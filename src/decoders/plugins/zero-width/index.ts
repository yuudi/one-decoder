import { decode, encode, zeroWidthDict } from 'zero-width-lib';
import { type DecoderPlugin } from '../../decoder';

export class ZeroWidthDecoder implements DecoderPlugin {
  id = 'zero-width';
  name = '零宽';
  link = 'https://github.com/yuanfux/zero-width-lib';
  needKey = true;
  encoderHelpMessage =
    '“密钥”处填明文，至少为2个字符。最终结果在不同软件中可能被显示或者被删除，请自行测试';

  checkString(input: string): number {
    const charset = Object.values(zeroWidthDict);
    if (input.length >= 3 && charset.includes(input[1])) {
      return 100;
    }

    return 0;
  }

  decode(input: string): string {
    return decode(input);
  }

  encode(input: string, key?: string): string {
    if (!key) {
      throw Error('请在“密钥”处填写明文');
    }
    if (key.length < 2) {
      throw Error('明文长度至少为2字符');
    }
    return encode(key, input);
  }
}
