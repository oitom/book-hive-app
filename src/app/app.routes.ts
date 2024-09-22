import { Routes } from '@angular/router';
import { MainComponent } from './pages/main/main.component';
import { BookFormComponent } from './pages/book/book-create/book-form.component';
import { BookEditComponent } from './pages/book/book-edit/book-edit.component';
import { LayoutComponent } from './layout/layout.component';
import { PageNotFoundComponent } from './layout/page-not-found/page-not-found.component';

export const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', component: MainComponent },
      { path: 'book/create', component: BookFormComponent },
      { path: 'book/edit/:id', component: BookEditComponent },
      { path: '**', component: PageNotFoundComponent }
    ]
  },
];
