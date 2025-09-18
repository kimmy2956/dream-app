import express from "express";
import bodyParser from "body-parser";
import OpenAI from "openai";

const app = express();
const port = process.env.PORT || 5000;

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(bodyParser.json());

app.post("/api/dream", async (req, res) => {
  try {
    const { dream } = req.body;
    if (!dream) return res.status(400).json({ error: "กรุณาส่งความฝัน" });

    const prompt = `
คุณคือผู้เชี่ยวชาญการทำนายฝันแบบไทย
ความฝัน: "${dream}"

กรุณาตอบเป็นภาษาไทย โดยแบ่งเป็น 2 ส่วน:
1. 📖 คำทำนาย
2. 🎲 เลขเด็ด (2-3 ตัวเลข)
`;

    const completion = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
    });

    const text = completion.choices[0].message.content || "";

    // fallback parsing
    let meaning = text;
    let numbers = "ไม่มีเลขเด็ด";

    const meaningMatch = text.match(/คำทำนาย[:：]([\s\S]*?)(?=เลขเด็ด|$)/);
    if (meaningMatch) meaning = meaningMatch[1].trim();

    const numberMatch = text.match(/เลขเด็ด[:：]([\s\S]*)/);
    if (numberMatch) numbers = numberMatch[1].trim();

    res.json({ meaning, numbers });
  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({
      error: "เกิดข้อผิดพลาด",
      details: err.message || err.toString(),
    });
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running at http://localhost:${port}`);
});
