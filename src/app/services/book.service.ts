import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { map, Observable, of } from 'rxjs';
import { Book } from '../models/book.model';
import { environment } from '../../environments/environment'
import { BookResponse } from './../models/bookResponse'

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
  private apiUrl = environment.apiUrl;
  private pageSize = environment.pageSize;

  constructor(private http: HttpClient) {}

  getBooks(): Observable<Book[]> {
    const url  = `${this.apiUrl}?pageSize=${this.pageSize}`;
    return this.http.get<ApiResponse>(url).pipe(
      map((response: ApiResponse) => response.data.books)
    );
  }

  getBookById(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  addBook(livro: Book): Observable<HttpResponse<Book>> {
    return this.http.post<Book>(this.apiUrl, livro, { observe: 'response' });
  }

  updateBook(id: number, livro: Book): Observable<Book> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.put<Book>(url, livro);
  }

  deleteBook(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }

  exportarPDF(): Observable<Blob> {
    return this.http.get(`${this.apiUrl}/../report?pageSize=${this.pageSize}`, {
      responseType: 'blob',
    });
  }

  searchBooks(query: string): Observable<BookResponse> {
    if (query && query.length > 5) {
      return this.http.get<BookResponse>(`${this.apiUrl}/volumes?search=${query}`);
    } else {
      return of({ message: 'success', data: { kind: '', totalItems: 0, items: [] } });
    }
  }
}
