readme

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

| Method | Endpoint             | Description        | Query Parameters                                               |
| ------ | -------------------- | ------------------ | -------------------------------------------------------------- |
| GET    | `/authors`           | Get all authors    | `?search=`, `?sort=`, `?order=`, `?page=`, `?limit=`           |
| GET    | `/authors/:id`       | Get single author  | -                                                              |
| GET    | `/authors/:id/books` | Get author's books | `?search=`, `?sort=`, `?order=`, `?page=`, `?limit=`, `?year=` |
| POST   | `/authors`           | Create new author  | -                                                              |
| PUT    | `/authors/:id`       | Update author      | -                                                              |
| DELETE | `/authors/:id`       | Delete author      | -                                                              |

### Books

| Method | Endpoint                  | Description         | Query Parameters                                                             |
| ------ | ------------------------- | ------------------- | ---------------------------------------------------------------------------- |
| GET    | `/books`                  | Get all books       | `?search=`, `?sort=`, `?order=`, `?page=`, `?limit=`, `?year=`, `?authorId=` |
| GET    | `/books/:id`              | Get single book     | -                                                                            |
| GET    | `/books/author/:authorId` | Get books by author | `?search=`, `?sort=`, `?order=`, `?page=`, `?limit=`, `?year=`               |
| POST   | `/books`                  | Create new book     | -                                                                            |
| PUT    | `/books/:id`              | Update book         | -                                                                            |
| DELETE | `/books/:id`              | Delete book         | -                                                                            |

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
GET /books?search=potter&year=1997&sort=title&page=1&limit=10
```

### Get Author's Books

```http
GET /authors/1/books?sort=year&order=desc
```

## 🔍 Query Parameters

### Search

- `?search=term` - Search in titles, names, emails, bios

### Filtering

- `?year=1997` - Filter books by publication year
- `?authorId=1` - Filter books by author

### Sorting

- `?sort=name` - Sort by field (name, title, year, etc.)
- `?order=desc` - Sort order (asc/desc, default: asc)

### Pagination

- `?page=2` - Page number (default: 1)
- `?limit=5` - Items per page (default: 10, max: 100)

## 📊 Response Format

### Success Response

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalItems": 25,
    "itemsPerPage": 10,
    "hasNextPage": true,
    "hasPrevPage": false
  },
  "query": {
    "search": "term",
    "sort": "name",
    "order": "asc"
  }
}
```

### Error Response

```json
{
  "success": false,
  "error": {
    "message": "Author not found",
    "statusCode": 404,
    "timestamp": "2025-10-27T12:00:00.000Z",
    "path": "/authors/999",
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
