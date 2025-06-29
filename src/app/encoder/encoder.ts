import { Component, effect, inject, model, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { DecodingService } from '../../common/decodingService';
import { EncodeResult } from '../../decoders/decoder';
import { Results } from './results/results';

@Component({
  selector: 'app-encoder',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatListModule,
    MatInputModule,
    MatButtonModule,
    MatSlideToggleModule,
    Results,
  ],
  templateUrl: './encoder.html',
  styleUrl: './encoder.scss',
})
export class Encoder {
  input = model('');
  useKey = model(false);
  key = model('');
  selectedPlugin = model<string[]>([]);
  output: Promise<EncodeResult>[] | null = null;
  private decodeService = inject(DecodingService);
  plugins = this.decodeService.getPluginsList();
  encoding = signal(false);

  constructor() {
    this.setupSelectedPluginStorage();
  }

  private readonly selectedPluginStorageKey =
    'one-revealer.encoder.selectedPlugin';
  private setupSelectedPluginStorage() {
    //save to storage
    effect(() => {
      localStorage.setItem(
        this.selectedPluginStorageKey,
        JSON.stringify(this.selectedPlugin()),
      );
    });

    // restore from storage
    const savedSelectedJson = localStorage.getItem(
      this.selectedPluginStorageKey,
    );
    if (savedSelectedJson) {
      const savedSelected = JSON.parse(savedSelectedJson);
      this.selectedPlugin.set(savedSelected);
    }
  }

  encode() {
    if (this.encoding()) return; // Prevent multiple clicks
    this.encoding.set(true);
    let ids = this.selectedPlugin();
    const input = this.input();
    const key = this.useKey() ? this.key() : undefined;

    if (key) {
      ids = ids.filter(
        (id) => this.plugins.find((plugin) => plugin.id === id)?.needKey,
      );
    }

    this.output = this.decodeService.encodeAsync(ids, input, key);
    Promise.allSettled(this.output).then(() => {
      this.encoding.set(false);
    });
  }
}
