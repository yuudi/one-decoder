import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { DecodingService } from '../shared/decodingService';
import { ExternalLink } from '../shared/external-link/external-link/external-link';

@Component({
  selector: 'app-about',
  imports: [MatCardModule, MatIconModule, ExternalLink],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  private decodeService = inject(DecodingService);
  pluginList = this.decodeService.getPluginsList();
}
