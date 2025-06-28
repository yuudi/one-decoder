import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/decoder', pathMatch: 'full' },
  {
    path: 'decoder',
    loadComponent: () => import('./decoder/decoder').then((m) => m.Decoder),
  },
  {
    path: 'about',
    loadComponent: () => import('./about/about').then((m) => m.About),
  },
];
