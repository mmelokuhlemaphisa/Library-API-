# Library API 📚

A RESTful API for managing a library system with authors and books. Built with TypeScript, Express.js, and comprehensive error handling.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Start production server
npm start
```

Server runs on: `http://localhost:3000`

## 📋 API Endpoints

### Authors

| Method | Endpoint             | Description             | Query Parameters |
| ------ | -------------------- | ----------------------- | ---------------- |
| POST   | `/authors`           | Create new author       | -                |
| GET    | `/authors`           | List all authors        | -                |
| GET    | `/authors/:id`       | Get author by ID        | -                |
| PUT    | `/authors/:id`       | Update author           | -                |
| DELETE | `/authors/:id`       | Delete author           | -                |
| GET    | `/authors/:id/books` | List books by an author | -                |

### Books

| Method | Endpoint        | Description         | Query Parameters                                                                                                                                 |
| ------ | --------------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| POST   | `/books`        | Create new book     | -                                                                                                                                                |
| GET    | `/books`        | List all books      | `?sortBy=`, `?sortOrder=`, `?page=`, `?limit=`                                                                                                   |
| GET    | `/books/:id`    | Get book by ID      | -                                                                                                                                                |
| PUT    | `/books/:id`    | Update book         | -                                                                                                                                                |
| DELETE | `/books/:id`    | Delete book         | -                                                                                                                                                |
| GET    | `/books/search` | Search books        | `?query=`, `?fields=`, `?page=`, `?limit=`                                                                                                       |
| GET    | `/books/filter` | Filter books        | `?authorId=`, `?publishedYear=`, `?publishedYearFrom=`, `?publishedYearTo=`, `?title=`, `?isbn=`, `?sortBy=`, `?sortOrder=`, `?page=`, `?limit=` |
| GET    | `/books/stats`  | Get book statistics | -                                                                                                                                                |

## 📖 Usage Examples

### Create Author

```http
POST /authors
Content-Type: application/json

{
  "name": "George Orwell",
  "email": "george.orwell@example.com",
  "bio": "English novelist and essayist"
}
```

### Create Book

```http
POST /books
Content-Type: application/json

{
  "title": "1984",
  "isbn": "978-0-452-28423-4",
  "publishedYear": 1949,
  "authorId": 1
}
```

### Search Books

```http
GET /books/search?query=potter&fields=title,author&page=1&limit=10
```

### Filter Books

```http
GET /books/filter?authorId=1&publishedYearFrom=1990&publishedYearTo=2000&sortBy=title&sortOrder=asc
```

### Get Book Statistics

```http
GET /books/stats
```

### List Books by Author

```http
GET /authors/1/books
```

## 🔍 Query Parameters

### Search (for `/books/search`)

- `?query=term` - Search term across titles, authors, and ISBNs
- `?fields=title,author,isbn` - Specific fields to search (comma-separated)

### Filtering (for `/books/filter`)

- `?authorId=1` - Filter books by author ID
- `?publishedYear=1997` - Filter books by exact publication year
- `?publishedYearFrom=1990` - Filter books from this year onwards
- `?publishedYearTo=2000` - Filter books up to this year
- `?title=partial` - Filter books with title containing this text
- `?isbn=exact` - Filter books with exact ISBN match

### Sorting

- `?sortBy=title` - Sort by field (id, title, publishedYear, isbn)
- `?sortOrder=desc` - Sort order (asc/desc, default: asc)

### Pagination

- `?page=2` - Page number (default: 1)
- `?limit=5` - Items per page (default: 10, max: 100)

## 📊 Response Format

### Success Response

```json
{
  "success": true,
  "message": "Retrieved 5 of 5 books",
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 5,
    "total": 5,
    "totalPages": 1,
    "hasNext": false,
    "hasPrev": false
  },
  "sort": {
    "sortBy": "title",
    "sortOrder": "asc"
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "message": "Book with ID 999 not found",
    "statusCode": 404,
    "errorCode": "NOT_FOUND",
    "timestamp": "2025-10-27T12:00:00.000Z",
    "path": "/books/999",
    "method": "GET"
  }
}
```

## 🛡️ Validation Rules

### Author

- **name**: Required, string, max 100 characters
- **email**: Required, valid email format, max 150 characters, unique
- **bio**: Required, string, max 500 characters

### Book

- **title**: Required, string, max 200 characters
- **isbn**: Required, valid ISBN format, max 20 characters, unique
- **publishedYear**: Required, number, between 1000-2026
- **authorId**: Required, number, must reference existing author

## ⚡ Features

- ✅ **Full CRUD Operations** for Authors and Books
- ✅ **Advanced Search** across multiple fields
- ✅ **Filtering & Sorting** with multiple options
- ✅ **Pagination** with rich metadata
- ✅ **Input Validation** with detailed error messages
- ✅ **Error Handling** with proper HTTP status codes
- ✅ **Relationship Management** between authors and books
- ✅ **TypeScript** for type safety
- ✅ **Request Logging** for monitoring

## 🔧 Technical Stack

- **Runtime**: Node.js with TypeScript
- **Framework**: Express.js
- **Data Storage**: In-memory arrays (easily replaceable with database)
- **Validation**: Custom middleware with comprehensive rules
- **Error Handling**: Centralized error management
- **Development**: Nodemon for auto-reload

## 📁 Project Structure

```
src/
├── server.ts              # Main application entry
├── models/                # Data models and interfaces
│   ├── Author.ts
│   └── Book.ts
├── routes/                # API route handlers
│   ├── authors.ts
│   └── books.ts
├── middleware/            # Custom middleware
│   ├── errorHandler.ts
│   ├── logger.ts
│   └── validation.ts
├── errors/                # Custom error classes
│   └── AppError.ts
├── utils/                 # Utility functions
│   └── queryUtils.ts
└── data/                  # In-memory data storage
    └── index.ts
```

## 🧪 Testing with Thunder Client/Postman

### Test Scenarios

1. **Create Author** → **Create Book** → **Get Author's Books**
2. **Search Books** with various parameters
3. **Test Validation** with invalid data
4. **Test Error Handling** with non-existent IDs
5. **Test Pagination** with different page sizes

### Sample Test Data

```json
// Author
{
  "name": "J.K. Rowling",
  "email": "jk.rowling@example.com",
  "bio": "British author, best known for the Harry Potter series"
}

// Book
{
  "title": "Harry Potter and the Philosopher's Stone",
  "isbn": "978-0-7475-3269-9",
  "publishedYear": 1997,
  "authorId": 1
}
```

## 📈 HTTP Status Codes

- **200** - Success (GET, PUT, DELETE)
- **201** - Created (POST)
- **400** - Bad Request (validation errors)
- **404** - Not Found (resource doesn't exist)
- **409** - Conflict (duplicate email/ISBN)
- **500** - Internal Server Error

## 🚀 Deployment Ready

The API is production-ready with:

- Proper error handling
- Input validation
- Structured logging
- TypeScript compilation
- Environment configuration

Ready to integrate with any frontend or deploy to cloud platforms!

---

**Built for the local community library system** 📚✨
