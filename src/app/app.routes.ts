import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { BookFormComponent } from './book-form/book-form.component';

export const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'cadastro', component: BookFormComponent },
];
