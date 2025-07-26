import { Plugin } from '../decoders/decorators';

@Plugin({
  id: 'new-decoder', // Unique identifier, contains only lowercase letters, numbers, and hyphens
  name: 'New Decoder Plugin', // Display name

  // // Optional properties
  // description: 'Template for new plugins', // Description, shown in decoding result
  // author: 'name', // Author name, shown in about page
  // link: 'https://example.com', // Link to documentation or homepage, shown in decoding result and encoding result
  // encodeKey: 'not-allowed', // Whether the plugin needs a key, can be 'optional', 'required', or 'not-allowed', default is 'not-allowed'
  // encoderHelpMessage: '', // Shown in encoding page
  // needNetwork: false, // Whether the plugin need external API calls
  // hide: false, // Whether to hide this plugin in about page and encoding page
})
export class NewDecoder {
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

  // // All these methods can be async if needed
  // async checkString(input: string): Promise<number> {
  //   return 0;
  // }

  // async decode(input: string): Promise<string> {
  //   return input;
  // }

  // async encode(input: string): Promise<string> {
  //   return input;
  // }
}
