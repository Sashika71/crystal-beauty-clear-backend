import express from "express";
const router = express.Router();

const RAG_URL = process.env.RAG_URL || "http://localhost:8000";

router.post("/", async (req, res) => {
    const { question } = req.body;

    if (!question || !question.trim()) {
        return res.status(400).json({ error: "Please enter a question" });
    }

    try {
        const response = await fetch(`${RAG_URL}/ask`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ question }),
        });

        if (!response.ok) throw new Error(`RAG service returned ${response.status}`);

        const data = await response.json();
        res.json({ answer: data.answer });
    } catch (err) {
        console.error("Chat route error:", err.message);
        res.status(500).json({ error: "Unable to answer right now. Please try again later." });
    }
});

export default router;