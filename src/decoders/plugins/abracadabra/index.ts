import { Abracadabra } from 'abracadabra-cn';
import { type DecoderPlugin } from '../../decoder';

export class AbracadabraDecoder implements DecoderPlugin {
  name = '魔曰';
  description = '官方网站：https://abra.halu.ca/';

  private static defaultKey = 'ABRACADABRA';

  checkString(input: string): number {
    if (/^[\u4E00-\u9FA5\u9FA6-\u9FCB\u2E80-\u2EFF]+$/.test(input)) {
      return 80;
    }
    if (/^[^\w]+$/.test(input)) {
      return 30;
    }
    return 0;
  }

  decode(input: string, data: { key?: string }): string {
    const { key } = data;
    const abra = new Abracadabra();
    abra.Input_Next(input, 'DECRYPT', key || AbracadabraDecoder.defaultKey);
    return abra.Output() as string;
  }
}
