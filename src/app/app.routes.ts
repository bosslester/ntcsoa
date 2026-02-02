import { Routes } from '@angular/router';
import { SoaFormComponent } from './components/soa-form/soa-form.component';

export const routes: Routes = [
  { path: '', component: SoaFormComponent },
  { path: '**', redirectTo: '' }
];

