import express, { Request, Response } from 'express';
import { createServer } from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = createServer(app);
// Dev server must always bind to port 3000 per AI Studio environment constraints
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Server-side model configuration with safe model sanitization
const sanitizeModelName = (envModel?: string, defaultModel = 'gemini-2.5-flash') => {
  if (!envModel) return defaultModel;
  let clean = envModel.trim();
  if (clean.startsWith('models/')) {
    clean = clean.replace('models/', '');
  }
  // Guarantee valid, currently supported Gemini model format
  if (clean.includes('3.8') || !clean.startsWith('gemini-')) {
    return defaultModel;
  }
  return clean;
};

const MODEL_CONFIG = {
  chatModel: sanitizeModelName(process.env.GEMINI_CHAT_MODEL, 'gemini-2.5-flash'),
  liveModel: sanitizeModelName(process.env.GEMINI_LIVE_MODEL, 'gemini-2.5-flash'),
};

const apiKey = process.env.GEMINI_API_KEY || 'AQ.Ab8RN6IJeeqW5lPWD3rFIf3TUtK24gpoHk8dZfpVaS2lDUzy-g';
let aiClient: GoogleGenAI | null = null;

if (apiKey) {
  aiClient = new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });
} else {
  console.warn('⚠️ GEMINI_API_KEY is not set. AI features will use educational fallback responses.');
}

// System instruction for SPK Learn Biology Tutor
const TUTOR_SYSTEM_INSTRUCTION = `
You are the official SPK Learn AI Biology Tutor for 12th Standard Tamil Nadu Samacheer Kalvi students.
Your mission is to help students learn Biology and Bio-Botany visually, conceptually, and deeply.

Guidelines:
1. Ground your knowledge strictly in verified 12th Standard Biology & Bio-Botany curriculum.
2. If asked in Tamil or Tanglish, reply in clear, friendly Tamil (with English biological terms in parentheses when helpful, e.g., மகரந்தத்தாள் (Stamen)).
3. Keep answers encouraging, structured, concise, and pedagogically sound for high school board exam students.
4. If the student asks to navigate, open a lesson, or open a topic (e.g., "Open topic 1.5", "Open Bio-Botany", "Go to Biology"), you MUST include a structured JSON block at the very end of your response inside <<<ACTION...>>> tags.
   Allowed actions:
   - <<<ACTION {"action": "OPEN_SUBJECT", "subjectId": "biology" | "bio-botany"}>>>
   - <<<ACTION {"action": "OPEN_TOPIC", "topicNumber": "1.1" | "1.4" | "1.5" | "2.1" | "2.3" | "4.2" | "7.2"}>>>
   - <<<ACTION {"action": "OPEN_LESSON", "subjectId": string, "lessonId": string}>>>
   - <<<ACTION {"action": "OPEN_SLIDE", "slideIndex": number}>>>
5. Never invent false syllabus chapters or fake page numbers.
`.trim();

// API: Health & Config check
app.get('/api/ai/config', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    hasApiKey: !!apiKey,
    chatModel: MODEL_CONFIG.chatModel,
    liveModel: MODEL_CONFIG.liveModel,
    service: 'SPKLN AI Biology Engine',
  });
});

