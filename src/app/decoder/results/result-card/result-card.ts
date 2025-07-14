import { ClipboardModule } from '@angular/cdk/clipboard';
import { Component, input, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { ExternalLink } from '../../../../common/external-link/external-link/external-link';
import { QRcode } from '../../../../common/qrcode/qrcode';
import { type DecodeSuccessResult } from '../../../../decoders/types';

@Component({
  selector: 'app-result-card',
  imports: [
    ClipboardModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    ExternalLink,
    QRcode,
  ],
  templateUrl: './result-card.html',
  styleUrl: './result-card.scss',
})
export class ResultCard {
  result = input.required<DecodeSuccessResult>();
  showScore = input(false);
  canShare = navigator.share !== undefined;

  copied = signal(false);
  showQRCode = signal(false);

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
