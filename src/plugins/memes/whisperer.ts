import { Plugin } from '../../decoders/decorators';

@Plugin({
  id: 'whisperer',
  name: '低语者',
  link: 'https://github.com/Borber/Whisperer',
  author: '@Borber',
  needKey: false,
  encoderHelpMessage: '完整选项请前往官网',
})
export class WhispererDecoder {
  checkString(input: string): number {
    if (input.startsWith('低语:') || input.startsWith('低语：')) {
      return 100;
    }

    return 0;
  }

  private library:
    | { encode: (input: string) => string; decode: (input: string) => string }
    | undefined;
  private async getLibrary() {
    if (!this.library) {
      const { encode, decode, set_panic_hook } = await import('whisperer-wasm'); // lazy load whisperer-wasm
      set_panic_hook();
      this.library = { encode, decode };
    }
    return this.library;
  }

  async decode(input: string): Promise<string> {
    const { decode } = await this.getLibrary();
    return decode(input.slice(3));
  }

  async encode(input: string): Promise<string> {
    const { encode } = await this.getLibrary();
    return encode(input);
  }
}
