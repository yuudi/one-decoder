import { type DecoderPluginImplement, type DecoderPluginInfo } from './types';

export function Plugin<T extends DecoderPluginImplement>(
  info: DecoderPluginInfo,
) {
  return function (constructor: new () => T) {
    Object.assign(constructor.prototype, info);
    return constructor;
  };
}
