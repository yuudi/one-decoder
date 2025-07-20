import { Component, inject, model, type OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ActivatedRoute, Router } from '@angular/router';
import { type DecodeResult } from '../../decoders/types';
import { DecodingService } from '../shared/decodingService';
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
export class Decoder implements OnInit {
  input = model('');
  key = model('');
  output: Promise<DecodeResult>[] | null = null;
  outputHasKey = signal(false); // only update at `decode` clicked
  decoding = signal(false);

  private decodeService = inject(DecodingService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  ngOnInit() {
    this.handleInputQuery();
  }

  private handleInputQuery() {
    const inputFromQuery = this.route.snapshot.queryParams['input'];
    if (inputFromQuery) {
      this.input.set(inputFromQuery);
      // Clear the input query parameter from URL
      const queryParams = { ...this.route.snapshot.queryParams };
      delete queryParams['input'];
      this.router.navigate([], {
        relativeTo: this.route,
        queryParams,
        replaceUrl: true,
      });
      this.decode();
    }
  }

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
