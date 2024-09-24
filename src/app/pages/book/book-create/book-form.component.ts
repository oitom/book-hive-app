import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, AbstractControl, ValidatorFn } from '@angular/forms';
import { BookService } from '../../../services/book.service';
import { Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { CurrencyMaskDirective } from '../../../directives/currency-mask.directive';

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

  validatePreco(control: any) {
    const value = control.value;
    if (value === null || value === '' || parseFloat(value.replace('.', '').replace(',', '.')) <= 0) {
      return { invalidPreco: true };
    }
    return null;
  }

  onSubmit(): boolean {
    this.submitted = true;
    if (this.bookForm.valid) {

      if(this.autores.length === 0) {
        this.erroAutor = true;
        return false;
      }

      if(this.assuntos.length === 0) {
        this.erroAssunto = true;
        return false;
      }

      const precoValue = this.bookForm.value.preco;
      const precoNumerico = parseFloat(precoValue.replace('.', '').replace(',', '.'));

      const payload = {
        ...this.bookForm.value,
        preco: precoNumerico,
        anoPublicacao: String(this.bookForm.value.anoPublicacao),
        autores: this.autores.map(nome => ({ nome })),
        assuntos: this.assuntos.map(descricao => ({ descricao }))
      };
      delete payload.assunto;
      delete payload.autor;

      this.bookService.addBook(payload).subscribe(() => {
        this.successMessage = 'Livro cadastrado com sucesso!';

        setTimeout(() => {
          this.successMessage = '';
          this.router.navigate(['/']);
        }, 2000);

      });
    } else {
      if(this.autores.length == 0) {
        this.erroAutor = true;
      }

      if(this.assuntos.length == 0) {
        this.erroAssunto = true;
      }

      const controls = this.bookForm.controls;
      for (const name in controls) {
        if (controls[name].invalid) {
          controls[name].markAsTouched();
        }
      }
      return false;
    }

    return true;
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
