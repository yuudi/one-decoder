import { ClipboardModule } from '@angular/cdk/clipboard';
import { Component, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { type EncodeSuccessResult } from '../../../../decoders/types';

@Component({
  selector: 'app-result-success-card',
  imports: [ClipboardModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './result-success-card.html',
  styleUrl: './result-success-card.scss',
})
export class ResultSuccessCard {
  result = input.required<EncodeSuccessResult>();
  canShare = navigator.share !== undefined;

  copied = signal(false);
  showCopied() {
    this.copied.set(true);
    setTimeout(() => {
      this.copied.set(false);
    }, 2000);
  }
  share(text: string) {
    void navigator.share?.({
      text,
    });
  }
}
