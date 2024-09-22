import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Book } from '../models/book.model';

export interface ApiResponse {
  message: string;
  data: {
    books: Book[];
    pagination: {
      count: number;
      countPages: number;
      currentPage: number;
    };
  };
}

@Injectable({
  providedIn: 'root',
})
export class BookService {
  private apiUrl = 'http://localhost:8080/books';

  constructor(private http: HttpClient) {}

  // Método para buscar todos os livros
  getBooks(): Observable<Book[]> {
    return this.http.get<ApiResponse>(this.apiUrl + "?pageSize=100").pipe(
      map((response: ApiResponse) => response.data.books)
    );
  }

  // Método para adicionar um novo livro
  addBook(livro: Book): Observable<Book> {
    return this.http.post<Book>(this.apiUrl, livro);
  }

  // Método para atualizar um livro existente
  updateBook(id: number, livro: Book): Observable<Book> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Book>(url, livro);
  }

  // Método para deletar um livro
  deleteBook(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
}
