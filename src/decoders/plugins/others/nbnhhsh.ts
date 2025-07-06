import { DecodeError, DecodeErrorCode } from '../../errors';
import { type DecoderPlugin } from '../../types';

export class NBNHHSHDecoder implements DecoderPlugin {
  id = 'nbnhhsh';
  name = '能不能好好说话';
  link = 'https://lab.magiconch.com/nbnhhsh/';
  hide = true;
  needNetwork = true;

  checkString(input: string): number {
    if (/^[a-z0-9]{2,}$/.test(input)) {
      return Math.min(60, Math.floor(240 / input.length));
    }
    return 0;
  }

  async decode(input: string): Promise<string> {
    const response = await fetch(
      'https://lab.magiconch.com/api/nbnhhsh/guess',
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: input }),
        referrerPolicy: 'no-referrer',
      },
    );
    if (!response.ok) {
      throw new DecodeError('Network response was not ok', {
        cause: response,
        code: DecodeErrorCode.NetworkError,
      });
    }
    const data: { name: string; trans: string[] }[] = await response.json();
    const [{ trans }] = data;
    return trans.join(', ');
  }
}
