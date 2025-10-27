import { Author } from "../models/Author";
import { Book } from "../models/Book";

// In-memory authors array with sample data
export let authors: Author[] = [
  {
    id: 1,
    name: "J.K. Rowling",
    email: "jk.rowling@example.com",
    bio: "British author, best known for the Harry Potter series",
  },
  {
    id: 2,
    name: "Stephen King",
    email: "stephen.king@example.com",
    bio: "American author of horror, supernatural fiction, suspense, and fantasy novels",
  },
  {
    id: 3,
    name: "Agatha Christie",
    email: "agatha.christie@example.com",
    bio: "English writer known for her detective novels, especially those featuring Hercule Poirot",
  },
];

// In-memory books array with sample data
export let books: Book[] = [
  {
    id: 1,
    title: "Harry Potter and the Philosopher's Stone",
    isbn: "978-0-7475-3269-9",
    publishedYear: 1997,
    authorId: 1,
  },
  {
    id: 2,
    title: "Harry Potter and the Chamber of Secrets",
    isbn: "978-0-7475-3849-3",
    publishedYear: 1998,
    authorId: 1,
  },
  {
    id: 3,
    title: "The Shining",
    isbn: "978-0-385-12167-5",
    publishedYear: 1977,
    authorId: 2,
  },
  {
    id: 4,
    title: "It",
    isbn: "978-0-670-81302-4",
    publishedYear: 1986,
    authorId: 2,
  },
  {
    id: 5,
    title: "Murder on the Orient Express",
    isbn: "978-0-00-711926-2",
    publishedYear: 1934,
    authorId: 3,
  },
];

// Helper functions
export const getNextAuthorId = (): number => {
  return authors.length > 0 ? Math.max(...authors.map((a) => a.id)) + 1 : 1;
};

export const getNextBookId = (): number => {
  return books.length > 0 ? Math.max(...books.map((b) => b.id)) + 1 : 1;
};

export const findAuthorById = (id: number): Author | undefined => {
  return authors.find((a) => a.id === id);
};

export const findBookById = (id: number): Book | undefined => {
  return books.find((b) => b.id === id);
};
