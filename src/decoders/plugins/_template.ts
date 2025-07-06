import { type DecoderPlugin } from '../types';

export class NewDecoder implements DecoderPlugin {
  id = 'new-decoder'; // Unique identifier, contains only lowercase letters, numbers, and hyphens
  name = 'New Decoder Plugin'; // Display name

  // Analyze the input string and return a confidence score (0-100)
  // score is just a very subjective value, you can implement your own logic
  checkString(input: string): number {
    if (/^[a-zA-Z0-9]+$/.test(input)) {
      return 100; // High score for alphanumeric strings
    }

    return 0; // Low score for other cases
  }

  // Decode
  decode(input: string): string {
    return input;
  }

  // // Optionally implement encoding
  // encode(input: string): string {
  //   return input;
  // }
}
