import { Book } from '../models/Book';
import { Author } from '../models/Author';

// Interface for pagination parameters
export interface PaginationParams {
  page: number;
  limit: number;
}

// Interface for pagination response
export interface PaginationResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// Interface for sort parameters
export interface SortParams {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

// Interface for book filter parameters
export interface BookFilterParams {
  authorId?: number;
  publishedYear?: number;
  publishedYearFrom?: number;
  publishedYearTo?: number;
  title?: string;
  isbn?: string;
}

// Interface for search parameters
export interface SearchParams {
  query: string;
  fields?: string[];
}

/**
 * Parse pagination parameters from query string
 */
export const parsePagination = (query: any): PaginationParams => {
  const page = Math.max(1, parseInt(query.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(query.limit) || 10));
  
  return { page, limit };
};

/**
 * Parse sort parameters from query string
 */
export const parseSort = (query: any, allowedFields: string[] = []): SortParams => {
  const sortBy = allowedFields.includes(query.sortBy) ? query.sortBy : allowedFields[0] || 'id';
  const sortOrder = query.sortOrder === 'desc' ? 'desc' : 'asc';
  
  return { sortBy, sortOrder };
};

/**
 * Apply pagination to an array
 */
export const paginate = <T>(
  data: T[], 
  { page, limit }: PaginationParams
): PaginationResponse<T> => {
  const total = data.length;
  const totalPages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  const paginatedData = data.slice(startIndex, endIndex);
  
  return {
    data: paginatedData,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext: page < totalPages,
      hasPrev: page > 1,
    },
  };
};

/**
 * Sort books by specified field
 */
export const sortBooks = (books: Book[], { sortBy, sortOrder }: SortParams): Book[] => {
  return [...books].sort((a, b) => {
    let aValue: any;
    let bValue: any;
    
    switch (sortBy) {
      case 'title':
        aValue = a.title.toLowerCase();
        bValue = b.title.toLowerCase();
        break;
      case 'publishedYear':
        aValue = a.publishedYear;
        bValue = b.publishedYear;
        break;
      case 'isbn':
        aValue = a.isbn;
        bValue = b.isbn;
        break;
      case 'id':
      default:
        aValue = a.id;
        bValue = b.id;
        break;
    }
    
    if (aValue < bValue) {
      return sortOrder === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortOrder === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

/**
 * Filter books based on criteria
 */
export const filterBooks = (books: Book[], filters: BookFilterParams): Book[] => {
  return books.filter(book => {
    // Filter by author ID
    if (filters.authorId && book.authorId !== filters.authorId) {
      return false;
    }
    
    // Filter by exact published year
    if (filters.publishedYear && book.publishedYear !== filters.publishedYear) {
      return false;
    }
    
    // Filter by published year range
    if (filters.publishedYearFrom && book.publishedYear < filters.publishedYearFrom) {
      return false;
    }
    
    if (filters.publishedYearTo && book.publishedYear > filters.publishedYearTo) {
      return false;
    }
    
    // Filter by title (case-insensitive partial match)
    if (filters.title && !book.title.toLowerCase().includes(filters.title.toLowerCase())) {
      return false;
    }
    
    // Filter by ISBN (exact match)
    if (filters.isbn && book.isbn !== filters.isbn) {
      return false;
    }
    
    return true;
  });
};

/**
 * Search books by query string across multiple fields
 */
export const searchBooks = (
  books: Book[], 
  authors: Author[], 
  { query, fields = ['title', 'isbn', 'author'] }: SearchParams
): Book[] => {
  const searchQuery = query.toLowerCase().trim();
  
  if (!searchQuery) {
    return books;
  }
  
  return books.filter(book => {
    // Search in title
    if (fields.includes('title') && book.title.toLowerCase().includes(searchQuery)) {
      return true;
    }
    
    // Search in ISBN
    if (fields.includes('isbn') && book.isbn.toLowerCase().includes(searchQuery)) {
      return true;
    }
    
    // Search in author name
    if (fields.includes('author')) {
      const author = authors.find(a => a.id === book.authorId);
      if (author && author.name.toLowerCase().includes(searchQuery)) {
        return true;
      }
    }
    
    return false;
  });
};

/**
 * Get book statistics
 */
export const getBookStats = (books: Book[], authors: Author[]) => {
  const stats = {
    totalBooks: books.length,
    totalAuthors: authors.length,
    booksByYear: {} as Record<number, number>,
    booksByAuthor: {} as Record<string, { count: number; authorName: string }>,
    publishedYearRange: {
      earliest: 0,
      latest: 0,
    },
    averagePublishedYear: 0,
  };
  
  if (books.length === 0) {
    return stats;
  }
  
  // Calculate books by year
  books.forEach(book => {
    stats.booksByYear[book.publishedYear] = (stats.booksByYear[book.publishedYear] || 0) + 1;
  });
  
  // Calculate books by author
  books.forEach(book => {
    const author = authors.find(a => a.id === book.authorId);
    if (author) {
      if (!stats.booksByAuthor[book.authorId]) {
        stats.booksByAuthor[book.authorId] = {
          count: 0,
          authorName: author.name,
        };
      }
      stats.booksByAuthor[book.authorId].count++;
    }
  });
  
  // Calculate year range and average
  const years = books.map(book => book.publishedYear);
  stats.publishedYearRange.earliest = Math.min(...years);
  stats.publishedYearRange.latest = Math.max(...years);
  stats.averagePublishedYear = Math.round(years.reduce((sum, year) => sum + year, 0) / years.length);
  
  return stats;
};

/**
 * Validate and parse filter parameters
 */
export const parseBookFilters = (query: any): BookFilterParams => {
  const filters: BookFilterParams = {};
  
  if (query.authorId) {
    const authorId = parseInt(query.authorId);
    if (!isNaN(authorId)) {
      filters.authorId = authorId;
    }
  }
  
  if (query.publishedYear) {
    const year = parseInt(query.publishedYear);
    if (!isNaN(year)) {
      filters.publishedYear = year;
    }
  }
  
  if (query.publishedYearFrom) {
    const yearFrom = parseInt(query.publishedYearFrom);
    if (!isNaN(yearFrom)) {
      filters.publishedYearFrom = yearFrom;
    }
  }
  
  if (query.publishedYearTo) {
    const yearTo = parseInt(query.publishedYearTo);
    if (!isNaN(yearTo)) {
      filters.publishedYearTo = yearTo;
    }
  }
  
  if (query.title && typeof query.title === 'string') {
    filters.title = query.title.trim();
  }
  
  if (query.isbn && typeof query.isbn === 'string') {
    filters.isbn = query.isbn.trim();
  }
  
  return filters;
};