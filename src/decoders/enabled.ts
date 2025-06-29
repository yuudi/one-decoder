import type { DecoderPlugin } from './decoder';

import { Base64Decoder } from './basic/base64';
import { HexDecoder } from './basic/hex';
import { BeastDecoder } from './plugins/beast';
import { CherugoDecoder } from './plugins/cherugo';
import { AbracadabraDecoder } from './plugins/abracadabra';
import { BuddhaDecoder as BuddhaTakuronDecoder } from './plugins/buddha-takuron';
import { BuddhaDecoder as BuddhaTakuronV2Decoder } from './plugins/buddha-takuronV2';
import { WhispererDecoder } from './plugins/whisperer';

type DecoderPluginConstructor = new () => DecoderPlugin;

export function getPluginList(): DecoderPluginConstructor[] {
  return [
    Base64Decoder,
    HexDecoder,
    AbracadabraDecoder,
    BeastDecoder,
    BuddhaTakuronDecoder,
    BuddhaTakuronV2Decoder,
    CherugoDecoder,
    WhispererDecoder,
  ];
}
