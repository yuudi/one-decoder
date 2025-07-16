import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { type DecodeFailureResult } from '../../../../decoders/types';
import { ExternalLink } from '../../../shared/external-link/external-link/external-link';

@Component({
  selector: 'app-result-error-card',
  imports: [MatCardModule, MatIconModule, ExternalLink],
  templateUrl: './result-error-card.html',
  styleUrl: './result-error-card.scss',
})
export class ResultErrorCard {
  result = input.required<DecodeFailureResult>();
  showScore = input(false);
}
