import { type DecoderPlugin } from '../types';

export class NewDecoder implements DecoderPlugin {
  id = 'new-decoder';
  name = 'New Decoder Plugin';

  checkString(input: string): number {
    if (/^[a-zA-Z0-9]+$/.test(input)) {
      return 100; // High score for alphanumeric strings
    }

    return 0; // Low score for other cases
  }

  decode(input: string): string {
    return input;
  }
}
