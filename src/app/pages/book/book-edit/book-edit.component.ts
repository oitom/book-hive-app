import { Component, OnInit } from '@angular/core';
import { BookService } from '../../../services/book.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormArray, AbstractControl, ValidatorFn } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-book-edit',
  templateUrl: './book-edit.component.html',
  styleUrls: ['./book-edit.component.css'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule,
    MatIconModule,
    CommonModule
  ],
})
export class BookEditComponent implements OnInit {
  bookForm: FormGroup;
  autores: any[] = [];
  assuntos: any[] = [];
  submitted: boolean = false;
  erroAssunto: boolean = false;
  erroAutor: boolean = false;
  successMessage: string = '';
  bookId: number=0;

  constructor(
    private fb: FormBuilder,
    private bookService: BookService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.bookForm = this.fb.group({
      titulo: ['', Validators.required],
      editora: ['', Validators.required],
      edicao: [null, Validators.required],
      anoPublicacao: [null, [Validators.required, Validators.min(1900)]],
      preco: [0, [Validators.required, Validators.min(1)]],
      autor: [''],
      assunto: [''],
    });
  }

  ngOnInit(): void {
    this.bookId = Number(this.route.snapshot.paramMap.get('id'));
    this.bookService.getBookById(this.bookId).subscribe(response => {
      const book = response.data.book;
      this.bookForm.patchValue({
        titulo: book.titulo,
        editora: book.editora,
        edicao: book.edicao,
        anoPublicacao: book.anoPublicacao,
        preco: book.preco
      });

      // Preenche os autores e assuntos
      this.autores = book.autores;
      this.assuntos = book.assuntos;
    });
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

      let payload = {
        ...this.bookForm.value,
        anoPublicacao: String(this.bookForm.value.anoPublicacao),
        autores: this.autores.map(nome => ({ nome })),
        assuntos: this.assuntos.map(descricao => ({ descricao }))
      };
      delete payload.assunto;
      delete payload.autor;

      // Chamar o serviço para atualizar o livro
      this.bookService.updateBook(this.bookId, payload).subscribe(() => {
        this.successMessage = 'Livro atualizado com sucesso!';

        setTimeout(() => {
          this.successMessage = '';
          this.router.navigate(['/']);
        }, 1000);
      });
    } else {
      if (this.autores.length == 0) {
        this.erroAutor = true;
      }

      if (this.assuntos.length == 0) {
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
}
