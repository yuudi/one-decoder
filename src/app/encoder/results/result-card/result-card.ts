import { ClipboardModule } from '@angular/cdk/clipboard';
import { Component, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { EncodeResult } from '../../../../decoders/decoder';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-result-card',
  imports: [ClipboardModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './result-card.html',
  styleUrl: './result-card.scss',
})
export class ResultCard {
  result = input<EncodeResult>();

  copied = signal(false);
  showCopied() {
    this.copied.set(true);
    setTimeout(() => {
      this.copied.set(false);
    }, 2000);
  }
}
