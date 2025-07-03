import { ClipboardModule } from '@angular/cdk/clipboard';
import { Component, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { type DecodeSuccessResult } from '../../../../decoders/types';

@Component({
  selector: 'app-result-card',
  imports: [ClipboardModule, MatCardModule, MatButtonModule],
  templateUrl: './result-card.html',
  styleUrl: './result-card.scss',
})
export class ResultCard {
  result = input.required<DecodeSuccessResult>();

  copied = signal(false);
  showCopied() {
    this.copied.set(true);
    setTimeout(() => {
      this.copied.set(false);
    }, 2000);
  }
}
