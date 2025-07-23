import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'a[app-external-link]',
  imports: [MatIconModule],
  templateUrl: './external-link.html',
  styleUrl: './external-link.scss',
  host: {
    '[href]': 'href()',
    target: '_blank',
    rel: 'noopener noreferrer',
  },
})
export class ExternalLink {
  href = input.required<string>({ alias: 'app-external-link' });
}
