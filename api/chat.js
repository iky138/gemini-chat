import fetch from "node-fetch";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Gunakan POST method" });
    }

    const { message } = req.body || {};
    if (!message) {
      return res.status(400).json({ error: "Pesan kosong" });
    }

    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
      return res.status(500).json({ error: "API key belum diatur" });
    }

    const model = "gemini-1.5-flash";
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;

    const body = {
      contents: [{ parts: [{ text: message }] }]
    };

    const r = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${API_KEY}`
      },
      body: JSON.stringify(body)
    });

    if (!r.ok) {
      const text = await r.text();
      return res.status(502).json({ error: "Gagal dari server Gemini", details: text });
    }

    const data = await r.json();
    const reply = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Tidak ada balasan";
    res.status(200).json({ reply });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}
