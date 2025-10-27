import { Router, Request, Response } from "express";
import { Author } from "../models/Author";

const router = Router();

// In-memory authors array with sample data
let authors: Author[] = [
  {
    id: 1,
    name: "J.K. Rowling",
    email: "jk.rowling@example.com",
    bio: "British author, best known for the Harry Potter series",
  },
  {
    id: 2,
    name: "Stephen King",
    email: "stephen.king@example.com",
    bio: "American author of horror, supernatural fiction, suspense, and fantasy novels",
  },
  {
    id: 3,
    name: "Agatha Christie",
    email: "agatha.christie@example.com",
    bio: "English writer known for her detective novels, especially those featuring Hercule Poirot",
  },
];

// Helper function to generate next ID
const getNextId = (): number => {
  return authors.length > 0 ? Math.max(...authors.map((a) => a.id)) + 1 : 1;
};

// GET /authors - Get all authors
router.get("/", (req: Request, res: Response) => {
  res.status(200).json({
    success: true,
    data: authors,
    count: authors.length,
  });
});

// GET /authors/:id - Get single author by ID
router.get("/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const author = authors.find((a) => a.id === id);

  if (!author) {
    return res.status(404).json({
      success: false,
      message: "Author not found",
    });
  }

  res.status(200).json({
    success: true,
    data: author,
  });
});

// POST /authors - Create new author
router.post("/", (req: Request, res: Response) => {
  const { name, email, bio } = req.body;

  // Basic validation
  if (!name || !email || !bio) {
    return res.status(400).json({
      success: false,
      message: "Name, email, and bio are required",
    });
  }

  // Check if email already exists
  const existingAuthor = authors.find((a) => a.email === email);
  if (existingAuthor) {
    return res.status(400).json({
      success: false,
      message: "Author with this email already exists",
    });
  }

  const newAuthor: Author = {
    id: getNextId(),
    name,
    email,
    bio,
  };

  authors.push(newAuthor);

  res.status(201).json({
    success: true,
    data: newAuthor,
    message: "Author created successfully",
  });
}); 


// PUT /authors/:id - Update author
router.put("/:id", (req: Request, res: Response) => {
  const id = parseInt(req.params.id);
  const { name, email, bio } = req.body;

  const authorIndex = authors.findIndex((a) => a.id === id);

  if (authorIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "Author not found",
    });
  }

  // Basic validation
  if (!name || !email || !bio) {
    return res.status(400).json({
      success: false,
      message: "Name, email, and bio are required",
    });
  }

  // Check if email already exists for another author
  const existingAuthor = authors.find((a) => a.email === email && a.id !== id);
  if (existingAuthor) {
    return res.status(400).json({
      success: false,
      message: "Another author with this email already exists",
    });
  }

  authors[authorIndex] = {
    id,
    name,
    email,
    bio,
  };

  res.status(200).json({
    success: true,
    data: authors[authorIndex],
    message: "Author updated successfully",
  });
});



export default router;