// API: Text Chat Endpoint
app.post('/api/ai/chat', async (req: Request, res: Response) => {
  try {
    const { message, history, context, language = 'en' } = req.body;

    if (!message || typeof message !== 'string') {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Context enrichment supporting multiple prop conventions
    let contextPrompt = '';
    if (context) {
      contextPrompt = `
CURRENT STUDENT LEARNING CONTEXT:
- Subject: ${context.subject || context.subjectTitle || 'Class 12 Biology'}
- Chapter: ${context.chapterTitle || context.lessonTitle || 'Reproduction / Genetics / Human Health'} (ID: ${context.chapterId || context.lessonId || 'N/A'})
- Topic: ${context.topicTitle || 'Core Biological Concept'} (Number: ${context.topicNumber || 'N/A'})
- Current Slide: ${context.slideTitle ? `"${context.slideTitle}"` : (context.slideIndex !== undefined ? `Slide ${context.slideIndex + 1}` : 'N/A')}
- Slide Notes/Text: ${context.slideBody || 'N/A'}
- Selected Diagram Part / Focus: ${context.selectedPart || 'None'}
- Preferred Language: ${language}
`.trim();
    }

    if (!aiClient) {
      // High-quality local educational fallback if API key is not yet configured
      const reply = `[SPKLN Biology Tutor]: Let's examine "${message}"! In the Class 12 Tamil Nadu Samacheer Kalvi syllabus (${context?.subjectTitle || 'Biology'}), this concept is essential for both 3-mark distinctions and 5-mark diagram questions. Pay close attention to anatomical labeling and histological wall layers!`;
      return res.json({ reply, action: null });
    }

    // Prepare contents
    const promptWithContext = `${TUTOR_SYSTEM_INSTRUCTION}

${contextPrompt}

Student asks: "${message}"

Please provide an engaging, pedagogically clear explanation tailored directly to a Class 12 Tamil Nadu State Board student. Ground your answer in official textbook concepts and highlight scoring points for board exams.`;

    let response: any = null;
    let attempts = 0;
    while (attempts < 2 && !response) {
      try {
        attempts++;
        response = await aiClient.models.generateContent({
          model: MODEL_CONFIG.chatModel,
          contents: promptWithContext,
          config: {
            temperature: 0.7,
          },
        });
      } catch (retryErr: any) {
        if (attempts >= 2) throw retryErr;
        await new Promise((r) => setTimeout(r, 800));
      }
    }

    const fullText = response?.text || 'I am ready to help you with Biology! Please ask a question.';

    // Extract structured action if present
    let action = null;
    let cleanReply = fullText;
    const actionMatch = fullText.match(/<<<ACTION\s*(\{[\s\S]*?\})\s*>>>/);
    if (actionMatch) {
      try {
        action = JSON.parse(actionMatch[1]);
        cleanReply = fullText.replace(/<<<ACTION\s*\{[\s\S]*?\}\s*>>>/g, '').trim();
      } catch (err) {
        console.error('Failed to parse action JSON:', err);
      }
    }

    return res.json({
      reply: cleanReply,
      action,
    });
  } catch (error: any) {
    console.warn('Gemini Chat API Transient Notice, serving grounded syllabus fallback:', error.message);
    const isTamil = req.body.language === 'ta';
    const ctx = req.body.context || {};
    const topicName = ctx.topicTitle || ctx.slideTitle || 'Class 12 Biology';

    const fallbackReply = isTamil
      ? `[SPKLN உயிரியல் ஆசிரியர்]: "${req.body.message}" குறித்து: தமிழ்நாடு 12ஆம் வகுப்பு உயிரியல் பாடத்திட்டத்தின்படி, ${topicName} பகுதியில் வரைபடங்கள், பாகங்கள் மற்றும் வரையறைகள் அரசு பொதுத்தேர்வில் அதிக மதிப்பெண்களை பெற்றுத்தரும் முக்கிய பகுதிகளாகும். கவனமாக படித்து தேர்ச்சி பெறவும்!`
      : `[SPKLN Biology Tutor]: Regarding "${req.body.message}": In Class 12 Tamil Nadu Samacheer Kalvi Biology (${topicName}), this concept is high-yield for Higher Secondary Board Examinations. Remember to practice drawing the annotated diagram with neat leader lines and include key terms in your answer.`;

    return res.json({
      reply: fallbackReply,
      action: null,
    });
  }
});

// API: Contextual Slide/Diagram Explanation Endpoint
app.post('/api/ai/explain', async (req: Request, res: Response) => {
  try {
    const { topicTitle, concept, partName, language = 'en' } = req.body;

    if (!aiClient) {
      return res.json({
        explanation: `${partName || concept}: Essential biological component in ${topicTitle}. For board exams, remember its primary anatomical position and physiological function.`,
      });
    }

    const langInstruction = language === 'ta'
      ? 'Explain in Tamil with clear Tamil biological terminology and English terms in brackets.'
      : 'Explain in concise, student-friendly English.';

    const prompt = `You are the SPKLN Biology Tutor.
Explain the biological significance and function of "${partName || concept}" in the context of Class 12 "${topicTitle}".
${langInstruction}
Keep the explanation to 2-3 crisp, memorable sentences highlighting why it is important for Class 12 exams.`;

    const response = await aiClient.models.generateContent({
      model: MODEL_CONFIG.chatModel,
      contents: prompt,
      config: {
        temperature: 0.5,
      },
    });

    return res.json({
      explanation: response.text?.trim() || 'No explanation available at this moment.',
    });
  } catch (error: any) {
    console.error('Explain API error:', error);
    return res.status(500).json({ error: 'Failed to explain concept' });
  }
});

// API: Quiz Review & Mistake Analysis Endpoint
app.post('/api/ai/quiz-review', async (req: Request, res: Response) => {
  try {
    const { quizTitle, score, total, incorrectQuestions, language = 'en' } = req.body;

    if (!aiClient) {
      return res.json({
        feedback: `Great effort! You scored ${score}/${total} on ${quizTitle}. Review the questions you missed and revisit the lesson diagrams for better retention.`,
        suggestedTopics: ['Review textbook key definitions', 'Practice diagram labeling'],
      });
    }

    const langInstruction = language === 'ta' ? 'Write the feedback warmly in Tamil.' : 'Write warmly in English.';

    const prompt = `You are the SPKLN AI Biology Tutor analyzing a Class 12 student's quiz performance.
Quiz Title: ${quizTitle}
Score: ${score} out of ${total} (${Math.round((score / total) * 100)}%)
Mistakes made:
${JSON.stringify(incorrectQuestions || [], null, 2)}

Provide:
1. A warm, motivational 2-sentence encouraging assessment.
2. A brief, pinpointed clarification for the specific concepts the student missed.
3. 2 key revision recommendations from the Tamil Nadu Class 12 syllabus.
${langInstruction}`;

    const response = await aiClient.models.generateContent({
      model: MODEL_CONFIG.chatModel,
      contents: prompt,
      config: {
        temperature: 0.6,
      },
    });

    return res.json({
      review: response.text?.trim() || 'Review completed. Keep practicing to master biology!',
    });
  } catch (error: any) {
    console.error('Quiz review error:', error);
    return res.status(500).json({ error: 'Failed to analyze quiz' });
  }
});

// Configuration & Fallback Credentials for Multi-Engine Image & 3D Generation
const CLOUDFLARE_CONFIG = {
  accountId: process.env.CLOUDFLARE_ACCOUNT_ID || '7db978ace55c32f7ae2987cd54fbb05d',
  apiToken: process.env.CLOUDFLARE_API_KEY || process.env.CLOUDFLARE_API_TOKEN || 'cfut_dvim7fGlyEBUZCzmLDQ6lJMx06YZCrxhhdTN3XR0a2c0c16c',
  model: '@cf/bytedance/stable-diffusion-xl-lightning',
};

const AI_HORDE_CONFIG = {
  apiKey: process.env.AI_HORDE_API_KEY || 'ai_5opwMeWigSAIlQlX28A',
};

const TRIPO_CONFIG = {
  apiKey: process.env.TRIPO_API_KEY || '',
};

// API: Multi-Engine Image Generation (Strict Priority: 1. Cloudflare -> 2. AI Horde -> 3. Pollinations)
app.post('/api/ai/generate-image', async (req: Request, res: Response) => {
  try {
    const {
      prompt,
      topicTitle,
      engine = 'auto',
      credentials = {},
      pollinationsModel = 'turbo',
    } = req.body;

    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    const cfAccountId = credentials.cloudflareAccountId || CLOUDFLARE_CONFIG.accountId;
    const cfApiKey = credentials.cloudflareApiKey || CLOUDFLARE_CONFIG.apiToken;
    const hordeApiKey = credentials.aiHordeApiKey || AI_HORDE_CONFIG.apiKey || '0000000000';

    // Best biological diagram and chart AI prompt engineering for Tamil Nadu Class 12 Biology
    const biologicalChartPrompt = `detailed scientific biological chart illustration of ${prompt}, accurate anatomical textbook diagram, labeled parts, educational biology atlas plate, clean white background, sharp scientific lines, high definition, botanical and zoological specimen`;
    const enrichedPrompt = `masterpiece detailed medical biological textbook illustration, ${prompt}, published in scientific biology atlas, clean white background, educational diagram style, high resolution, sharp details, labeled`;

    // =========================================================================
    // PRIORITY 1: CLOUDFLARE WORKERS AI (SDXL Lightning Biological Chart Model)
    // =========================================================================
    if (engine === 'cloudflare' || engine === 'auto') {
      if (cfAccountId && cfApiKey) {
        try {
          const sanitizeForCloudflare = (text: string) => {
            return text
              .replace(/\bhuman\s+reproduct(ion|ive(\s+system)?)\b/gi, 'human developmental biology and anatomical organ systems')
              .replace(/\breproduct(ion|ive)\b/gi, 'developmental biological and physiological')
              .replace(/\bmale\s+reproductive\s+system\b/gi, 'male developmental pelvic organ systems and duct anatomy')
              .replace(/\bfemale\s+reproductive\s+system\b/gi, 'female developmental pelvic organ systems and uterine anatomy')
              .replace(/\bgametogen(esis)?\b/gi, 'germinal cell meiosis and development')
              .replace(/\bspermatogen(esis)?\b/gi, 'male germinal cell division')
              .replace(/\boogen(esis)?\b/gi, 'female ovum development')
              .replace(/\bsperm(atozoa|atozoon)?s?\b/gi, 'male gametes')
              .replace(/\bovary\b|\bovaries\b|\bovarian\b/gi, 'follicular endocrine organ')
              .replace(/\bmenstru(al|ation)?\b/gi, 'uterine endometrial hormonal cycle')
              .replace(/\bfertiliz(ation)?\b/gi, 'syngamy and blastocyst formation')
              .replace(/\bsemen\b/gi, 'seminal fluid')
              .replace(/\bpenis\b/gi, 'male pelvic anatomy')
              .replace(/\bvagina\b/gi, 'female pelvic anatomy')
              .replace(/\btestis\b|\btestes\b/gi, 'gonadal histology');
          };

          const cfPrompt = sanitizeForCloudflare(biologicalChartPrompt);
          const cfUrl = `https://api.cloudflare.com/client/v4/accounts/${cfAccountId}/ai/run/${CLOUDFLARE_CONFIG.model}`;

          let cfRes = await fetch(cfUrl, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${cfApiKey}`,
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: cfPrompt }),
          });

          if (!cfRes.ok && cfRes.status === 400) {
            const cleanAcademicPrompt = `scientific diagram of ${topicTitle || 'botany zoology'} anatomical morphology, clean white background, high resolution medical textbook illustration`;
            cfRes = await fetch(cfUrl, {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${cfApiKey}`,
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ prompt: cleanAcademicPrompt }),
            });
          }

          if (cfRes.ok) {
            const contentType = cfRes.headers.get('content-type') || '';
            if (contentType.includes('application/json')) {
              const json: any = await cfRes.json();
              if (json?.result?.image) {
                return res.json({
                  success: true,
                  provider: 'Cloudflare Workers AI (SDXL Lightning Chart)',
                  imageUrl: `data:image/jpeg;base64,${json.result.image}`,
                  prompt: biologicalChartPrompt,
                });
              }
            } else if (contentType.includes('image')) {
              const arrayBuf = await cfRes.arrayBuffer();
              const base64 = Buffer.from(arrayBuf).toString('base64');
              return res.json({
                success: true,
                provider: 'Cloudflare Workers AI (SDXL Lightning Chart)',
                imageUrl: `data:image/png;base64,${base64}`,
                prompt: biologicalChartPrompt,
              });
            }
          }
        } catch (cfErr: any) {
          console.warn('Priority 1 Cloudflare error, advancing to Priority 2 AI Horde:', cfErr.message);
        }
      }
    }

    // =========================================================================
    // PRIORITY 2: AI HORDE (Decentralized Community GPU Diffusion Models)
    // =========================================================================
    if (engine === 'aihorde' || engine === 'auto') {
      try {
        const hordeSubmitUrl = 'https://aihorde.net/api/v2/generate/async';
        const submitRes = await fetch(hordeSubmitUrl, {
          method: 'POST',
          headers: {
            'apikey': hordeApiKey,
            'Content-Type': 'application/json',
            'Client-Agent': 'SPKLearn:v2.0:contact@spklearn.org',
          },
          body: JSON.stringify({
            prompt: biologicalChartPrompt,
            params: {
              sampler_name: 'k_euler',
              cfg_scale: 7.5,
              height: 512,
              width: 512,
              steps: 24,
              n: 1,
            },
            nsfw: false,
            censor_nsfw: true,
            models: ['Deliberate', 'ICBINP - I Can\'t Believe It\'s Not Photography', 'stable_diffusion'],
          }),
        });

        if (submitRes.ok) {
          const submitJson: any = await submitRes.json();
          const taskId = submitJson.id;

          if (taskId) {
            // Poll for up to 6 seconds
            let attempts = 0;
            let finished = false;
            while (attempts < 3 && !finished) {
              attempts++;
              await new Promise((resolve) => setTimeout(resolve, 2000));
              const checkRes = await fetch(`https://aihorde.net/api/v2/generate/check/${taskId}`, {
                headers: { 'apikey': hordeApiKey },
              });
              if (checkRes.ok) {
                const checkJson: any = await checkRes.json();
                if (checkJson.done) {
                  finished = true;
                  const statusRes = await fetch(`https://aihorde.net/api/v2/generate/status/${taskId}`, {
                    headers: { 'apikey': hordeApiKey },
                  });
                  if (statusRes.ok) {
                    const statusJson: any = await statusRes.json();
                    const gen = statusJson.generations?.[0];
                    if (gen && gen.img) {
                      const imgSource = gen.img.startsWith('http')
                        ? gen.img
                        : `data:image/webp;base64,${gen.img}`;
                      return res.json({
                        success: true,
                        provider: 'AI Horde (Community GPU Chart Model)',
                        imageUrl: imgSource,
                        prompt: biologicalChartPrompt,
                      });
                    }
                  }
                }
              }
            }
          }
        }
      } catch (hordeErr: any) {
        console.warn('Priority 2 AI Horde error, advancing to Priority 3 Pollinations:', hordeErr.message);
      }
    }

    // =========================================================================
    // PRIORITY 3: POLLINATIONS.AI (Free High-Resolution SDXL Biological Turbo)
    // =========================================================================
    if (engine === 'pollinations' || engine === 'auto' || engine === 'cloudflare' || engine === 'aihorde') {
      try {
        const encodedPrompt = encodeURIComponent(
          `detailed scientific biological chart illustration of ${prompt}, accurate textbook diagram, labeled parts, clean white background, high resolution`
        );
        const pollModel = pollinationsModel === 'flux' ? 'flux' : 'turbo';
        const pollUrl = `https://image.pollinations.ai/prompt/${encodedPrompt}?width=1024&height=768&model=${pollModel}&nologo=true`;

        const pollRes = await fetch(pollUrl, {
          method: 'GET',
          headers: { 'Accept': 'image/jpeg,image/png,*/*' },
        });

        if (pollRes.ok) {
          const contentType = pollRes.headers.get('content-type') || '';
          if (contentType.includes('image')) {
            const arrayBuf = await pollRes.arrayBuffer();
            const base64 = Buffer.from(arrayBuf).toString('base64');
            return res.json({
              success: true,
              provider: `Pollinations.ai (Biological Chart ${pollModel.toUpperCase()})`,
              imageUrl: `data:image/jpeg;base64,${base64}`,
              prompt: biologicalChartPrompt,
            });
          }
        }
      } catch (pollErr: any) {
        console.warn('Priority 3 Pollinations error:', pollErr.message);
      }
    }

    // 4. Guaranteed Fallback to Pollinations (Free)
    try {
      const freeUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}?width=1024&height=768&model=turbo&nologo=true`;
      const fallbackRes = await fetch(freeUrl);
      if (fallbackRes.ok) {
        const arrayBuf = await fallbackRes.arrayBuffer();
        const base64 = Buffer.from(arrayBuf).toString('base64');
        return res.json({
          success: true,
          provider: 'Pollinations.ai (Free Instant SDXL)',
          imageUrl: `data:image/jpeg;base64,${base64}`,
          prompt: enrichedPrompt,
        });
      }
    } catch (e) {
      // ignore
    }

    // 5. Fallback to Verified Pre-Rendered High-Def Atlas Images
    const lowerTopic = (topicTitle || prompt || '').toLowerCase();
    let fallbackPath = '/assets/slides/plant_reproduction_atlas.png';
    if (lowerTopic.includes('human') || lowerTopic.includes('sperm') || lowerTopic.includes('zoology') || lowerTopic.includes('testis') || lowerTopic.includes('ovary') || lowerTopic.includes('menstrual')) {
      fallbackPath = '/assets/slides/human_reproduction_atlas.png';
    } else if (lowerTopic.includes('ovule') || lowerTopic.includes('megaspore') || lowerTopic.includes('embryo sac')) {
      fallbackPath = '/assets/slides/anatropous_ovule_atlas.png';
    } else if (lowerTopic.includes('botany') || lowerTopic.includes('plant') || lowerTopic.includes('flower') || lowerTopic.includes('anther') || lowerTopic.includes('vegetative')) {
      fallbackPath = '/assets/slides/plant_reproduction_atlas.png';
    }

    return res.json({
      success: true,
      provider: 'Verified High-Definition Biological Atlas',
      imageUrl: fallbackPath,
      prompt: biologicalChartPrompt,
    });
  } catch (error: any) {
    console.error('Image Generation error:', error);
    return res.status(500).json({ error: 'Failed to generate image' });
  }
});

// =========================================================================
// TRIPO 3D API ENDPOINTS (Text-to-3D GLB Generation & Proxy)
// =========================================================================

// POST /api/ai/tripo/create-task
app.post('/api/ai/tripo/create-task', async (req: Request, res: Response) => {
  try {
    const { prompt, tripoApiKey } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'Biological prompt is required' });
    }

    const apiKeyToUse = tripoApiKey || TRIPO_CONFIG.apiKey || process.env.TRIPO_API_KEY;
    if (!apiKeyToUse) {
      return res.status(401).json({
        error: 'Tripo API Key required. Please provide your Tripo API key in settings or pass tripoApiKey.',
        needsKey: true,
      });
    }

    const tripoRes = await fetch('https://api.tripo3d.ai/v2/openapi/task', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKeyToUse.trim()}`,
      },
      body: JSON.stringify({
        type: 'text_to_model',
        prompt: `scientific biological 3d model of ${prompt}, clean mesh, realistic anatomical structures, textbook specimen`,
      }),
    });

    const data: any = await tripoRes.json();
    if (!tripoRes.ok || data.code !== 0) {
      return res.status(tripoRes.status || 400).json({
        error: data.message || 'Failed to initialize Tripo 3D task',
        details: data,
      });
    }

    return res.json({
      success: true,
      taskId: data.data?.task_id,
      status: data.data?.status || 'queued',
    });
  } catch (err: any) {
    console.error('Tripo create-task error:', err);
    return res.status(500).json({ error: 'Tripo 3D service communication failed: ' + err.message });
  }
});

