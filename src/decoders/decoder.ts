import { getPluginList } from './enabled';

type ValueOrPromise<T> = T | Promise<T>;

interface DecoderPluginInfo {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly link?: string;
  readonly needKey?: boolean;
  readonly encoderHelpMessage?: string;
  readonly hide?: boolean;
}

export interface DecoderPlugin extends DecoderPluginInfo {
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

export interface EncodeSuccessResult {
  name: string;
  description?: string;
  error: undefined;
  encoded: string;
}

interface EncodeFailureResult {
  name: string;
  description?: string;
  error: string;
  encoded: undefined;
}

export type EncodeResult = EncodeSuccessResult | EncodeFailureResult;
export function isEncodeSuccessResult(
  result: EncodeResult,
): result is EncodeSuccessResult {
  return (result as EncodeFailureResult).error === undefined;
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

  getPluginsList(): DecoderPlugin[] {
    return this.getPlugins().filter((plugin) => !plugin.hide);
  }

  private getPluginById(id: string): DecoderPlugin | undefined {
    const plugins = this.getPlugins();
    return plugins.find((p) => p.id === id);
  }

  async encode(
    ids: string[],
    input: string,
    key?: string,
  ): Promise<EncodeResult[]> {
    return await Promise.all(this.encodeAsync(ids, input, key));
  }

  encodeAsync(
    ids: string[],
    input: string,
    key?: string,
  ): Promise<EncodeResult>[] {
    return ids.map((id) => this.encodeById(id, input, key));
  }

  private async encodeById(
    id: string,
    input: string,
    key?: string,
  ): Promise<EncodeResult> {
    const plugin = this.getPluginById(id);
    if (!plugin || !plugin.encode) {
      console.error(`Encoder not available for plugin ID ${id}`);
      return {
        name: plugin ? plugin.name : `Plugin ID ${id}`,
        description: plugin?.description,
        error: 'Encoder not available',
        encoded: undefined,
      };
    }
    try {
      const encoded = await plugin.encode(input, key);
      return {
        name: plugin.name,
        description: plugin.description,
        encoded,
        error: undefined,
      };
    } catch (error) {
      console.error(`Error encoding with plugin ${plugin.name}:`, error);
      return {
        name: plugin.name,
        description: plugin.description,
        error: error instanceof Error ? error.message : String(error),
        encoded: undefined,
      };
    }
  }
}
