import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

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

    const meaningMatch = text.match(/คำทำนาย[:：](.*?)(?=เลขเด็ด|$)/s);
    const numberMatch = text.match(/เลขเด็ด[:：](.*)/s);

    res.status(200).json({
      meaning: meaningMatch ? meaningMatch[1].trim() : text,
      numbers: numberMatch ? numberMatch[1].trim() : "ไม่มีเลขเด็ด",
    });

  } catch (err) {
    console.error("API Error:", err);
    res.status(500).json({
      error: "เกิดข้อผิดพลาด",
      details: err.message || err.toString(),
    });
  }
}
