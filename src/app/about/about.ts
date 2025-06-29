import { Component, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { DecodingService } from '../../common/decodingService';

@Component({
  selector: 'app-about',
  imports: [MatCardModule],
  templateUrl: './about.html',
  styleUrl: './about.scss',
})
export class About {
  private decodeService = inject(DecodingService);
  pluginList = this.decodeService.getPluginsList();
}
