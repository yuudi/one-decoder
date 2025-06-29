import { type DecoderPlugin } from '../../decoder';

export class AbracadabraDecoder implements DecoderPlugin {
  id = 'abracadabra';
  name = '魔曰';
  link = 'https://abra.halu.ca/';
  needKey = true;
  encoderHelpMessage = '完整选项请前往官网';

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

  async decode(input: string, data: { key?: string }): Promise<string> {
    const { Abracadabra } = await import('abracadabra-cn'); // lazy-load library
    const { key } = data;
    const abra = new Abracadabra();
    abra.Input_Next(input, 'DECRYPT', key || AbracadabraDecoder.defaultKey);
    return abra.Output() as string;
  }

  async encode(input: string, key?: string): Promise<string> {
    const { Abracadabra } = await import('abracadabra-cn'); // lazy-load library
    const abra = new Abracadabra();
    abra.Input_Next(input, 'ENCRYPT', key || AbracadabraDecoder.defaultKey);
    return abra.Output() as string;
  }
}
