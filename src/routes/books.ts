import { Router, Request, Response } from 'express';
import { books, getNextBookId, findAuthorById } from '../data/index';
import { Book } from '../models/Book';

const router = Router();

// CREATE - POST /api/books
router.post('/', (req: Request, res: Response) => {
  try {
    const { title, isbn, publishedYear, authorId } = req.body;

    // Validation
    if (!title || !isbn || !publishedYear || !authorId) {
      return res.status(400).json({
        error: 'All fields (title, isbn, publishedYear, authorId) are required'
      });
    }

    // Validate publishedYear is a number
    if (typeof publishedYear !== 'number' || publishedYear < 1000 || publishedYear > new Date().getFullYear()) {
      return res.status(400).json({
        error: 'Published year must be a valid year'
      });
    }

    // Validate authorId exists
    const author = findAuthorById(authorId);
    if (!author) {
      return res.status(400).json({
        error: 'Author not found'
      });
    }

    // Check if ISBN already exists
    const existingBook = books.find(book => book.isbn === isbn);
    if (existingBook) {
      return res.status(400).json({
        error: 'Book with this ISBN already exists'
      });
    }

    // Create new book
    const newBook: Book = {
      id: getNextBookId(),
      title: title.trim(),
      isbn: isbn.trim(),
      publishedYear,
      authorId
    };

    books.push(newBook);

    res.status(201).json({
      message: 'Book created successfully',
      book: newBook
    });

  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

export default router;
