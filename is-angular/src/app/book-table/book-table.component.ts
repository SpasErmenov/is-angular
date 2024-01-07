import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Book } from '../book/book.model';
import { BookService } from '../book/book.service';
import { MatDialog } from '@angular/material/dialog';
import { BookDetailsModalComponent } from '../book-details-modal/book-details-modal.component';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ViewChild } from '@angular/core';

@Component({
  selector: 'app-book-table',
  templateUrl: './book-table.component.html',
  styleUrls: ['./book-table.component.css']
})
export class BookTableComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  allBooks: Book[] = [];
  books: Book[] = [];
  displayedColumns: string[] = ['ISBN', 'title', 'author', 'imageUrl'];

  sortOrder: 'asc' | 'desc' = 'asc';

  searchQuery: string = '';
  pageSizeOptions: number[] = [5, 10, 15];
  pageSize: number = this.pageSizeOptions[0];
  pageIndex: number = 0;

  bookForm: FormGroup = this.fb.group({
    title: ['', [Validators.required]],
    author: ['', [Validators.required]],
    ISBN: ['', [Validators.required, Validators.pattern(/^\d{3}-\d{10}$/)]],
    imageUrl: ['', [Validators.required, Validators.pattern(/^https?:\/\/.*\.(png|jpg)$/)]],
  });

  showForm = false;
  showDetailsModal = false;


  constructor(private fb: FormBuilder, private bookService: BookService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.initializeForm();
    this.getBooks();
  }

  ngAfterViewInit(): void {
    this.applyPagination();
  }

  applyPagination(): void {
    if (this.paginator) {
      this.paginator.page.subscribe((pageEvent: PageEvent) => {
        this.paginateBooks(pageEvent);
      });
    }
  }

  getBooks(): void {
    this.bookService.getBooks().subscribe(books => {
      this.allBooks = books;
      this.books = this.allBooks.slice(0, 5);
      this.applyPagination();
    });
  }

  paginateBooks(pageEvent: PageEvent): void {
    this.pageIndex = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize;
    this.updateDisplayedBooks();
  }

  updateDisplayedBooks(): void {
    const startIndex = this.pageIndex * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    this.books = [...this.allBooks.slice(startIndex, endIndex)];
  }
  toggleDetailsModal(): void {
    this.showDetailsModal = !this.showDetailsModal;
  }

  openBookDetailsModal(book: Book): void {
    this.bookService.getBookDetails().subscribe(details => {
      const dialogRef = this.dialog.open(BookDetailsModalComponent, {
        width: '400px',
        data: { ...book, ...details }
      });
  
      dialogRef.afterClosed().subscribe(result => {
        this.showDetailsModal = false;
      });
    });
  }

  initializeForm(): void {
    this.bookForm = this.fb.group({
      title: ['', [Validators.required]],
      author: ['', [Validators.required]],
      ISBN: ['', [Validators.required, Validators.pattern(/^\d{3}-\d{10}$/)]],
      // Examples for ISBN
      // 123-0123456789
      // 999-9876543210
      // 555-1234567890
      imageUrl: ['', [Validators.required, Validators.pattern(/^https?:\/\/.*\.(png|jpg)$/)]],
      // Example for Image
      // https://buffer.com/cdn-cgi/image/w=1000,fit=contain,q=90,f=auto/library/content/images/size/w1200/2023/10/free-images.jpg
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

  addBook(): void {
    if (this.bookForm.valid) {
      const newBook: Book = {
        title: this.bookForm.value.title,
        author: this.bookForm.value.author,
        ISBN: this.bookForm.value.ISBN,
        imageUrl: this.bookForm.value.imageUrl,
      };

      this.books.push(newBook);

      this.sortBooksByTitle();

      this.bookForm.reset();
    }
  }

  toggleFormVisibility(): void {
    this.showForm = !this.showForm;
  }
}
