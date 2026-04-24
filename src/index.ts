import express from "express";

import { apiRouter } from "./api/routes";
import { errorMiddleware } from "./api/middlewares/errorMiddleware";

const app = express();
const port = Number(process.env.PORT) || 3000;

app.use(express.json());
app.use(apiRouter);
app.use(errorMiddleware);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
