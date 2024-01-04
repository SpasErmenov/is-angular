import { Component, OnInit } from '@angular/core';
import { Book } from '../book/book.model';
import { BookService } from '../book/book.service';

@Component({
  selector: 'app-book-table',
  templateUrl: './book-table.component.html',
  styleUrls: ['./book-table.component.css']
})
export class BookTableComponent implements OnInit {
  books: Book[] = [];

  displayedColumns: string[] = ['ISBN', 'title', 'author', 'imageUrl'];

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.bookService.getBooks().subscribe(books => {
      this.books = books;
    });
  }
}
