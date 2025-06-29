import { Component, inject, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DecodingService } from './decodingService';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Results } from './results/results';
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
  input = model('');
  key = model('');
  output: Promise<DecodeResult>[] | null = null;
  private decodeService = inject(DecodingService);
  decoding = signal(false);

  decode() {
    if (this.decoding()) return; // Prevent multiple clicks
    this.decoding.set(true);
    this.output = this.decodeService.decodeAsync(this.input(), this.key());
    Promise.allSettled(this.output).then(() => {
      this.decoding.set(false);
    });
  }
}
