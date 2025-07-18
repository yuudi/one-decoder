import { Plugin } from '../../decoders/decorators';
import { DecodeError, DecodeErrorCode } from '../../decoders/errors';

const wj = '\u2060'; // WORD JOINER
const zwnbsp = '\uFEFF'; // ZERO WIDTH NO-BREAK SPACE

@Plugin({
  id: 'hidden-watermark',
  name: '隐水印',
  description: '郭飞版零宽字符',
  link: 'https://www.guofei.site/os/text_wm.html',
  needKey: true,
  hide: true,
})
export class HiddenWatermarkDecoder {
  checkString(input: string): number {
    if (input.includes(wj) || input.includes(zwnbsp)) {
      return 100;
    }

    return 0;
  }

  async decode(input: string, config: { key: string }): Promise<string> {
    if (!config.key) {
      throw new DecodeError('缺少key', { code: DecodeErrorCode.InvalidKey });
    }
    const { Watermarker } = await import('hidden-watermark-wasm'); // lazy loading
    const watermarker = new Watermarker(config.key);
    const result = watermarker.extract(input);
    return result;
  }
}
