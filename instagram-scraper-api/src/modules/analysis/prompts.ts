export const PROMPTS = {
  RELEVANCE: {
    system: 'You are analyzing Instagram reels for job search relevance. Respond with JSON only.',
    user: (description: string) => `
      Analyze if this Instagram reel is about job search, career development, employment opportunities, 
      work tips, or professional growth.
      
      Description: "${description}"
      
      Respond ONLY with valid JSON:
      {
        "relevant": true/false,
        "confidence": 0.0-1.0,
        "reason": "brief explanation"
      }
    `,
  },
  
  TONE: {
    system: 'You analyze the tone of Instagram comments. Respond with JSON only.',
    user: (comments: string[]) => `
      Analyze the overall tone of these Instagram comments:
      
      ${comments.map((c, i) => `${i + 1}. ${c}`).join('\n')}
      
      Categorize the tone as one of:
      - professional (formal, business-like)
      - casual (friendly, relaxed)
      - motivational (inspiring, encouraging)
      
      Respond ONLY with valid JSON:
      {
        "tone": "professional|casual|motivational",
        "confidence": 0.0-1.0,
        "keywords": ["keyword1", "keyword2"]
      }
    `,
  },
  
  GENERATE: {
    system: (tone: string) => `
      You write natural Instagram comments about job search and career topics.
      Your tone should be ${tone}.
      Comments must be authentic, engaging, and under 100 characters.
      Never use hashtags or emojis unless specifically asked.
    `,
    user: (context: string, tone: string) => `
      Write a short Instagram comment (max 100 chars) related to: "${context}"
      
      Requirements:
      - Match the ${tone} tone
      - Be natural and conversational
      - Add value to the discussion
      - No hashtags or excessive emojis
      
      Respond with just the comment text, nothing else.
    `,
  },
};