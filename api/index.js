const { GoogleGenerativeAI } = require('@google/generative-ai');

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

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
    const model = genAI.getGenerativeModel({ model: 'gemini-3.8-flash' });

    let responseText = '';
    let attempt = 0;
    const maxAttempts = 3;

    while (attempt < maxAttempts) {
      try {
        const result = await model.generateContent(userText);
        responseText = result.response.text();
        break; 
      } catch (error) {
        attempt++;
        if (attempt >= maxAttempts) throw error; 
        await delay(500); 
      }
    }

    return res.status(200).json({
      version: '1.0',
      response: { text: responseText, end_session: false }
    });

  } catch (error) {
    console.error('Ошибка:', error);
    return res.status(200).json({
      version: '1.0',
      response: { text: 'Серверы сейчас сильно загружены, повторите вопрос через пару минут.', end_session: false }
    });
  }
};
