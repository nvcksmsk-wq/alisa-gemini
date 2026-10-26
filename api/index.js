const { GoogleGenerativeAI } = require('@google/generative-ai');

module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method !== 'POST') {
    return res.status(200).json({ version: '1.0', response: { text: 'Бот работает!', end_session: false } });
  }

  try {
    const userText = req.body?.request?.command || '';
    
    if (!userText) {
      return res.status(200).json({ version: '1.0', response: { text: 'Слушаю вас.', end_session: false } });
    }

    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    const result = await model.generateContent(userText);
    const responseText = result.response.text();

    return res.status(200).json({
      version: '1.0',
      response: { text: responseText, end_session: false }
    });

  } catch (error) {
    console.error('Ошибка:', error);
    return res.status(200).json({
      version: '1.0',
      response: { text: 'Извините, нейросеть сейчас недоступна.', end_session: false }
    });
  }
};
