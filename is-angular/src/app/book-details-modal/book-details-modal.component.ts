// src/app/book-details-modal/book-details-modal.component.ts

import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Book } from '../book/book.model';

@Component({
  selector: 'app-book-details-modal',
  templateUrl: './book-details-modal.component.html',
  styleUrls: ['./book-details-modal.component.css']
})
export class BookDetailsModalComponent {

  bookData: Book;

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) {
    this.bookData = this.data as Book;
  }

}
