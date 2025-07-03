import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { type EncodeFailureResult } from '../../../../decoders/types';

@Component({
  selector: 'app-result-error-card',
  imports: [MatCardModule, MatIconModule],
  templateUrl: './result-error-card.html',
  styleUrl: './result-error-card.scss',
})
export class ResultErrorCard {
  result = input.required<EncodeFailureResult>();
}
