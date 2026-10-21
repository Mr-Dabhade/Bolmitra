import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI, Type } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(express.json({ limit: '10mb' }));

const port = process.env.PORT || 3000;

// Initialize Google GenAI with recommended header
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    },
  },
});

// Chat endpoint: English Partner + Real-time Marathi Explanations & Corrections
app.post('/api/chat', async (req: Request, res: Response) => {
  try {
    const {
      message,
      history = [],
      scenario = 'casual',
      partnerPersona = 'friendly_buddy',
      userLevel = 'intermediate',
    } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    const systemInstruction = `You are 'BolMitra' (बोलमित्र), an expert AI English Speaking Partner and Marathi-English Language Coach.
Your mission is to help Marathi speakers learn to speak English fluently, overcome hesitation, and master grammar without fear.

User English proficiency level: ${userLevel}
Current Conversation Scenario: ${scenario} (e.g. casual daily life, job interview, restaurant/travel, office meeting, shopping)
Partner Persona: ${partnerPersona} (encouraging, friendly, patient native English speaker)

Rules for your response:
1. "englishReply": Continue the conversation naturally in clear, conversational English matching the scenario and level. Keep it engaging, authentic, and end with an open-ended question or conversational hook.
2. "marathiTranslation": Provide a fluent, natural Marathi translation of your English reply so the user clearly understands what you said.
3. "hasMistakes": Set to true if the user's input has ANY grammatical mistake, tense error, preposition mistake, wrong word choice, spelling mistake, or unidiomatic Marathi-to-English translation. Set to false if their sentence was completely correct and natural.
4. "correctedSentence": If there are mistakes, provide the corrected, natural English version of the user's sentence. If no mistake, provide the original sentence or a slightly more idiomatic version.
5. "corrections": Detailed breakdown of every single mistake found:
   - "originalSnippet": The problematic part or word
   - "correctedSnippet": The corrected part or word
   - "type": category ("grammar", "tense", "preposition", "vocabulary", "word_order", "spelling")
   - "marathiExplanation": Explain clearly in MARATHI why this was wrong, what the grammar rule is, and mention if this is a typical Marathi-thinking mistake (उदा. "मराठीत आपण असे बोलतो, पण इंग्रजीत...").
6. "betterAlternatives": 2-3 other natural ways to express the user's message (e.g., Casual/Friendly, Professional/Polite, Fluent Native).
7. "marathiPronunciationGuide": Key English words from the exchange that Marathi speakers often mispronounce, with Marathi Devanagari phonetic guide and Marathi meaning.
8. "suggestedNextReplies": 3 sample replies in English that the user can choose to reply with next, along with their Marathi meanings, to keep them from getting stuck.

Always output strictly valid JSON matching the specified schema.`;

    const contents = [];

    // Add recent history for conversational context
    if (Array.isArray(history) && history.length > 0) {
      const recent = history.slice(-6);
      for (const h of recent) {
        if (h.role === 'user' && h.content) {
          contents.push({ role: 'user', parts: [{ text: h.content }] });
        } else if (h.role === 'model' && h.englishReply) {
          contents.push({ role: 'model', parts: [{ text: h.englishReply }] });
        }
      }
    }

    // Add current user message
    contents.push({
      role: 'user',
      parts: [
        {
          text: `User's message in English: "${message}". Please analyze grammar, mistakes, explain in Marathi, and reply as my English partner.`,
        },
      ],
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.7,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            englishReply: {
              type: Type.STRING,
              description: 'Conversational response from the English partner',
            },
            marathiTranslation: {
              type: Type.STRING,
              description: 'Clear Marathi translation of the English reply',
            },
            hasMistakes: {
              type: Type.BOOLEAN,
              description: 'Whether the user made any grammatical or phrasing errors',
            },
            correctedSentence: {
              type: Type.STRING,
              description: 'The correct, natural English version of what the user meant',
            },
            corrections: {
              type: Type.ARRAY,
              description: 'List of specific mistakes with Marathi explanations',
              items: {
                type: Type.OBJECT,
                properties: {
                  originalSnippet: { type: Type.STRING },
                  correctedSnippet: { type: Type.STRING },
                  type: { type: Type.STRING },
                  marathiExplanation: { type: Type.STRING },
                },
                required: ['originalSnippet', 'correctedSnippet', 'type', 'marathiExplanation'],
              },
            },
            betterAlternatives: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  tone: { type: Type.STRING, description: 'Casual, Professional, Native, etc.' },
                  english: { type: Type.STRING },
                  marathi: { type: Type.STRING },
                },
                required: ['tone', 'english', 'marathi'],
              },
            },
            marathiPronunciationGuide: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  word: { type: Type.STRING },
                  marathiPhonetic: { type: Type.STRING },
                  meaning: { type: Type.STRING },
                },
                required: ['word', 'marathiPhonetic', 'meaning'],
              },
            },
            suggestedNextReplies: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  english: { type: Type.STRING },
                  marathi: { type: Type.STRING },
                },
                required: ['english', 'marathi'],
              },
            },
          },
          required: [
            'englishReply',
            'marathiTranslation',
            'hasMistakes',
            'correctedSentence',
            'corrections',
            'betterAlternatives',
            'suggestedNextReplies',
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error('No response text received from Gemini');
    }

    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/chat:', error);
    return res.status(500).json({
      error: 'Failed to process conversation',
      details: error?.message || 'Unknown error',
    });
  }
});

