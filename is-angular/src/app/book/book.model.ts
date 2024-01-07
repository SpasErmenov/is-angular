// src/app/book.model.ts

export interface Book {
  ISBN: string;
  title: string;
  author: string;
  imageUrl: string;
  description?: string;
}
export interface BookDetails {
  description: string;
}