import { Injectable } from '@angular/core';
import { Decoder } from '../../decoders/decoder';
import { type DecoderPlugin } from '../../decoders/types';
import { getPluginList } from '../../plugins/enabled';

function getPlugins() {
  return getPluginList().map((Plugin) => new Plugin() as DecoderPlugin);
}

@Injectable({ providedIn: 'root' })
export class DecodingService {
  private decoder = new Decoder(getPlugins());

  getPluginsList() {
    return this.decoder.getPluginsList();
  }

  decode(input: string, key?: string) {
    return this.decoder.decode(input, key);
  }

  decodeAsync(input: string, key?: string) {
    return this.decoder.decodeAsync(input, key);
  }

  encode(ids: string[], input: string, key?: string) {
    return this.decoder.encode(ids, input, key);
  }

  encodeAsync(ids: string[], input: string, key?: string) {
    return this.decoder.encodeAsync(ids, input, key);
  }
}
