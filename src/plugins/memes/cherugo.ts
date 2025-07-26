import { Plugin } from '../../decoders/decorators';

@Plugin({
  id: 'cherugo',
  name: '切噜语',
  author: '@Ice9Coffee',
  link: 'https://pcrbot.github.io/cherugo.js/',
  encodeKey: 'not-allowed',
})
export class CherugoDecoder {
  checkString(input: string): number {
    if (input.startsWith('切噜～♪')) {
      return 100;
    }

    return 0;
  }

  async decode(input: string): Promise<string> {
    const { decode } = await import('cherugo'); // lazy load module
    return decode(input);
  }

  async encode(input: string): Promise<string> {
    const { encode } = await import('cherugo'); // lazy load module
    return encode(input);
  }
}
