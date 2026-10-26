module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method !== 'POST') {
    return res.status(200).json({ version: '1.0', response: { text: 'Бот работает!', end_session: false } });
  }

  try {
    const userText = req.body?.request?.command || req.body?.request?.original_utterance || '';
    
    // Блокируем пустые запросы
    if (!userText.trim()) {
      return res.status(200).json({ version: '1.0', response: { text: 'Слушаю вас.', end_session: false } });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-20b', // <--- Актуальная бесплатная модель
        messages: [
          { 
            role: 'system', 
            content: 'Отвечай на русском языке максимально кратко, не более 2-3 предложений.' 
          },
          { role: 'user', content: userText }
        ]
      })
    });

    if (!response.ok) {
      const errorData = await response.text();
      console.error('Детали ответа Groq:', errorData);
      throw new Error(`Ошибка API: ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.choices[0].message.content;

    return res.status(200).json({
      version: '1.0',
      response: { text: responseText, end_session: false }
    });

  } catch (error) {
    console.error('Ошибка:', error);
    return res.status(200).json({
      version: '1.0',
      response: { text: 'Произошел технический сбой.', end_session: false }
    });
  }
};
