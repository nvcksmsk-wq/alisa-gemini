const { GoogleGenAI } = require('@google/genai');

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  if (req.method !== 'POST') return res.status(200).json({ version: '1.0', response: { text: 'Сервер работает.', end_session: false } });

  try {
    const userText = req.body?.request?.command || '';
    if (!userText) return res.status(200).json({ version: '1.0', response: { text: 'Слушаю вас.', end_session: false } });

    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const response = await ai.models.generateContent({ model: 'gemini-2.5-flash', contents: userText });

    return res.status(200).json({ version: '1.0', response: { text: response.text || 'Ошибка генерации ответа', end_session: false } });
  } catch (e) {
    return res.status(200).json({ version: '1.0', response: { text: 'Ошибка сети.', end_session: false } });
  }
};
