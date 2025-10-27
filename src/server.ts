import bodyParser from "body-parser";
import express, { Express, Request, Response } from "express";
import { loggerMiddleware } from "./middleware/logger";
import authorsRouter from "./routes/authors";
import booksRouter from "./routes/books";

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());
app.use(express.json());
app.use(loggerMiddleware);

// Routes
app.use('/api/authors', authorsRouter);
app.use('/api/books', booksRouter);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Library API',
    endpoints: {
      authors: {
        'GET /api/authors': 'Get all authors',
        'GET /api/authors/:id': 'Get single author',
        'POST /api/authors': 'Create new author',
        'PUT /api/authors/:id': 'Update author',
        'DELETE /api/authors/:id': 'Delete author'
      },
      books: {
        'GET /api/books': 'Get all books',
        'GET /api/books/:id': 'Get single book',
        'GET /api/books/author/:authorId': 'Get books by author',
        'POST /api/books': 'Create new book',
        'PUT /api/books/:id': 'Update book',
        'DELETE /api/books/:id': 'Delete book'
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});