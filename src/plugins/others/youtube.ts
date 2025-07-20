import { Plugin } from '../../decoders/decorators';

@Plugin({
  id: 'youtube',
  name: 'YouTube',
  hide: true,
})
export class YoutubeDecoder {
  checkString(input: string): number {
    const match = input.match(/^(?:(?:.*\?)?v=)?[\w-]{11}(&.+)?$/);
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
