import { getPluginList } from './enabled';

type ValueOrPromise<T> = T | Promise<T>;

export interface DecoderPlugin {
  readonly name: string;
  readonly description?: string;
  readonly link?: string;
  readonly needKey?: boolean;

  checkString(
    input: string,
    data: Readonly<{ key?: string; freq: Record<string, number> }>,
  ): ValueOrPromise<number>;

  decode(
    input: string,
    data: Readonly<{ key?: string }>,
  ): ValueOrPromise<string>;

  encode?(input: string, key?: string): ValueOrPromise<string>;
}

export interface DecodeSuccessResult {
  name: string;
  description?: string;
  score: number;
  decoded: string;
}

interface DecodeFailureResult {
  name: string;
  description?: string;
  score: 0;
}

export type DecodeResult = DecodeSuccessResult | DecodeFailureResult;
export function isDecodeSuccessResult(
  result: DecodeResult,
): result is DecodeSuccessResult {
  return result.score > 0;
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

  async decode(input: string, key?: string): Promise<DecodeSuccessResult[]> {
    const results = await Promise.all(this.decodeAsync(input, key));
    return results.filter(
      (result): result is DecodeSuccessResult => result.score > 0,
    );
  }

  decodeAsync(input: string, key?: string): Promise<DecodeResult>[] {
    const freq = this.getCharFrequency(input);
    return this.getPlugins().map<Promise<DecodeResult>>(async (plugin) => {
      let score;
      try {
        score = await plugin.checkString(input, { key, freq });
      } catch (error) {
        console.error(
          `Error checking string with plugin ${plugin.name}:`,
          error,
        );
        return { name: plugin.name, score: 0 };
      }

      if (score > 0) {
        let decoded;
        try {
          decoded = await plugin.decode(input, { key });
        } catch (error) {
          console.error(`Error decoding with plugin ${plugin.name}:`, error);
          return { name: plugin.name, score: 0 };
        }
        return {
          name: plugin.name,
          description: plugin.description,
          score,
          decoded,
        };
      } else {
        return { name: plugin.name, description: plugin.description, score: 0 };
      }
    });
  }

  private getCharFrequency(input: string): Record<string, number> {
    const freq: Record<string, number> = {};
    for (const char of input) {
      freq[char] = (freq[char] || 0) + 1;
    }
    return freq;
  }

  getPluginsList() {
    return this.getPlugins().map((plugin, index) => ({
      id: index,
      name: plugin.name,
      description: plugin.description,
      encoderAvailable: !!plugin.encode,
    }));
  }

  private getPluginById(id: number): DecoderPlugin | undefined {
    const plugins = this.getPlugins();
    return plugins[id] || undefined;
  }

  async encode(
    id: number,
    input: string,
    key?: string,
  ): Promise<string | undefined> {
    const plugin = this.getPluginById(id);
    if (!plugin || !plugin.encode) {
      console.error(`Encoder not available for plugin ID ${id}`);
      return undefined;
    }
    try {
      return await plugin.encode(input, key);
    } catch (error) {
      console.error(`Error encoding with plugin ${plugin.name}:`, error);
      return undefined;
    }
  }
}
