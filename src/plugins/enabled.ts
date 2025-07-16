import type { DecoderPlugin } from '../decoders/types';
import { Base64Decoder } from './basic/base64';
import { EscapeDecoder } from './basic/escape';
import { HexDecoder } from './basic/hex';
import { MorseDecoder } from './basic/morse';
import { UrlDecoder } from './basic/url';
import { AbracadabraDecoder } from './memes/abracadabra';
import { BeastDecoder, BeastNoEmbedDecoder } from './memes/beast';
import { BuddhaDecoder } from './memes/buddha';
import { CherugoDecoder } from './memes/cherugo';
import { CoreValueDecoder } from './memes/core-value';
import { HiddenWatermarkDecoder } from './memes/hidden-watermark';
import { HouDecoder } from './memes/hou';
import { WhispererDecoder } from './memes/whisperer';
import { ZeroWidthDecoder } from './memes/zero-width';
import { BVDecoder } from './others/bilibili';
import { MysteryCodeDecoders } from './others/mystery-codes';
import { NBNHHSHDecoder } from './others/nbnhhsh';
import { YoutubeDecoder } from './others/youtube';

type DecoderPluginConstructor = new () => DecoderPlugin;

export function getPluginList(): DecoderPluginConstructor[] {
  return [
    // this order shows in encoder page
    Base64Decoder,
    HexDecoder,
    UrlDecoder,
    EscapeDecoder,
    MorseDecoder,
    BVDecoder,
    YoutubeDecoder,
    BuddhaDecoder,
    BeastDecoder,
    BeastNoEmbedDecoder,
    CoreValueDecoder,
    ZeroWidthDecoder,
    HiddenWatermarkDecoder,
    CherugoDecoder,
    AbracadabraDecoder,
    WhispererDecoder,
    HouDecoder,
    NBNHHSHDecoder,
    ...MysteryCodeDecoders,
  ];
}
