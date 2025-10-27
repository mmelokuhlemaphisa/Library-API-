import bodyParser from "body-parser";
import express, { Express, Request, Response } from "express";
import { loggerMiddleware } from "./middleware/logger";
import authorsRouter from "./routes/authors";

const app: Express = express();
const PORT = process.env.PORT || 3000;

// Middleware setup
app.use(bodyParser.json());
app.use(express.json());
app.use(loggerMiddleware);

// Routes
app.use('/authors', authorsRouter);

// Root endpoint
app.get('/', (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    message: 'Welcome to Library API',
    endpoints: {
      authors: {
        'GET /authors': 'Get all authors',
        'GET /authors/:id': 'Get single author',
        'POST /authors': 'Create new author',
        'PUT /authors/:id': 'Update author',
        'DELETE /authors/:id': 'Delete author'
      }
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});