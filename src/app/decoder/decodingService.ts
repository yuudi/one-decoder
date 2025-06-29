import { Injectable } from '@angular/core';
import { Decoder } from '../../decoders/decoder';

@Injectable({ providedIn: 'root' })
export class DecodingService {
  decoder = new Decoder();

  decode(input: string, key?: string) {
    return this.decoder.decode(input, key);
  }

  decodeAsync(input: string, key?: string) {
    return this.decoder.decodeAsync(input, key);
  }
}
