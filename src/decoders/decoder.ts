import {
  DecodeError,
  DecodeErrorCode,
  EncodeError,
  EncodeErrorCode,
} from './errors';
import type {
  DecodeResult,
  DecoderPlugin,
  DecodeSuccessResult,
  EncodeResult,
} from './types';

export class Decoder {
  constructor(private plugins: DecoderPlugin[]) {}

  async decode(input: string, key?: string): Promise<DecodeSuccessResult[]> {
    const results = await Promise.all(this.decodeAsync(input, key));
    return results.filter(
      (result): result is DecodeSuccessResult => result.score > 0,
    );
  }

  decodeAsync(input: string, key?: string): Promise<DecodeResult>[] {
    const freq = this.getCharFrequency(input);
    return this.plugins.map<Promise<DecodeResult>>(async (plugin) => {
      const pluginInfo = plugin.info();
      if (plugin.needNetwork && !navigator.onLine) {
        return {
          ...pluginInfo,
          score: 0,
          errorCode: DecodeErrorCode.NetworkRequired,
          errorMessage: 'Network access is required',
        };
      }
      let score;
      try {
        score = await plugin.checkString(input, { key, freq });
      } catch (error) {
        console.error(
          `Error checking string with plugin ${plugin.name}:`,
          error,
        );
        return {
          ...pluginInfo,
          score: 0,
          errorCode:
            error instanceof DecodeError ? error.code : DecodeErrorCode.Unknown,
          errorMessage: error instanceof Error ? error.message : String(error),
        };
      }

      if (score <= 0) {
        return {
          ...pluginInfo,
          score,
          errorCode: DecodeErrorCode.DecoderSkipped,
          errorMessage: 'scores 0, skipped',
        };
      }

      let decoded;
      try {
        decoded = await plugin.decode(input, { key });
      } catch (error) {
        console.error(`Error decoding with plugin ${plugin.name}:`, error);
        return {
          ...pluginInfo,
          score,
          errorCode:
            error instanceof DecodeError ? error.code : DecodeErrorCode.Unknown,
          errorMessage: error instanceof Error ? error.message : String(error),
        };
      }
      return {
        ...pluginInfo,
        score,
        decoded,
      };
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
    return this.plugins.filter((plugin) => !plugin.hide);
  }

  private getPluginById(id: string): DecoderPlugin | undefined {
    return this.plugins.find((p) => p.id === id);
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
        id,
        name: plugin ? plugin.name : `Plugin ID ${id}`,
        description: plugin?.description,
        errorCode: EncodeErrorCode.EncoderIdNotFound,
        errorMessage: 'Encoder not available',
      };
    }
    const pluginInfo = plugin.info();
    if (plugin.needNetwork && !navigator.onLine) {
      return {
        ...pluginInfo,
        errorCode: EncodeErrorCode.NetworkRequired,
        errorMessage: 'Network access is required',
      };
    }
    try {
      const encoded = await plugin.encode(input, key);
      return {
        ...pluginInfo,
        encoded,
      };
    } catch (error) {
      console.error(`Error encoding with plugin ${plugin.name}:`, error);
      return {
        ...pluginInfo,
        errorCode:
          error instanceof EncodeError ? error.code : EncodeErrorCode.Unknown,
        errorMessage: error instanceof Error ? error.message : String(error),
      };
    }
  }
}
