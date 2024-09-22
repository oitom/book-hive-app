import { Routes } from '@angular/router';
import { MainComponent } from './main/main.component';
import { BookFormComponent } from './book-form/book-form.component';
import { BookEditComponent } from './book-edit/book-edit.component';

export const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'book/create', component: BookFormComponent },
  { path: 'book/edit/:id', component: BookEditComponent  },
];
