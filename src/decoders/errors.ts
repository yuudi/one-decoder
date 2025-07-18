export const enum DecodeErrorCode {
  Other = 1000,
  NoResult = 1001,
  DecoderSkipped = 1010,
  InvalidInput = 1100,
  InvalidKey = 1200,
  NetworkRequired = 1300,
  NetworkError = 1310,
  Unknown = 1999,
}

export const enum EncodeErrorCode {
  Other = 2000,
  EncoderIdNotFound = 2001,
  InvalidInput = 2100,
  InvalidKey = 2200,
  NetworkRequired = 2300,
  Unknown = 2999,
}

export class OneDecoderError extends Error {
  public readonly code?: number;
  override toString(): string {
    const inherited = super.toString();
    return this.code !== undefined
      ? `(code: ${this.code}) ${inherited}`
      : inherited;
  }
}

export class DecodeError extends OneDecoderError {
  public override readonly code: DecodeErrorCode;
  constructor(
    message?: string,
    options?: ErrorOptions & { code?: DecodeErrorCode },
  ) {
    super(message, options);
    this.code = options?.code ?? DecodeErrorCode.Unknown;
  }
}

export class EncodeError extends OneDecoderError {
  public override readonly code: EncodeErrorCode;
  constructor(
    message?: string,
    options?: ErrorOptions & { code?: EncodeErrorCode },
  ) {
    super(message, options);
    this.code = options?.code ?? EncodeErrorCode.Unknown;
  }
}
