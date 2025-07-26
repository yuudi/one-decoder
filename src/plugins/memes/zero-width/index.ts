import { decode, encode, zeroWidthDict } from 'zero-width-lib';
import { Plugin } from '../../../decoders/decorators';
import { EncodeError, EncodeErrorCode } from '../../../decoders/errors';

@Plugin({
  id: 'zero-width',
  name: '零宽',
  link: 'https://yuanfux.github.io/zero-width-web/',
  author: 'Yuan Fu',
  encodeKey: 'required',
  encoderHelpMessage:
    '"密钥"处填明文。某些软件可能显示或删除零宽字符，请自行测试。',
})
export class ZeroWidthDecoder {
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
      throw new EncodeError('请在“密钥”处填写明文', {
        code: EncodeErrorCode.InvalidKey,
      });
    }
    if (key.length < 2) {
      throw new EncodeError('明文长度至少为2字符', {
        code: EncodeErrorCode.InvalidKey,
      });
    }
    return encode(key, input);
  }
}
