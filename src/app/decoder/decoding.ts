import { Injectable } from '@angular/core';
import { Decoder } from '../../decoders/decoder';

@Injectable({ providedIn: 'root' })
export class Decoding {
  decoder = new Decoder();

  decode(input: string, key?: string) {
    return this.decoder.decode(input, key);
  }
}
