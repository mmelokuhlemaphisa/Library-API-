import { Router, Request, Response, NextFunction } from "express";
import { books, getNextBookId, findAuthorById } from "../data/index";
import { Book } from "../models/Book";
import {
  validateBook,
  validateBookId,
  validateAuthorId,
} from "../middleware/validation";
import { NotFoundError } from "../errors/AppError";
import { asyncHandler } from "../middleware/errorHandler";

const router = Router();

// READ ALL - GET /api/books
router.get("/", asyncHandler(async (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    count: books.length,
    data: books,
  });
}));

// READ SINGLE - GET /api/books/:id
router.get("/:id", validateBookId, asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const book = books.find((b) => b.id === id);

  if (!book) {
    throw new NotFoundError("Book", id);
  }

  res.status(200).json({
    success: true,
    data: book,
  });
}));

// CREATE - POST /api/books
router.post("/", validateBook(false), asyncHandler(async (req: Request, res: Response) => {
  const { title, isbn, publishedYear, authorId } = req.body;

  // Create new book (validation already done by middleware)
  const newBook: Book = {
    id: getNextBookId(),
    title,
    isbn,
    publishedYear,
    authorId,
  };

  books.push(newBook);

  res.status(201).json({
    success: true,
    message: "Book created successfully",
    data: newBook,
  });
}));

// UPDATE - PUT /api/books/:id
router.put(
  "/:id",
  validateBookId,
  validateBook(true),
  asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const bookIndex = books.findIndex((b) => b.id === id);

    if (bookIndex === -1) {
      throw new NotFoundError("Book", id);
    }

    const { title, isbn, publishedYear, authorId } = req.body;

    // Update book (validation already done by middleware)
    books[bookIndex] = {
      id: id, // Keep original ID
      title,
      isbn,
      publishedYear,
      authorId,
    };

    res.status(200).json({
      success: true,
      message: "Book updated successfully",
      data: books[bookIndex],
    });
  })
);

// DELETE - DELETE /api/books/:id
router.delete("/:id", validateBookId, asyncHandler(async (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const bookIndex = books.findIndex((b) => b.id === id);

  if (bookIndex === -1) {
    throw new NotFoundError("Book", id);
  }

  // Store book details before deletion for response
  const deletedBook = books[bookIndex];

  // Remove book from array
  books.splice(bookIndex, 1);

  res.status(200).json({
    success: true,
    message: "Book deleted successfully",
    data: deletedBook,
  });
}));

// GET BOOKS BY AUTHOR - GET /api/books/author/:authorId
router.get(
  "/author/:authorId",
  validateAuthorId,
  asyncHandler(async (req: Request, res: Response) => {
    const authorId = parseInt(req.params.authorId);

    // Validate author exists
    const author = findAuthorById(authorId);
    if (!author) {
      throw new NotFoundError("Author", authorId);
    }

    // Find books by this author
    const authorBooks = books.filter((book) => book.authorId === authorId);

    res.status(200).json({
      success: true,
      author: author.name,
      count: authorBooks.length,
      data: authorBooks,
    });
  })
);

export default router;
