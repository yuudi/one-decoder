import { type DecoderPlugin } from '../decoder';

export class WhispererDecoder implements DecoderPlugin {
  name = '低语者';
  description = 'https://github.com/Borber/Whisperer';

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
    return '低语:' + encode(input);
  }
}
