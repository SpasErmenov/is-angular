// src/app/book.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { Book, BookDetails } from './book.model';

@Injectable({
  providedIn: 'root'
})
export class BookService {
  private apiUrl = 'https://5b13d0dd-f7d9-40bd-9cf0-7166b4d859a4.mock.pstmn.io/getAllBooks';

  constructor(private http: HttpClient) {}

  getBooks(): Observable<Book[]> {
    return this.http.get<{ data: Book[] }>(this.apiUrl)
      .pipe(
        map(response => response.data)
      );
  }
  getBookDetails(): Observable<BookDetails[]> {
    const detailsUrl = `https://5b13d0dd-f7d9-40bd-9cf0-7166b4d859a4.mock.pstmn.io/getDetails`;
    return this.http.get<BookDetails[]>(detailsUrl);
  }
}
