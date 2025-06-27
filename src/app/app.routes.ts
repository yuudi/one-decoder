import { Routes } from '@angular/router';
import { Decoder } from './decoder/decoder';

export const routes: Routes = [
  { path: '', redirectTo: '/decoder', pathMatch: 'full' },
  { path: 'decoder', component: Decoder },
];
