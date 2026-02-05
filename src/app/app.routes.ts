import { Routes } from '@angular/router';
import { SoaPageComponent } from './soa/soa-page.component';

export const routes: Routes = [
  { path: '', component: SoaPageComponent },
  { path: '**', redirectTo: '' }
];