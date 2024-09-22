import { Component, ViewChild, AfterViewInit, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatPaginator } from '@angular/material/paginator';
import { BookService } from '../services/book.service';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Book } from '../models/book.model';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    NgFor,
    NgIf,
    FormsModule,
  ],
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.css'],
})
export class MainComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'titulo', 'editora', 'edicao', 'anoPublicacao', 'preco', 'acoes'];
  dataSource = new MatTableDataSource<Book>();

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private bookService: BookService) {}

  ngOnInit() {
    this.loadBooks();
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  loadBooks() {
    this.bookService.getBooks().subscribe(
      (data) => {
        this.dataSource.data = data;
      },
      (error) => {
        console.error('Erro ao carregar os livros:', error);
      }
    );
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  visualizarLivro(livro: Book) {
    console.log('Visualizar livro', livro);
  }

  editarLivro(livro: Book) {
    console.log('Editar livro', livro);
  }

  excluirLivro(livro: Book) {
    console.log('Excluir livro', livro);
  }

  exportarRelatorio(): void {
    const dataToExport = this.dataSource.data.map(book => ({
      ID: book.id,
      Título: book.titulo,
      Editora: book.editora,
      Edição: book.edicao,
      Ano: book.anoPublicacao,
      Preço: book.preco,
      Autores: book.autores.join(', '),
      Assuntos: book.assuntos.join(', ')
    }));

    const csvContent = this.convertToCSV(dataToExport);
    this.downloadCSV(csvContent);
  }

  convertToCSV(data: any[]): string {
    const header = Object.keys(data[0]).join(',') + '\n';
    const rows = data.map(item => Object.values(item).join(',')).join('\n');
    return header + rows;
  }

  downloadCSV(csvContent: string): void {
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', 'livros.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  exportarPDF(): void {
    console.log("export pdf")
  }
}
