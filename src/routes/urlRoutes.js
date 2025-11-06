import express from "express";
import { shortenUrl, getUrl, deleteUrl, getAllUrls } from "../controllers/urlController.js";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import { createUrlLimiter } from "../middlewares/rateLimiter.js";

const router = express.Router();

router.post("/shorten", authMiddleware, createUrlLimiter, shortenUrl);
router.get("/:shortId", getUrl);
router.delete("/:shortId", authMiddleware, deleteUrl);
router.get("/", authMiddleware, getAllUrls);

export default router;


