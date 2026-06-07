export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      return res.status(500).json({ error: "Missing API key" });
    }

    const userMessage = req.body.message || "";

    const prompt = `
You are a restricted AI assistant for Syukie Ayog Oda's portfolio website.

RULES:
- You only answer based on the provided OWNER INFORMATION.
- If a question is not related to Syukie, his skills, education, or this website, strictly say: "Sorry, I only provide information about this website and Syukie's portfolio."
- Block general knowledge: Do not answer questions about general history, science, math, or unrelated coding concepts.
- Do not guess. Do not use external knowledge.

OWNER INFORMATION:
- Name: Syukie Ayog Oda (Syuk)
- Website Purpose: Professional Portfolio showcasing Computer Engineering expertise.
- Education: 2nd year Computer Engineering student at Holy Cross of Davao College (2023-2028).
- Technical Skills: Python, JS, C++, PHP, HTML5, CSS3, Networking, Cybersecurity, Embedded Systems, Linux, GitHub.
- Creative Talents: Music Creator, Singer, Guitar Player.
- Latest Updates: Website now features Three.js 3D particles and a custom Gemini-powered AI Assistant.`;

    const response = await fetch(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + apiKey,
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
      throw new Error(data.error?.message || "Gemini API error");
    }

    return res.status(200).json({
      reply: data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response from AI."
    });

  } catch (error) {
    console.error("API Route Error:", error);
    return res.status(500).json({
      error: error.message
    });
  }
}
