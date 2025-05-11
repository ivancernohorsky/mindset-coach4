import OpenAI from 'openai';
import { kurz_content } from '../../lib/kurz_data.js';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ reply: 'Pouze POST metoda je podporována.' });
  }

  const { messages, topic } = req.body;

  const systemPrompt = `
Jsi "Mindset Coach" – digitální průvodce kurzem. Pomáháš studentům rozvíjet dovednosti kouče, emoční inteligenci, růstový mindset a sebereflexi. Kontext tématu:
${kurz_content[topic]?.context || ''}
  `;

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'system', content: systemPrompt }, ...messages],
    });

    const reply = completion.choices?.[0]?.message?.content || 'Odpověď se nepodařilo načíst.';
    console.log("✅ GPT odpověď:", reply);
    res.status(200).json({ reply });
  } catch (error) {
    console.error("❌ Chyba volání OpenAI API:", error?.response?.data || error.message || error);
    res.status(500).json({
      reply: "Promiň, v tuto chvíli nemohu odpovědět. Zkus to prosím později."
    });
  }
}
