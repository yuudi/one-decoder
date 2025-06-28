import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Decoding } from './decoding';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Results } from './result/results';
import { DecodeResult } from '../../decoders/decoder';

@Component({
  selector: 'app-decoder',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    Results,
  ],
  templateUrl: './decoder.html',
  styleUrl: './decoder.scss',
})
export class Decoder {
  input = '';
  output: DecodeResult[] | null = null;
  decoding = inject(Decoding);

  async decode() {
    // Placeholder for decode logic
    this.output = await this.decoding.decode(this.input);
  }
}
