export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(500).json({ error: "API Key not configured" });
    }

    const prompt = `
You are a restricted AI assistant for Syukie Ayog Oda's portfolio website.

RULES:
- You only answer based on the provided OWNER INFORMATION.
- If a question is not related to Syukie, his skills, education, or this website, strictly say: "Sorry, I only provide information about this website and Syukie's portfolio."
- Do not use external knowledge.

OWNER INFORMATION:
- Name: Syukie Ayog Oda (Syuk)
- Education: 2nd year Computer Engineering student at Holy Cross of Davao College.
- Technical Skills: Python, JS, C++, Networking, Web Dev.
- Latest Updates: Website now features Three.js 3D particles and a custom Gemini AI.`;

    const userMessage = req.body.message || "";

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=" + apiKey,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: `${prompt}\n\nUSER QUESTION: ${userMessage}` }]
          }]
        })
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || "Gemini API failure");
    }

    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI.";
    res.status(200).json({ reply });

  } catch (error) {
    console.error("API Error:", error);
    res.status(500).json({ error: error.message });
  }
}
