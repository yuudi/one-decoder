import { type DecodeErrorCode, type EncodeErrorCode } from './errors';

type ValueOrPromise<T> = T | Promise<T>;
interface DecoderPluginInfo {
  readonly id: string;
  readonly name: string;
  readonly description?: string;
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

export interface DecodeSuccessResult {
  name: string;
  description?: string;
  score: number;
  decoded: string;
}
interface DecodeFailureResult {
  name: string;
  description?: string;
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

export interface EncodeSuccessResult {
  name: string;
  description?: string;
  encoded: string;
}
export interface EncodeFailureResult {
  name: string;
  description?: string;
  errorCode: EncodeErrorCode;
  errorMessage: string;
}

export type EncodeResult = EncodeSuccessResult | EncodeFailureResult;
export function isEncodeSuccessResult(
  result: EncodeResult,
): result is EncodeSuccessResult {
  return 'encoded' in result;
}
