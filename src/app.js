import express from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import urlRoutes from "./routes/urlRoutes.js";
import { errorHandler } from "./middlewares/errorMiddleware.js";

const app = express();


app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));


app.use("/api/v1/url", urlRoutes);


app.get("/healthz", (req, res) => {
  res.status(200).json({ status: "ok", service: "url-service" });
});


app.use(errorHandler);

export default app;
