export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "Missing API key" });
    }

    const systemPrompt = `You are the AI Assistant for Syukie Ayog Oda's portfolio. 
    Syukie is a 2nd year Computer Engineering student at Holy Cross of Davao College. 
    Skills: Python, JS, C++, Networking, Web Dev. 
    Be professional and friendly. Answer questions about Syukie's background and skills. 
    Keep answers concise. If unsure, tell them to contact Syukie directly.`;

    const userMessage = req.body.message || "";

    const r = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [{ text: `${systemPrompt}\n\nUser Question: ${userMessage}` }]
            }
          ]
        })
      }
    );

    const data = await r.json();

    if (!r.ok) {
      throw new Error(data.error?.message || "Gemini API error");
    }

    const reply =
      data?.candidates?.[0]?.content?.parts?.[0]?.text ||
      "No reply";

    res.status(200).json({ reply });

  } catch (err) {
    console.error("ERROR:", err);
    res.status(500).json({
      error: err.message
    });
  }
}
