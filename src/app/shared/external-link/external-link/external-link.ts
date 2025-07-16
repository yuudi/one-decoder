import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-external-link',
  imports: [MatIconModule],
  templateUrl: './external-link.html',
  styleUrl: './external-link.scss',
})
export class ExternalLink {
  href = input.required<string>();
}
