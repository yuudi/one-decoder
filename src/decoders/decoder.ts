import { getPluginList } from '../plugins/enabled';
import {
  DecodeError,
  DecodeErrorCode,
  EncodeError,
  EncodeErrorCode,
} from './errors';
import type {
  DecodeResult,
  DecoderPlugin,
  DecoderPluginInfo,
  DecodeSuccessResult,
  EncodeResult,
} from './types';

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
      const pluginInfos: DecoderPluginInfo = plugin;
      if (plugin.needNetwork && !navigator.onLine) {
        return {
          ...pluginInfos,
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
          ...pluginInfos,
          score: 0,
          errorCode:
            error instanceof DecodeError ? error.code : DecodeErrorCode.Unknown,
          errorMessage: error instanceof Error ? error.message : String(error),
        };
      }

      if (score <= 0) {
        return {
          ...pluginInfos,
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
          ...pluginInfos,
          score,
          errorCode:
            error instanceof DecodeError ? error.code : DecodeErrorCode.Unknown,
          errorMessage: error instanceof Error ? error.message : String(error),
        };
      }
      return {
        ...pluginInfos,
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
        id,
        name: plugin ? plugin.name : `Plugin ID ${id}`,
        description: plugin?.description,
        errorCode: EncodeErrorCode.EncoderIdNotFound,
        errorMessage: 'Encoder not available',
      };
    }
    if (plugin.needNetwork && !navigator.onLine) {
      return {
        ...plugin,
        errorCode: EncodeErrorCode.NetworkRequired,
        errorMessage: 'Network access is required',
      };
    }
    try {
      const encoded = await plugin.encode(input, key);
      return {
        ...plugin,
        encoded,
      };
    } catch (error) {
      console.error(`Error encoding with plugin ${plugin.name}:`, error);
      return {
        ...plugin,
        errorCode:
          error instanceof EncodeError ? error.code : EncodeErrorCode.Unknown,
        errorMessage: error instanceof Error ? error.message : String(error),
      };
    }
  }
}