// Real-time Grammar Checker / Sentence Doctor endpoint
app.post('/api/analyze-sentence', async (req: Request, res: Response) => {
  try {
    const { sentence } = req.body;
    if (!sentence || typeof sentence !== 'string') {
      return res.status(400).json({ error: 'Sentence is required' });
    }

    const systemInstruction = `You are an expert English-Marathi Grammar Doctor.
A Marathi speaker is writing an English sentence and needs in-depth grammatical correction and detailed explanation in Marathi.

Analyze:
1. Identify all grammar, spelling, tense, preposition, subject-verb agreement, and word choice errors.
2. Provide a score from 0 to 100 for accuracy and fluency.
3. Explain every mistake in easy-to-understand Marathi, explaining the underlying grammar rule with examples.
4. Give corrected versions for different contexts (Formal, Casual, Advanced/Native).
5. Give a key grammar takeaway rule in Marathi.
6. Provide a quick 1-question Marathi-to-English mini quiz related to this error so the user can test their understanding.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: [{ role: 'user', parts: [{ text: `Analyze this sentence: "${sentence}"` }] }],
      config: {
        systemInstruction,
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            score: { type: Type.NUMBER, description: 'Score from 0 to 100' },
            hasMistakes: { type: Type.BOOLEAN },
            originalSentence: { type: Type.STRING },
            correctedSentence: { type: Type.STRING },
            marathiSentenceMeaning: { type: Type.STRING, description: 'Exact meaning of sentence in Marathi' },
            mistakes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  incorrectSnippet: { type: Type.STRING },
                  correctSnippet: { type: Type.STRING },
                  ruleCategory: { type: Type.STRING },
                  explanationInMarathi: { type: Type.STRING },
                  tipInMarathi: { type: Type.STRING },
                },
                required: ['incorrectSnippet', 'correctSnippet', 'ruleCategory', 'explanationInMarathi', 'tipInMarathi'],
              },
            },
            variations: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  context: { type: Type.STRING },
                  sentence: { type: Type.STRING },
                  marathiMeaning: { type: Type.STRING },
                },
                required: ['context', 'sentence', 'marathiMeaning'],
              },
            },
            keyGrammarRuleInMarathi: { type: Type.STRING },
            quiz: {
              type: Type.OBJECT,
              properties: {
                marathiPrompt: { type: Type.STRING },
                options: { type: Type.ARRAY, items: { type: Type.STRING } },
                correctIndex: { type: Type.NUMBER },
                explanationInMarathi: { type: Type.STRING },
              },
              required: ['marathiPrompt', 'options', 'correctIndex', 'explanationInMarathi'],
            },
          },
          required: [
            'score',
            'hasMistakes',
            'originalSentence',
            'correctedSentence',
            'marathiSentenceMeaning',
            'mistakes',
            'variations',
            'keyGrammarRuleInMarathi',
            'quiz',
          ],
        },
      },
    });

    const text = response.text;
    if (!text) throw new Error('No response from Gemini');
    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (error: any) {
    console.error('Error in /api/analyze-sentence:', error);
    return res.status(500).json({
      error: 'Failed to analyze sentence',
      details: error?.message || 'Unknown error',
    });
  }
});

// Text-to-Speech endpoint using gemini-3.8-flash-lite-tts
app.post('/api/tts', async (req: Request, res: Response) => {
  try {
    const { text, voice = 'Kore' } = req.body;
    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Text is required for TTS' });
    }

    // Gemini 3.8 Flash Lite TTS
    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash-lite-tts',
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: text.slice(0, 400),
              speechMetadata: {
                style: 'Clear, polite, friendly conversation partner with natural pronunciation',
              },
            },
          ],
        },
      ],
      config: {
        responseModalities: ['AUDIO'],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voice }, // 'Kore', 'Puck', 'Charon', 'Fenrir', 'Zephyr'
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    if (!base64Audio) {
      return res.status(500).json({ error: 'Audio generation failed' });
    }

    return res.json({
      audioBase64: base64Audio,
      mimeType: 'audio/wav',
    });
  } catch (error: any) {
    console.error('Error in /api/tts:', error);
    return res.status(500).json({
      error: 'TTS generation failed',
      details: error?.message || 'Unknown error',
    });
  }
});

// Static files / Vite middleware
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(Number(port), '0.0.0.0', () => {
    console.log(`BolMitra server running on http://0.0.0.0:${port}`);
  });
}

startServer();
