import { Injectable } from '@angular/core';
import { Decoder } from '../decoders/decoder';

@Injectable({ providedIn: 'root' })
export class DecodingService {
  private decoder = new Decoder();

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
