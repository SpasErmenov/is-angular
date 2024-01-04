import { Component, OnInit } from '@angular/core';
import { Book } from '../book/book.model';
import { BookService } from '../book/book.service';


@Component({
  selector: 'app-book-table',
  templateUrl: './book-table.component.html',
  styleUrls: ['./book-table.component.css']
})
export class BookTableComponent implements OnInit {
  allBooks: Book[] = [];
  books: Book[] = [];
  displayedColumns: string[] = ['ISBN', 'title', 'author', 'imageUrl'];

  sortOrder: 'asc' | 'desc' = 'asc';

  searchQuery: string = '';

  constructor(private bookService: BookService) {}

  ngOnInit(): void {
    this.getBooks();
  }

  getBooks(): void {
    this.bookService.getBooks().subscribe(books => {
      this.allBooks = books;
      this.books = [...this.allBooks];
    });
  }

  search(): void {
    if (this.searchQuery.trim() !== '') {
      this.books = this.allBooks.filter(book =>
        book.title.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        book.author.toLowerCase().includes(this.searchQuery.toLowerCase())
      );
    } else {
      this.books = [...this.allBooks];
      this.sortBooksByTitle();
    }
  }
  
  toggleSortOrder(property: string): void {
    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    if (property === 'title') {
      this.sortBooksByTitle();
    } else if (property === 'author') {
      this.sortBooksByAuthor();
    }
  }
  
  
  sortBooksByTitle(): void {
    this.books = [...this.books.sort((a, b) => {
      const order = this.sortOrder === 'asc' ? 1 : -1;
      return a.title.localeCompare(b.title) * order;
    })];
  }

  sortBooksByAuthor(): void {
    this.books = [...this.books.sort((a, b) => {
      const order = this.sortOrder === 'asc' ? 1 : -1;
      return a.author.localeCompare(b.author) * order;
    })];
  }
}
