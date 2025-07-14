import type { DecoderPlugin } from './types';

import { Base64Decoder } from './basic/base64';
import { EscapeDecoder } from './basic/escape';
import { HexDecoder } from './basic/hex';
import { MorseDecoder } from './basic/morse';
import { UrlDecoder } from './basic/url';
import { AbracadabraDecoder } from './plugins/abracadabra';
import { BeastDecoder, BeastNoEmbedDecoder } from './plugins/beast';
import { BuddhaDecoder } from './plugins/buddha';
import { CherugoDecoder } from './plugins/cherugo';
import { CoreValueDecoder } from './plugins/core-value';
import { HiddenWatermarkDecoder } from './plugins/hidden-watermark';
import { HouDecoder } from './plugins/hou';
import { BVDecoder } from './plugins/others/bilibili';
import { MysteryCodeDecoders } from './plugins/others/mystery-codes';
import { NBNHHSHDecoder } from './plugins/others/nbnhhsh';
import { YoutubeDecoder } from './plugins/others/youtube';
import { WhispererDecoder } from './plugins/whisperer';
import { ZeroWidthDecoder } from './plugins/zero-width';

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