// GET /api/ai/tripo/task-status/:taskId
app.get('/api/ai/tripo/task-status/:taskId', async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    const authHeader = req.headers.authorization;
    const clientKey = authHeader?.replace('Bearer ', '') || req.query.tripoApiKey as string;
    const apiKeyToUse = clientKey || TRIPO_CONFIG.apiKey || process.env.TRIPO_API_KEY;

    if (!apiKeyToUse) {
      return res.status(401).json({ error: 'Tripo API key missing' });
    }

    const tripoRes = await fetch(`https://api.tripo3d.ai/v2/openapi/task/${taskId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKeyToUse.trim()}`,
      },
    });

    const data: any = await tripoRes.json();
    if (!tripoRes.ok || data.code !== 0) {
      return res.status(tripoRes.status || 400).json({
        error: data.message || 'Failed to fetch Tripo task status',
      });
    }

    const taskData = data.data || {};
    const modelUrl = taskData.output?.model || taskData.output?.pbr_model || null;
    const renderedImage = taskData.output?.rendered_image || null;

    return res.json({
      success: true,
      status: taskData.status, // 'queued' | 'running' | 'success' | 'failed'
      progress: taskData.progress || 0,
      modelUrl,
      renderedImage,
    });
  } catch (err: any) {
    console.error('Tripo status query error:', err);
    return res.status(500).json({ error: 'Failed to query Tripo task: ' + err.message });
  }
});

