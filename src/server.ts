import bodyParser from "body-parser";
import express, { Express, Router } from "express";


const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.json());


app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});