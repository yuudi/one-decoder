import type { DecoderPlugin } from './decoder';

import { Base64Decoder } from './basic/base64';
import { HexDecoder } from './basic/hex';
import { MorseDecoder } from './basic/morse';
import { AbracadabraDecoder } from './plugins/abracadabra';
import { BeastDecoder } from './plugins/beast';
import { BuddhaDecoder } from './plugins/buddha';
import { CherugoDecoder } from './plugins/cherugo';
import { CoreValueDecoder } from './plugins/core-value';
import { BVDecoder } from './plugins/others/bilibili';
import { WhispererDecoder } from './plugins/whisperer';

type DecoderPluginConstructor = new () => DecoderPlugin;

export function getPluginList(): DecoderPluginConstructor[] {
  return [
    Base64Decoder,
    HexDecoder,
    MorseDecoder,
    BVDecoder,
    AbracadabraDecoder,
    BeastDecoder,
    BuddhaDecoder,
    CoreValueDecoder,
    CherugoDecoder,
    WhispererDecoder,
  ];
}
