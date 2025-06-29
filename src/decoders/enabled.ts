import type { DecoderPlugin } from './decoder';

import { Base64Decoder } from './basic/base64';
import { HexDecoder } from './basic/hex';
import { BeastDecoder } from './plugins/beast';
import { CherugoDecoder } from './plugins/cherugo';
import { AbracadabraDecoder } from './plugins/abracadabra';
import { BuddhaDecoder } from './plugins/buddha';
import { WhispererDecoder } from './plugins/whisperer';

type DecoderPluginConstructor = new () => DecoderPlugin;

export function getPluginList(): DecoderPluginConstructor[] {
  return [
    Base64Decoder,
    HexDecoder,
    AbracadabraDecoder,
    BeastDecoder,
    BuddhaDecoder,
    CherugoDecoder,
    WhispererDecoder,
  ];
}
