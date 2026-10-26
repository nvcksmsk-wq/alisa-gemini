module.exports = async (req, res) => {
  res.setHeader('Content-Type', 'application/json; charset=utf-8');

  if (req.method !== 'POST') {
    return res.status(200).json({ version: '1.0', response: { text: 'Бот работает через Groq!', end_session: false } });
  }

  try {
    const userText = req.body?.request?.command || '';
    
    if (!userText) {
      return res.status(200).json({ version: '1.0', response: { text: 'Слушаю вас.', end_session: false } });
    }

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.GROQ_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'llama3-8b-8192',
        messages: [
          { 
            role: 'system', 
            content: 'Отвечай на русском языке максимально кратко, не более 2-3 предложений. Твой ответ должен генерироваться очень быстро.' 
          },
          { role: 'user', content: userText }
        ]
      })
    });

    if (!response.ok) {
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
      response: { text: 'Произошла ошибка при обращении к серверу. Попробуйте еще раз.', end_session: false }
    });
  }
};
