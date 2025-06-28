import { Component, input } from '@angular/core';
import { DecodeResult } from '../../../decoders/decoder';
import { CommonModule } from '@angular/common';
import { ResultCard } from './result-card/result-card';

@Component({
  selector: 'app-results',
  imports: [CommonModule, ResultCard],
  templateUrl: './results.html',
  styleUrl: './results.scss',
})
export class Results {
  results = input<DecodeResult[] | null>(null);
}
