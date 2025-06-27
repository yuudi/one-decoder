import { getPluginList } from './enabled';

type ValueOrPromise<T> = T | Promise<T>;

export interface DecoderPlugin {
  readonly name: string;
  readonly description?: string;

  checkString(
    input: string,
    data: Readonly<{ key?: string; freq: Record<string, number> }>,
  ): ValueOrPromise<number>;

  decode(
    input: string,
    data: Readonly<{ key?: string }>,
  ): ValueOrPromise<string>;

  encode?(input: string): ValueOrPromise<string>;
}

export interface DecodeResult {
  name: string;
  description?: string;
  score: number;
  decoded: string;
}

export class Decoder {
  private plugins = getPluginList();
  private initializedPlugins: DecoderPlugin[] | undefined = undefined;

  initializePlugins(): void {
    return void this.getPlugins();
  }

  private getPlugins(): DecoderPlugin[] {
    if (this.initializedPlugins) return this.initializedPlugins;
    this.initializedPlugins = this.plugins.map((Plugin) => new Plugin());
    return this.initializedPlugins;
  }

  async decode(input: string, key?: string): Promise<DecodeResult[]> {
    const freq = this.getCharFrequency(input);
    const results: DecodeResult[] = [];
    for (const plugin of this.getPlugins()) {
      let score;
      try {
        score = await plugin.checkString(input, { key, freq });
      } catch (error) {
        console.error(
          `Error checking string with plugin ${plugin.name}:`,
          error,
        );
        continue;
      }

      if (score > 0) {
        let decoded;
        try {
          decoded = await plugin.decode(input, { key });
        } catch (error) {
          console.error(`Error decoding with plugin ${plugin.name}:`, error);
          continue;
        }
        results.push({
          name: plugin.name,
          description: plugin.description,
          score,
          decoded,
        });
      }
    }
    return results;
  }

  private getCharFrequency(input: string): Record<string, number> {
    const freq: Record<string, number> = {};
    for (const char of input) {
      freq[char] = (freq[char] || 0) + 1;
    }
    return freq;
  }
}
