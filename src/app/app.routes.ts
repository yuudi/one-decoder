import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/decoder', pathMatch: 'full' },
  {
    path: 'decoder',
    loadComponent: () => import('./decoder/decoder').then((m) => m.Decoder),
  },
  {
    path: 'encoder',
    loadComponent: () => import('./encoder/encoder').then((m) => m.Encoder),
  },
  {
    path: 'about',
    loadComponent: () => import('./about/about').then((m) => m.About),
  },
];
