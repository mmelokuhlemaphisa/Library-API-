import bodyParser from "body-parser";
import express, { Express, Request, Response } from "express";
import { loggerMiddleware } from "./middleware/logger";
import { errorHandler, notFoundHandler } from "./middleware/errorHandler";
import authorsRouter from "./routes/authors";
import booksRouter from "./routes/books";

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());
app.use(express.json());
app.use(loggerMiddleware);

// Routes
app.use("/authors", authorsRouter);
app.use("/books", booksRouter);

// Root endpoint
app.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: "Welcome to Library API",
    endpoints: {
      authors: {
        "POST /authors": "Create new author",
        "GET /authors": "List all authors",
        "GET /authors/:id": "Get author by ID",
        "PUT /authors/:id": "Update author",
        "DELETE /authors/:id": "Delete author",
        "GET /authors/:id/books": "List books by an author",
      },
      books: {
        "POST /books": "Create new book",
        "GET /books": "List all books",
        "GET /books/:id": "Get book by ID",
        "PUT /books/:id": "Update book",
        "DELETE /books/:id": "Delete book",
        "GET /books/search": "Search books",
        "GET /books/filter": "Filter books",
        "GET /books/stats": "Get book statistics",
      },
    },
  });
});

// 404 handler for unmatched routes
app.use(notFoundHandler);

// Global error handler (must be last)
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
