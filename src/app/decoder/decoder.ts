import { Component, inject, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { DecodingService } from '../../common/decodingService';
import { type DecodeResult } from '../../decoders/types';
import { Results } from './results/results';

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
  input = model('');
  key = model('');
  output: Promise<DecodeResult>[] | null = null;
  outputHasKey = signal(false); // only update at `decode` clicked
  private decodeService = inject(DecodingService);
  decoding = signal(false);

  decode() {
    if (this.decoding()) return; // Prevent multiple clicks
    this.decoding.set(true);
    this.outputHasKey.set(this.key().length > 0);
    this.output = this.decodeService.decodeAsync(this.input(), this.key());
    Promise.allSettled(this.output).then(() => {
      this.decoding.set(false);
    });
  }
}
