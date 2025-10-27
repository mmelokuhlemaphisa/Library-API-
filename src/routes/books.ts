import { Router, Request, Response, NextFunction } from "express";
import { books, getNextBookId, findAuthorById, authors } from "../data/index";
import { Book } from "../models/Book";
import {
  validateBook,
  validateBookId,
  validateAuthorId,
} from "../middleware/validation";
import { NotFoundError } from "../errors/AppError";
import { asyncHandler } from "../middleware/errorHandler";
import { 
  searchBooks, 
  parsePagination, 
  paginate, 
  SearchParams,
  filterBooks,
  parseBookFilters,
  sortBooks,
  parseSort,
  getBookStats
} from "../utils/queryUtils";

const router = Router();

// READ ALL - GET /api/books
router.get(
  "/",
  asyncHandler(async (req: Request, res: Response) => {
    // Apply sorting if specified
    const allowedSortFields = ['id', 'title', 'publishedYear', 'isbn'];
    const sortParams = parseSort(req.query, allowedSortFields);
    let sortedBooks = sortBooks(books, sortParams);
    
    // Apply pagination
    const pagination = parsePagination(req.query);
    const paginatedResults = paginate(sortedBooks, pagination);

    res.status(200).json({
      success: true,
      message: `Retrieved ${paginatedResults.data.length} of ${books.length} books`,
      sort: sortParams,
      ...paginatedResults
    });
  })
);

// SEARCH BOOKS - GET /api/books/search
router.get(
  "/search",
  asyncHandler(async (req: Request, res: Response) => {
    const { query, fields } = req.query;
    
    if (!query || typeof query !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Search query is required'
      });
    }

    const searchParams: SearchParams = {
      query: query.trim(),
      fields: fields ? (fields as string).split(',') : ['title', 'isbn', 'author']
    };

    // Search books
    const searchResults = searchBooks(books, authors, searchParams);
    
    // Apply pagination
    const pagination = parsePagination(req.query);
    const paginatedResults = paginate(searchResults, pagination);

    res.status(200).json({
      success: true,
      message: `Found ${searchResults.length} books matching "${query}"`,
      ...paginatedResults
    });
  })
);

// FILTER BOOKS - GET /api/books/filter
router.get(
  "/filter",
  asyncHandler(async (req: Request, res: Response) => {
    // Parse filter parameters
    const filters = parseBookFilters(req.query);
    
    // Apply filters
    let filteredBooks = filterBooks(books, filters);
    
    // Apply sorting if specified
    const allowedSortFields = ['id', 'title', 'publishedYear', 'isbn'];
    const sortParams = parseSort(req.query, allowedSortFields);
    filteredBooks = sortBooks(filteredBooks, sortParams);
    
    // Apply pagination
    const pagination = parsePagination(req.query);
    const paginatedResults = paginate(filteredBooks, pagination);

    // Build filter description for response
    const filterDescription = Object.entries(filters)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');

    res.status(200).json({
      success: true,
      message: `Found ${filteredBooks.length} books${filterDescription ? ` with filters: ${filterDescription}` : ''}`,
      filters: filters,
      sort: sortParams,
      ...paginatedResults
    });
  })
);

// READ SINGLE - GET /api/books/:id
router.get(
  "/:id",
  validateBookId,
  asyncHandler(async (req: Request, res: Response) => {
    const id = parseInt(req.params.id);
    const book = books.find((b) => b.id === id);

    if (!book) {
      throw new NotFoundError("Book", id);
    }

    res.status(200).json({
      success: true,
      data: book,
    });
  })
);

// CREATE - POST /api/books
router.post(
  "/",
  validateBook(false),
  asyncHandler(async (req: Request, res: Response) => {
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
  })
);

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
router.delete(
  "/:id",
  validateBookId,
  asyncHandler(async (req: Request, res: Response) => {
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
  })
);

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
    let authorBooks = books.filter((book) => book.authorId === authorId);
    
    // Apply sorting if specified
    const allowedSortFields = ['id', 'title', 'publishedYear', 'isbn'];
    const sortParams = parseSort(req.query, allowedSortFields);
    authorBooks = sortBooks(authorBooks, sortParams);
    
    // Apply pagination
    const pagination = parsePagination(req.query);
    const paginatedResults = paginate(authorBooks, pagination);

    res.status(200).json({
      success: true,
      message: `Retrieved ${paginatedResults.data.length} of ${authorBooks.length} books by ${author.name}`,
      author: {
        id: author.id,
        name: author.name
      },
      sort: sortParams,
      ...paginatedResults
    });
  })
);

// BOOK STATISTICS - GET /api/books/stats
router.get(
  "/stats",
  asyncHandler(async (req: Request, res: Response) => {
    const stats = getBookStats(books, authors);
    
    res.status(200).json({
      success: true,
      message: "Book statistics retrieved successfully",
      data: stats
    });
  })
);

export default router;
