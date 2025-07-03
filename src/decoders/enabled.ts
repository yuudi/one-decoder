import type { DecoderPlugin } from './decoder';

import { Base64Decoder } from './basic/base64';
import { EscapeDecoder } from './basic/escape';
import { HexDecoder } from './basic/hex';
import { MorseDecoder } from './basic/morse';
import { UrlDecoder } from './basic/url';
import { AbracadabraDecoder } from './plugins/abracadabra';
import { BeastDecoder } from './plugins/beast';
import { BuddhaDecoder } from './plugins/buddha';
import { CherugoDecoder } from './plugins/cherugo';
import { CoreValueDecoder } from './plugins/core-value';
import { BVDecoder } from './plugins/others/bilibili';
import { MysteryCodeDecoders } from './plugins/others/mystery-codes';
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
    BuddhaDecoder,
    BeastDecoder,
    CoreValueDecoder,
    ZeroWidthDecoder,
    CherugoDecoder,
    AbracadabraDecoder,
    WhispererDecoder,
    ...MysteryCodeDecoders,
  ];
}
