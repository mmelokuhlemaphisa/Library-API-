import { Router, Request, Response } from 'express';
import { books, getNextBookId, findAuthorById } from '../data/index';
import { Book } from '../models/Book';

const router = Router();

// READ ALL - GET /api/books
router.get('/', (req: Request, res: Response) => {
  try {
    res.status(200).json({
      success: true,
      count: books.length,
      data: books
    });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// READ SINGLE - GET /api/books/:id
router.get('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    // Validate ID is a number
    if (isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid book ID. ID must be a number'
      });
    }

    const book = books.find(b => b.id === id);

    if (!book) {
      return res.status(404).json({
        error: 'Book not found'
      });
    }

    res.status(200).json({
      success: true,
      data: book
    });

  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

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

// UPDATE - PUT /api/books/:id
router.put('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    // Validate ID is a number
    if (isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid book ID. ID must be a number'
      });
    }

    const bookIndex = books.findIndex(b => b.id === id);

    if (bookIndex === -1) {
      return res.status(404).json({
        error: 'Book not found'
      });
    }

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

    // Check if ISBN already exists (excluding current book)
    const existingBook = books.find(book => book.isbn === isbn && book.id !== id);
    if (existingBook) {
      return res.status(400).json({
        error: 'Book with this ISBN already exists'
      });
    }

    // Update book
    books[bookIndex] = {
      id: id, // Keep original ID
      title: title.trim(),
      isbn: isbn.trim(),
      publishedYear,
      authorId
    };

    res.status(200).json({
      success: true,
      message: 'Book updated successfully',
      data: books[bookIndex]
    });

  } catch (error) {
    console.error('Error updating book:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// DELETE - DELETE /api/books/:id
router.delete('/:id', (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id);

    // Validate ID is a number
    if (isNaN(id)) {
      return res.status(400).json({
        error: 'Invalid book ID. ID must be a number'
      });
    }

    const bookIndex = books.findIndex(b => b.id === id);

    if (bookIndex === -1) {
      return res.status(404).json({
        error: 'Book not found'
      });
    }

    // Store book details before deletion for response
    const deletedBook = books[bookIndex];

    // Remove book from array
    books.splice(bookIndex, 1);

    res.status(200).json({
      success: true,
      message: 'Book deleted successfully',
      data: deletedBook
    });

  } catch (error) {
    console.error('Error deleting book:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

// GET BOOKS BY AUTHOR - GET /api/books/author/:authorId
router.get('/author/:authorId', (req: Request, res: Response) => {
  try {
    const authorId = parseInt(req.params.authorId);

    // Validate authorId is a number
    if (isNaN(authorId)) {
      return res.status(400).json({
        error: 'Invalid author ID. ID must be a number'
      });
    }

    // Validate author exists
    const author = findAuthorById(authorId);
    if (!author) {
      return res.status(404).json({
        error: 'Author not found'
      });
    }

    // Find books by this author
    const authorBooks = books.filter(book => book.authorId === authorId);

    res.status(200).json({
      success: true,
      author: author.name,
      count: authorBooks.length,
      data: authorBooks
    });

  } catch (error) {
    console.error('Error fetching books by author:', error);
    res.status(500).json({
      error: 'Internal server error'
    });
  }
});

export default router;
