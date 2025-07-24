const { OpenAI } = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function analyzeComment(commentText) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `Ты анализируешь комментарии в Instagram. 
          Определи, относится ли комментарий к темам:
          - поиск работы
          - headhunter россия
          - поиск работы в айти
          - как найти работу
          - проблемы с трудоустройством
          - вопросы о резюме или собеседованиях
          
          Отвечай только "true" или "false".`
        },
        {
          role: 'user',
          content: commentText
        }
      ],
      temperature: 0.3,
      max_tokens: 10
    });
    
    const result = response.choices[0].message.content.toLowerCase().trim();
    return result === 'true';
    
  } catch (error) {
    console.error('Error analyzing comment:', error);
    return false;
  }
}

async function generateResponse(commentText) {
  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [
        {
          role: 'system',
          content: `Ты помощник по поиску работы, отвечающий на комментарии в Instagram.
          
          Правила:
          1. Отвечай дружелюбно и поддерживающе
          2. Давай конкретные советы по поиску работы
          3. Используй эмодзи умеренно (1-2 на ответ)
          4. Ответ должен быть коротким (до 100 слов)
          5. Не упоминай конкретные компании или сервисы
          6. Фокусируйся на практических советах
          7. Тональность должна соответствовать комментарию (сочувствие к проблемам, энтузиазм к успехам)`
        },
        {
          role: 'user',
          content: `Комментарий: "${commentText}"\n\nСгенерируй полезный ответ:`
        }
      ],
      temperature: 0.7,
      max_tokens: 150
    });
    
    return response.choices[0].message.content.trim();
    
  } catch (error) {
    console.error('Error generating response:', error);
    return null;
  }
}

module.exports = { analyzeComment, generateResponse };  