import express from "express";
import {
  getAllReviews,
  createReview,
  getReviewById,
  deleteReview,
  updateReview,
} from "../controller/reviewController.js";

const router = express.Router();

// Routes
router.get("/", getAllReviews);
router.post("/", createReview);
router.get("/:id", getReviewById);
router.put("/:id", updateReview);
router.delete("/:id", deleteReview);

export default router;