import { type DecoderPlugin } from '../../types';

export class YoutubeDecoder implements DecoderPlugin {
  id = 'youtube';
  name = 'YouTube';
  hide = true;

  checkString(input: string): number {
    const match = input.match(/(v=)?[\w-]{11}(&.+)?$/);
    if (match) {
      if (match[1]) {
        return 99;
      }
      return 30;
    }
    return 0;
  }

  decode(input: string): string {
    const videoId = input.split('v=').pop()?.split('&')[0];
    return 'https://www.youtube.com/watch?v=' + videoId;
  }
}
