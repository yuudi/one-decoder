import { DecoderPlugin } from '../../decoder';
import type Encoder from './lib/gbk';

export class CherugoDecoder implements DecoderPlugin {
  name = '切噜语';
  description = '作者：github.com/Ice9Coffee；移植：github.com/yuudi';
  private encoder: Encoder | undefined;
  private async getEncoder() {
    if (!this.encoder) {
      const { default: GBK } = await import('./lib/gbk'); // lazy load GBK encoder
      this.encoder = new GBK('切卟叮咧哔唎啪啰啵嘭噜噼巴拉蹦铃');
    }
    return this.encoder;
  }

  checkString(input: string): number {
    if (
      input.startsWith('切噜～♪') &&
      /^[切卟叮咧哔唎啪啰啵嘭噜噼巴拉蹦铃]+$/.test(input.slice(4))
    ) {
      return 100;
    }

    return 0;
  }

  async decode(input: string): Promise<string> {
    const encoder = await this.getEncoder();
    return input
      .slice(4)
      .replace(/切[切卟叮咧哔唎啪啰啵嘭噜噼巴拉蹦铃]+/g, (che) =>
        encoder.decode(che.slice(1)),
      );
  }

  async encode(input: string): Promise<string> {
    const encoder = await this.getEncoder();
    const encoded = input.replace(
      /[^，。？！、…：“”,.?!\s]+/g,
      (word) => '切' + encoder.encode(word),
    );
    return '切噜～♪' + encoded;
  }
}
