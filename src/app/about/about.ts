import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { DecodingService } from '../shared/decodingService';
import { ExternalLink } from '../shared/external-link/external-link/external-link';

@Component({
  selector: 'app-about',
  imports: [MatTabsModule, MatCardModule, MatIconModule, ExternalLink],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  baseUrl = window.location.origin + window.location.pathname;
  private decodeService = inject(DecodingService);
  pluginList = this.decodeService.getPluginsList();
}