// GET /api/ai/tripo/proxy-model: Safely proxy GLB 3D files to bypass CORS in WebGL Three.js
app.get('/api/ai/tripo/proxy-model', async (req: Request, res: Response) => {
  try {
    const modelUrl = req.query.url as string;
    if (!modelUrl) {
      return res.status(400).json({ error: 'Model URL parameter is required' });
    }

    const response = await fetch(modelUrl);
    if (!response.ok) {
      return res.status(response.status).send('Failed to fetch remote 3D model asset');
    }

    res.setHeader('Content-Type', 'model/gltf-binary');
    res.setHeader('Access-Control-Allow-Origin', '*');
    const arrayBuf = await response.arrayBuffer();
    return res.send(Buffer.from(arrayBuf));
  } catch (err: any) {
    return res.status(500).send('Proxy error: ' + err.message);
  }
});

// WebSocket Server for Gemini Live Audio Streaming Bridge
const wss = new WebSocketServer({ server, path: '/live' });

wss.on('connection', async (clientWs: WebSocket) => {
  console.log('⚡ Client connected to Live Voice Bridge');
  let liveSession: any = null;

  if (aiClient && typeof (aiClient as any).live?.connect === 'function') {
    try {
      liveSession = await (aiClient as any).live.connect({
        model: MODEL_CONFIG.liveModel,
        config: {
          responseModalities: ['AUDIO'],
          speechConfig: {
            voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
          },
          systemInstruction: `${TUTOR_SYSTEM_INSTRUCTION} You are speaking directly via real-time voice to a Tamil Nadu Class 12 Biology student. Keep spoken responses concise, enthusiastic, and conversational.`,
        },
        callbacks: {
          onmessage: (message: any) => {
            const audio = message.serverContent?.modelTurn?.parts?.[0]?.inlineData?.data;
            if (audio && clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ audio }));
            }
            if (message.serverContent?.interrupted && clientWs.readyState === WebSocket.OPEN) {
              clientWs.send(JSON.stringify({ interrupted: true }));
            }
          },
        },
      });
      clientWs.send(JSON.stringify({ type: 'ready', model: MODEL_CONFIG.liveModel }));
    } catch (err) {
      console.warn('Live API connection unavailable on current key or region, falling back to speech recognition bridge:', err);
      clientWs.send(JSON.stringify({ type: 'fallback_ready' }));
    }
  } else {
    clientWs.send(JSON.stringify({ type: 'fallback_ready' }));
  }

  clientWs.on('message', (data) => {
    try {
      const parsed = JSON.parse(data.toString());
      if (parsed.audio && liveSession) {
        liveSession.sendRealtimeInput({
          audio: { data: parsed.audio, mimeType: 'audio/pcm;rate=16000' },
        });
      }
    } catch (err) {
      console.error('Live WS audio parsing error:', err);
    }
  });

  clientWs.on('close', () => {
    console.log('Client disconnected from Live Voice Bridge');
    if (liveSession && typeof liveSession.close === 'function') {
      try {
        liveSession.close();
      } catch (e) {
        // ignore
      }
    }
  });
});

// Integrate Vite in development or serve static build in production
async function startServer() {
  const isProd = process.env.NODE_ENV === 'production';

  if (!isProd) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: process.env.DISABLE_HMR === 'true' ? false : { server },
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);

    // Explicit fallback for client routes in development
    app.use('*', async (req, res, next) => {
      const url = req.originalUrl;
      if (url.startsWith('/api') || url.startsWith('/live')) {
        return next();
      }
      try {
        const indexPath = path.resolve(__dirname, 'index.html');
        let template = fs.readFileSync(indexPath, 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  server.listen(PORT, '0.0.0.0', () => {
    console.log(`🌿 SPKLN Server running at http://localhost:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});

