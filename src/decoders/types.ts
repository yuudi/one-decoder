import { type DecodeErrorCode, type EncodeErrorCode } from './errors';

type ValueOrPromise<T> = T | Promise<T>;
export interface DecoderPluginInfo {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
  readonly author?: string;
  readonly link?: string;
  readonly needKey?: boolean;
  readonly encoderHelpMessage?: string;
  readonly needNetwork?: boolean;
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

export interface DecodeSuccessResult extends DecoderPluginInfo {
  score: number;
  decoded: string;
}
interface DecodeFailureResult extends DecoderPluginInfo {
  score: number;
  errorCode: DecodeErrorCode;
  errorMessage: string;
}

export type DecodeResult = DecodeSuccessResult | DecodeFailureResult;
export function isDecodeSuccessResult(
  result: DecodeResult,
): result is DecodeSuccessResult {
  return 'decoded' in result;
}

export interface EncodeSuccessResult extends DecoderPluginInfo {
  encoded: string;
}
export interface EncodeFailureResult extends DecoderPluginInfo {
  errorCode: EncodeErrorCode;
  errorMessage: string;
}

export type EncodeResult = EncodeSuccessResult | EncodeFailureResult;
export function isEncodeSuccessResult(
  result: EncodeResult,
): result is EncodeSuccessResult {
  return 'encoded' in result;
}
