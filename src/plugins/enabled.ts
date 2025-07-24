import type { DecoderPluginImplement } from '../decoders/types';
import { AES256Decoders } from './basics/aes256';
import { Base32Decoder } from './basics/base32';
import { Base58Decoder } from './basics/base58';
import { Base64Decoder } from './basics/base64';
import { EscapeDecoder } from './basics/escape';
import { HexDecoder } from './basics/hex';
import { HtmlDecoder } from './basics/html';
import { MorseDecoder } from './basics/morse';
import { PunycodeDecoder } from './basics/punycode';
import { UrlDecoder } from './basics/url';
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
import { YoutubeDecoder } from './others/youtube';

type DecoderPluginConstructor = new () => DecoderPluginImplement;

export function getPluginList(): DecoderPluginConstructor[] {
  return [
    // this order shows in encoder page
    Base64Decoder,
    Base32Decoder,
    Base58Decoder,
    HexDecoder,
    UrlDecoder,
    EscapeDecoder,
    HtmlDecoder,
    MorseDecoder,
    PunycodeDecoder,
    ...AES256Decoders,
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
    ...MysteryCodeDecoders,
  ];
}
