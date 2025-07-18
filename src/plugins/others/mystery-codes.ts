import { Plugin } from '../../decoders/decorators';
import { DecodeError, DecodeErrorCode } from '../../decoders/errors';

@Plugin({
  id: 'magnet',
  name: '磁力',
  hide: true,
})
class MagnetDecoder {
  checkString(input: string): number {
    const match = input.match(
      /^(.*btih:)?([0-9a-fA-F]{40}|[a-zA-Z2-7]{32})(&.+)?$/,
    );
    if (match) {
      if (match[1]) {
        // If the input starts with 'btih:', it is probably a valid magnet link
        return 99;
      }
      // If it is a valid hash, it might be a magnet link
      return 10;
    }
    return 0;
  }

  decode(input: string): string {
    const hash = input.split('btih:').pop()?.split('&');
    return 'magnet:?xt=urn:btih:' + hash;
  }
}

@Plugin({
  id: 'fc2',
  name: 'FC2',
  hide: true,
})
class Fc2Decoder {
  checkString(input: string): number {
    if (/^FC2-(PPV-)?\d+$/i.test(input)) {
      return 100;
    }
    return 0;
  }

  decode(input: string): string {
    return 'https://adult.contents.fc2.com/article/' + input.split('-').pop();
  }
}

@Plugin({
  id: 'dlsite',
  name: 'DLSite',
  hide: true,
})
class DLsiteDecoder {
  checkString(input: string): number {
    if (/^RJ\d+$/i.test(input)) {
      return 100;
    }
    return 0;
  }

  decode(input: string): string {
    return 'https://www.dlsite.com/maniax/work/=/product_id/' + input + '.html';
  }
}

@Plugin({
  id: 'pixiv',
  name: 'Pixiv',
  hide: true,
})
class PixivDecoder {
  checkString(input: string): number {
    if (/^\d{5,10}_p\d{1,2}$/.test(input)) {
      return 100;
    }
    if (/^pid:?\d{5,10}$/.test(input)) {
      return 100;
    }
    return 0;
  }

  decode(input: string): string {
    if (/^\d{5,10}_p\d{1,2}$/.test(input)) {
      return 'https://www.pixiv.net/artworks/' + input.split('_')[0];
    }
    if (/^pid:?\d{5,10}$/.test(input)) {
      return 'https://www.pixiv.net/artworks/' + input.split(':')[1];
    }
    throw new DecodeError('Invalid input format', {
      code: DecodeErrorCode.Unknown,
    });
  }
}

@Plugin({
  id: '18comic',
  name: '禁漫天堂',
  hide: true,
})
class JMDecoder {
  checkString(input: string): number {
    if (/^jm\d+$/i.test(input)) {
      return 100;
    }
    return 0;
  }

  decode(input: string): string {
    return 'https://18comic.vip/album/' + input.slice(2);
  }
}

export const MysteryCodeDecoders = [
  MagnetDecoder,
  Fc2Decoder,
  DLsiteDecoder,
  PixivDecoder,
  JMDecoder,
];
