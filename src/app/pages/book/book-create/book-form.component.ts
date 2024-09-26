import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { BookService } from '../../../services/book.service';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { CurrencyMaskDirective } from '../../../directives/currency-mask.directive';
import { debounceTime, filter, map, switchMap } from 'rxjs/operators';
import { BookResponse } from './../../../models/bookResponse'
import { BookItem } from './../../../models/bookItem.model'
import { fromEvent } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { Book } from '../../../models/book.model';

@Component({
  selector: 'app-book-form',
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    MatAutocompleteModule,
    CommonModule,
    CurrencyMaskDirective
  ],
})
export class BookFormComponent {
  bookForm: FormGroup;
  autores: any[] = [];
  assuntos: any[] = [];
  submitted: boolean = false;
  erroAssunto: boolean = false;
  erroAutor: boolean = false;
  successMessage: string = '';
  errorMessage: string = '';
  suggestions: string[] = [];

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private router: Router,
  ) {
    this.bookForm = this.fb.group({
      titulo: ['', Validators.required],
      editora: ['', Validators.required],
      edicao: [null, Validators.required],
      anoPublicacao: [null, [Validators.required, Validators.min(1900)]],
      preco: [null, [Validators.required, this.validatePreco]],
      autor: [''],
      assunto: [''],
    });
  }

  ngOnInit(): void {
    const tituloInput = this.bookForm.get('titulo');

    if (tituloInput) {
      const tituloInputElement = document.querySelector('input[formControlName="titulo"]');

      if (tituloInputElement) {
        fromEvent(tituloInputElement, 'keyup')
          .pipe(
            debounceTime(0),
            map(() => tituloInput.value),
            filter((value: string) => value.length > 5),
            switchMap(value => this.bookService.searchBooks(value))
          )
          .subscribe((response: BookResponse) => {
            this.suggestions = response.data?.items?.map((item: BookItem) => item.volumeInfo.title) || [];
          });
      }
    }
  }

  onSuggestionSelected(suggestion: string) {
    this.bookService.searchBooks(suggestion)
      .pipe(
        switchMap((response: BookResponse) => {
          const bookItem = response.data?.items?.find(item => item.volumeInfo.title === suggestion);
          if (bookItem) {
            this.bookForm.patchValue({
              editora: bookItem.volumeInfo.publisher || '',
              edicao: 1,
              anoPublicacao: bookItem.volumeInfo.publishedDate?.split('-')[0] || '',
              preco: this.formatarPreco(bookItem.saleInfo?.listPrice?.amount) || null,
            });
            this.autores = bookItem.volumeInfo.authors || [];
            this.assuntos = bookItem.volumeInfo.categories || [];
          }
          return [];
        })
      )
      .subscribe();
  }

  handleInput(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.value.length > 5)
      this.bookService.searchBooks(input.value);
  }

  validatePreco(control: any) {
    const value = control.value;

    if (value === null || value === '') {
      return { invalidPreco: true };
    }
    if (typeof value === 'number' && value > 0) {
      return null;
    }
    const parsedValue = parseFloat(value.toString().replace('.', '').replace(',', '.'));
    if (isNaN(parsedValue) || parsedValue <= 0) {
      return { invalidPreco: true };
    }

    return null;
  }

  formatarPreco(valor: number): string {
    if(valor)
      return valor.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

    return '';
  }

  onSubmit(): boolean {
    this.submitted = true;

    if (this.bookForm.valid) {
      if (this.autores.length === 0) {
        this.erroAutor = true;
        return false;
      }
      if (this.assuntos.length === 0) {
        this.erroAssunto = true;
        return false;
      }

      const precoValue = this.bookForm.value.preco;
      const precoNumerico = parseFloat(precoValue.replace('.', '').replace(',', '.'));

      const payload = {
        ...this.bookForm.value,
        preco: precoNumerico,
        titulo: this.bookForm.value.titulo.length > 38
          ? this.bookForm.value.titulo.substring(0, 38)
          : this.bookForm.value.titulo,
        anoPublicacao: String(this.bookForm.value.anoPublicacao),
        autores: this.autores.map(nome => ({ nome })),
        assuntos: this.assuntos.map(descricao => ({ descricao }))
      };

      delete payload.assunto;
      delete payload.autor;

      this.bookService.addBook(payload).subscribe({
        next: (response: HttpResponse<Book>) => {
          if (response.status === 201) {
            this.successMessage = 'Livro cadastrado com sucesso!';
            setTimeout(() => {
              this.successMessage = '';
              this.router.navigate(['/']);
            }, 2000);
            return true;
          } else {
            this.errorMessage = 'Erro ao cadastrar livro!';
            return false;
          }
        },
        error: () => {
          this.errorMessage =  'Erro ao cadastrar livro!';
          return false;
        }
      });

    } else {
      if (this.autores.length === 0) {
        this.erroAutor = true;
      }
      if (this.assuntos.length === 0) {
        this.erroAssunto = true;
      }
      const controls = this.bookForm.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          controls[name].markAsTouched();
        }
      }

    }
    return false;
  }

  addAutor(): boolean {
    const autorName = this.bookForm.get('autor')?.value;
    if (autorName) {
      this.autores.push(autorName);
      this.erroAutor = false;
      this.bookForm.get('autor')?.reset();
    }
    return false;
  }

  removeAutor(index: any): boolean {
    this.autores.splice(index, 1);
    return false;
  }

  addAssunto(): boolean {
    const assuntoDesc = this.bookForm.get('assunto')?.value;
    if (assuntoDesc) {
      this.assuntos.push(assuntoDesc);
      this.erroAssunto = false;
      this.bookForm.get('assunto')?.reset();
    }
    return false;
  }

  removerAssunto(index: any): boolean {
    this.assuntos.splice(index, 1);
    return false;
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
