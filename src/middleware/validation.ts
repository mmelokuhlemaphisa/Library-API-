import { Request, Response, NextFunction } from "express";
import { findAuthorById, books } from "../data/index";
import {
  ValidationError,
  NotFoundError,
  ConflictError,
  BadRequestError,
} from "../errors/AppError";

// Validation middleware for book creation and updates
export const validateBook = (isUpdate: boolean = false) => {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      const { title, isbn, publishedYear, authorId } = req.body;

      // Check if all required fields are present
      if (!title || !isbn || !publishedYear || !authorId) {
        throw new ValidationError(
          "All fields (title, isbn, publishedYear, authorId) are required"
        );
      }

      // Validate title
      if (typeof title !== "string" || title.trim().length === 0) {
        throw new ValidationError("Title must be a non-empty string");
      }

      // Validate ISBN
      if (typeof isbn !== "string" || isbn.trim().length === 0) {
        throw new ValidationError("ISBN must be a non-empty string");
      }

      // Validate ISBN format (basic check for 10 or 13 digits with possible hyphens)
      const isbnPattern =
        /^(?:\d{9}[\dX]|\d{13}|\d{1,5}-\d{1,7}-\d{1,6}-[\dX]|\d{3}-\d{1,5}-\d{1,7}-\d{1,6}-[\dX])$/;
      if (!isbnPattern.test(isbn.replace(/\s/g, ""))) {
        throw new ValidationError(
          "ISBN must be a valid format (10 or 13 digits, optionally with hyphens)"
        );
      }

      // Validate publishedYear
      if (
        typeof publishedYear !== "number" ||
        !Number.isInteger(publishedYear)
      ) {
        throw new ValidationError("Published year must be an integer");
      }

      if (publishedYear < 1000 || publishedYear > new Date().getFullYear()) {
        throw new ValidationError(
          `Published year must be between 1000 and ${new Date().getFullYear()}`
        );
      }

      // Validate authorId
      if (typeof authorId !== "number" || !Number.isInteger(authorId)) {
        throw new ValidationError("Author ID must be an integer");
      }

      // Check if author exists
      const author = findAuthorById(authorId);
      if (!author) {
        throw new NotFoundError("Author", authorId);
      }

      // Check ISBN uniqueness
      let existingBook;
      if (isUpdate) {
        const currentBookId = parseInt(req.params.id);
        existingBook = books.find(
          (book) => book.isbn === isbn.trim() && book.id !== currentBookId
        );
      } else {
        existingBook = books.find((book) => book.isbn === isbn.trim());
      }

      if (existingBook) {
        throw new ConflictError("Book with this ISBN already exists");
      }

      // Sanitize the data
      req.body.title = title.trim();
      req.body.isbn = isbn.trim();
      req.body.publishedYear = publishedYear;
      req.body.authorId = authorId;

      next();
    } catch (error) {
      next(error);
    }
  };
};

// Middleware to validate ID parameter
export const validateBookId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = parseInt(req.params.id);

    if (isNaN(id) || !Number.isInteger(id) || id <= 0) {
      throw new BadRequestError(
        "Invalid book ID. ID must be a positive integer"
      );
    }

    // Store parsed ID for use in route handlers
    req.params.id = id.toString();
    next();
  } catch (error) {
    next(error);
  }
};

// Middleware to validate author ID parameter
export const validateAuthorId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authorId = parseInt(req.params.authorId);

    if (isNaN(authorId) || !Number.isInteger(authorId) || authorId <= 0) {
      throw new BadRequestError(
        "Invalid author ID. ID must be a positive integer"
      );
    }

    // Store parsed ID for use in route handlers
    req.params.authorId = authorId.toString();
    next();
  } catch (error) {
    next(error);
  }
};
