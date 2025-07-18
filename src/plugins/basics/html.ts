import { decodeHTML, encodeHTML } from 'entities';
import { Plugin } from '../../decoders/decorators';

@Plugin({ id: 'html-entities', name: 'HTML实体' })
export class HtmlDecoder {
  checkString(input: string) {
    if (input.includes('&') && input.includes(';')) {
      return 50;
    }

    return 0;
  }

  decode(input: string): string {
    return decodeHTML(input);
  }

  encode(input: string): string {
    return input.replace(/./g, (char) => {
      const namedEntity = encodeHTML(char);
      if (namedEntity !== char) {
        return namedEntity;
      }
      const unicode = char.charCodeAt(0);
      return `&#${unicode};`;
    });
  }
}
