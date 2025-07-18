import {
  Component,
  computed,
  effect,
  inject,
  model,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  type MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { type EncodeResult } from '../../decoders/types';
import { DecodingService } from '../shared/decodingService';
import { Results } from './results/results';

@Component({
  selector: 'app-encoder',
  imports: [
    FormsModule,
    MatFormFieldModule,
    MatListModule,
    MatInputModule,
    MatCheckboxModule,
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
  selectedAllStatus = computed(() => {
    const selected = this.selectedPlugin().length;
    if (selected === 0) return 'none';
    if (selected === this.plugins.length) return 'checked';
    return 'indeterminate';
  });
  output: Promise<EncodeResult>[] | null = null;
  private decodeService = inject(DecodingService);
  plugins = this.decodeService.getPluginsList();
  encoding = signal(false);

  constructor() {
    this.setupSelectedPluginStorage();
  }

  private readonly selectedPluginStorageKey =
    'one-decoder.encoder.selectedPlugin';
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

  selectAllCheckboxChange(event: MatCheckboxChange) {
    this.selectedPlugin.set(event.checked ? this.plugins.map((p) => p.id) : []);
  }
}
