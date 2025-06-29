import { type DecoderPlugin } from '../../decoder';

class MagnetDecoder implements DecoderPlugin {
  id = 'magnet';
  name = '磁力';
  hide = true;

  checkString(input: string): number {
    if (/^(.*btih:)?([0-9a-fA-F]{40}|[a-zA-Z2-7]{32})(&.+)?$/.test(input)) {
      return 95;
    }
    return 0;
  }

  decode(input: string): string {
    const hash = input.split('btih:').pop()?.split('&');
    return 'magnet:?xt=urn:btih:' + hash;
  }
}

class Fc2Decoder implements DecoderPlugin {
  id = 'fc2';
  name = 'FC2';
  hide = true;

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

class DLsiteDecoder implements DecoderPlugin {
  id = 'dlsite';
  name = 'DLSite';
  hide = true;

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

class PixivDecoder implements DecoderPlugin {
  id = 'pixiv';
  name = 'Pixiv';
  hide = true;

  checkString(input: string): number {
    if (/^\d{5,10}_p\d{1,2}$/.test(input)) {
      return 100;
    }
    return 0;
  }

  decode(input: string): string {
    return 'https://www.pixiv.net/artworks/' + input.split('_')[0];
  }
}

class JMDecoder implements DecoderPlugin {
  id = '18comic';
  name = '禁漫天堂';
  hide = true;

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
