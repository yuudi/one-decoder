import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DomSanitizer } from '@angular/platform-browser';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    MatToolbarModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  isMobileDevice = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  installable = signal(false);
  installPWA = () => void 0;

  constructor() {
    const iconRegistry = inject(MatIconRegistry);
    const sanitizer = inject(DomSanitizer);
    iconRegistry.addSvgIcon(
      'github',
      sanitizer.bypassSecurityTrustResourceUrl('icons/github-mark.svg'),
      { viewBox: '0 0 98 96' },
    );

    // Customize PWA install behavior
    // This is non-standard Event, only available for Chrome
    // Other browsers will ignore this code
    window.addEventListener(
      'beforeinstallprompt',
      (
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        e: any /* (https://developer.mozilla.org/en-US/docs/Web/API/BeforeInstallPromptEvent) */,
      ) => {
        e.preventDefault();
        this.installable.set(true);
        this.installPWA = () => {
          this.installable.set(false);
          e.prompt();
        };
      },
    );
  }

  share() {
    void navigator.share({
      title: '统一解码',
      url: window.location.href,
    });
  }
}
