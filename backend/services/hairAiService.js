/**
 * Hair AI Service
 * Location: backend/services/hairAiService.js
 * Purpose: Use Gemini to analyze hair photos with context from assessments
 */
const fs = require('fs').promises;
const path = require('path');
const pool = require('../config/db');

let GoogleGenerativeAI;
try {
  // Lazy require so the app still runs if dependency is missing
  ({ GoogleGenerativeAI } = require('@google/generative-ai'));
} catch (e) {
  console.warn('[hairAiService] @google/generative-ai is not installed. Run `npm install @google/generative-ai` in backend.');
}

const GEMINI_MODELS = ['gemini-2.5-flash', 'gemini-1.5-flash'];
const RETRYABLE_STATUS_CODES = new Set([429, 500, 502, 503, 504]);

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getErrorStatusCode(err) {
  const status = err && (err.status || err.statusCode || (err.response && err.response.status));
  const asNum = Number(status);
  return Number.isFinite(asNum) ? asNum : null;
}

function isRetryableGeminiError(err) {
  const status = getErrorStatusCode(err);
  if (status && RETRYABLE_STATUS_CODES.has(status)) return true;
  const msg = String((err && err.message) || '').toLowerCase();
  return msg.includes('service unavailable') || msg.includes('overloaded') || msg.includes('timeout');
}

function getUserFacingGeminiErrorMessage(err) {
  const status = getErrorStatusCode(err);
  const msg = String((err && err.message) || '').toLowerCase();
  if (status === 400 && msg.includes('api key not valid')) {
    return 'Gemini API key is invalid. Please update GEMINI_API_KEY in server environment.';
  }
  if (isRetryableGeminiError(err)) {
    return 'AI analysis is temporarily busy. Please try again in a moment.';
  }
  return 'AI analysis is currently unavailable. Please try again.';
}

async function generateWithFallback(apiKey, contentParts) {
  let lastErr = null;
  for (const modelName of GEMINI_MODELS) {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: modelName });
    for (let attempt = 1; attempt <= 3; attempt += 1) {
      try {
        const result = await model.generateContent(contentParts);
        return result;
      } catch (err) {
        lastErr = err;
        if (!isRetryableGeminiError(err) || attempt === 3) break;
        await sleep(400 * attempt);
      }
    }
  }
  throw lastErr || new Error('Gemini request failed');
}

class HairAiService {
  constructor() {
    this.apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
    if (!this.apiKey) {
      console.warn('[hairAiService] GEMINI_API_KEY/GOOGLE_API_KEY not set. Hair AI analysis will be skipped.');
    }
  }

  /**
   * Get latest hair profile context from assessments (if available)
   */
  async getUserProfileContext(userId) {
    if (process.env.SKIP_DB_FOR_TESTING === 'true') return null;

    const [rows] = await pool.query(
      'SELECT hair_type, scalp_condition, issues_detected FROM hair_profiles WHERE user_id = ? ORDER BY profile_id DESC LIMIT 1',
      [userId]
    );
    if (!rows.length) return null;
    const row = rows[0];
    return {
      hairType: row.hair_type || null,
      scalpCondition: row.scalp_condition || null,
      issuesDetected: row.issues_detected || null,
    };
  }

  /**
   * Analyze a hair photo using Gemini.
   * Returns a JSON string (AI result) or null on failure.
   */
  async analyzePhoto(userId, absoluteImagePath) {
    if (!GoogleGenerativeAI || !this.apiKey) return null;

    let imageBuffer;
    try {
      imageBuffer = await fs.readFile(absoluteImagePath);
    } catch (err) {
      console.error('[hairAiService] Failed to read image file:', absoluteImagePath, err.message);
      return null;
    }

    const base64Data = imageBuffer.toString('base64');

    // Get context from latest assessment / hair profile
    let contextText = '';
    try {
      const profile = await this.getUserProfileContext(userId);
      if (profile) {
        const issues = profile.issuesDetected || '';
        contextText =
          `User-reported profile from assessment:\n` +
          `- Hair type: ${profile.hairType || 'unknown'}\n` +
          `- Scalp condition: ${profile.scalpCondition || 'unknown'}\n` +
          `- Reported concerns: ${issues || 'none reported'}\n\n`;
      }
    } catch (e) {
      console.warn('[hairAiService] Failed to load profile context:', e.message);
    }

    const prompt = `
You are "HairAI" – an advanced AI trichology assistant for a hair-care app.

Use BOTH of the following:
1) The user's self-reported assessment answers (if provided)
2) The uploaded hair/scalp photo

User assessment context (may be partial or missing):
${contextText || 'No assessment context available – rely only on the image.'}

🎯 TASK: From this image (and context), infer the most likely hair/scalp condition(s) and suggest product TYPES and basic routine ideas the user could look for when buying products.

📐 RETURN FORMAT: Valid JSON only, no markdown, no explanations.

{
  "conditionName": "Mild dandruff (likely seborrheic dermatitis)",
  "confidence": 87,
  "hairType": "straight|wavy|curly|coily|uncertain",
  "scalpCondition": "normal|dry|oily|sensitive|flaky|inflamed|mixed|uncertain",
  "severity": "mild|moderate|severe|uncertain",
  "summary": "Short 1–2 sentence overview in simple language.",
  "careTips": [
    "Short, practical tip 1",
    "Short, practical tip 2"
  ],
  "recommendations": [
    {
      "title": "Anti-dandruff shampoo (ketoconazole-based)",
      "description": "1–2 sentences explaining why this type of product may help given what you see.",
      "usageHint": "How often and how to use it briefly.",
      "exampleProducts": [
        "Ketoconazole anti-dandruff shampoo",
        "Zinc pyrithione scalp shampoo"
      ]
    },
    {
      "title": "Lightweight hydrating conditioner",
      "description": "Helps keep lengths moisturized without weighing hair down.",
      "usageHint": "Apply from mid-lengths to ends, avoid scalp if it looks oily.",
      "exampleProducts": [
        "Silicone-free conditioner for oily roots/dry ends"
      ]
    }
  ],
  "whenToSeeProfessional": "1–3 sentences describing when they should see a dermatologist or trichologist (e.g., pain, bleeding, infection signs, rapid hair loss).",
  "disclaimer": "Short, clear disclaimer that this is not a medical diagnosis and cannot replace an in-person professional assessment."
}

CRITICAL: Return ONLY valid JSON. No markdown, no code blocks, no explanations.
    `.trim();

    try {
      const result = await generateWithFallback(this.apiKey, [
        prompt,
        {
          inlineData: {
            data: base64Data,
            mimeType: 'image/jpeg',
          },
        },
      ]);

      const response = result.response;
      const text = response.text();

      // Clean potential markdown fences
      let cleanedText = text.trim();
      cleanedText = cleanedText.replace(/```json\\s*/gi, '');
      cleanedText = cleanedText.replace(/```\\s*/g, '');

      const jsonStart = cleanedText.indexOf('{');
      const jsonEnd = cleanedText.lastIndexOf('}') + 1;
      if (jsonStart === -1 || jsonEnd === 0) {
        console.error('[hairAiService] No valid JSON object found in Gemini response:', cleanedText);
        return null;
      }

      const jsonString = cleanedText.substring(jsonStart, jsonEnd);
      JSON.parse(jsonString); // validate
      return jsonString;
    } catch (err) {
      console.error('[hairAiService] Error during Gemini analysis:', err.message);
      return null;
    }
  }
}

const assessmentService = require('./assessmentService');

// Export both the class instance and the standalone functions
module.exports = {
  HairAiService,
  analyzeHairFromImage,
  getUserProfileContext: HairAiService.prototype.getUserProfileContext,
  analyzePhoto: HairAiService.prototype.analyzePhoto,
};
let model = null;

function getModel() {
  if (model) return model;
  const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY || '';
  if (!apiKey) {
    console.warn('GEMINI_API_KEY (or GOOGLE_API_KEY) is not set. Hair AI analysis will not work.');
    return null;
  }
  model = { apiKey };
  return model;
}

function buildProfileContext(profile, assessmentAnswers) {
  const lines = [];

  if (!profile && (!assessmentAnswers || assessmentAnswers.length === 0)) {
    return 'User has not completed a hair assessment profile yet.';
  }

  if (profile) {
    const issues = (profile.issuesDetected || []).join(', ') || 'none clearly reported';
    lines.push('User self-reported profile summary:');
    lines.push(`- Hair type: ${profile.hairType || 'not specified'}`);
    lines.push(`- Scalp condition: ${profile.scalpCondition || 'not specified'}`);
    lines.push(`- Key concerns/issues: ${issues}`);
  }

  if (assessmentAnswers && assessmentAnswers.length > 0) {
    lines.push('');
    lines.push('Full assessment Q&A answers:');
    assessmentAnswers.forEach((qa, i) => {
      const answerStr = Array.isArray(qa.answer)
        ? qa.answer.join(', ')
        : String(qa.answer);
      lines.push(`Q${i + 1}: ${qa.question}`);
      lines.push(`A${i + 1}: ${answerStr}`);
    });
  }

  return lines.join('\n');
}

async function analyzeHairFromImage(userId, imageBase64) {
  if (!imageBase64) {
    throw new Error('imageBase64 is required');
  }

  const m = getModel();
  if (!m) {
    throw new Error('GEMINI_API_KEY is not configured on the server.');
  }

  // Get latest assessment profile summary AND full Q&A answers to give rich context to the AI
  let latestProfile = null;
  let assessmentAnswers = [];
  if (process.env.SKIP_DB_FOR_TESTING !== 'true') {
    try {
      latestProfile = await assessmentService.getLatestResults(userId);
    } catch (_e) {
      latestProfile = null;
    }
    try {
      assessmentAnswers = await assessmentService.getLatestAssessmentAnswers(userId);
    } catch (_e) {
      assessmentAnswers = [];
    }
  }

  const profileContext = buildProfileContext(latestProfile, assessmentAnswers);

  // Extract the user's self-reported hair type and scalp condition to lock them in the prompt
  const userHairType = latestProfile && latestProfile.hairType
    ? latestProfile.hairType
    : (assessmentAnswers.find(qa => qa.question.toLowerCase().includes('hair type'))
        ? (Array.isArray(assessmentAnswers.find(qa => qa.question.toLowerCase().includes('hair type')).answer)
            ? assessmentAnswers.find(qa => qa.question.toLowerCase().includes('hair type')).answer[0]
            : String(assessmentAnswers.find(qa => qa.question.toLowerCase().includes('hair type')).answer))
        : null);

  const userScalpCondition = latestProfile && latestProfile.scalpCondition
    ? latestProfile.scalpCondition
    : (assessmentAnswers.find(qa => qa.question.toLowerCase().includes('scalp'))
        ? (Array.isArray(assessmentAnswers.find(qa => qa.question.toLowerCase().includes('scalp')).answer)
            ? assessmentAnswers.find(qa => qa.question.toLowerCase().includes('scalp')).answer[0]
            : String(assessmentAnswers.find(qa => qa.question.toLowerCase().includes('scalp')).answer))
        : null);

  const base64Data = imageBase64.includes(',')
    ? imageBase64.split(',')[1]
    : imageBase64;

  const prompt = `
You are "HairAI" – an advanced AI trichology assistant for a hair-care app.

The user has already completed a detailed hair assessment questionnaire.
Use BOTH the self-reported answers AND the photo you receive.

IMPORTANT RULES:
1. The "hairType" field in your JSON response MUST match the user's self-reported hair type exactly (see below). Do NOT infer a different hair type from the image.
2. The "scalpCondition" field in your JSON response MUST match the user's self-reported scalp condition exactly (see below). Do NOT infer a different scalp condition from the image.
3. Use the photo ONLY to identify visible conditions (e.g. dandruff flakes, breakage, oiliness, dryness) and to set the "conditionName", "severity", "summary", "careTips", and "recommendations".

User's self-reported values (USE THESE EXACTLY):
- hairType: "${userHairType || 'not specified'}"
- scalpCondition: "${userScalpCondition || 'not specified'}"

Full assessment context:
${profileContext}

YOUR TASK: From this image and the profile above, identify the most likely hair/scalp condition(s) and suggest product TYPES and basic routine ideas.

RETURN FORMAT: Valid JSON only, no markdown, no explanations.

{
  "conditionName": "Mild dandruff (likely seborrheic dermatitis)",
  "confidence": 87,
  "hairType": "${userHairType || 'uncertain'}",
  "scalpCondition": "${userScalpCondition || 'uncertain'}",
  "severity": "mild|moderate|severe|uncertain",
  "summary": "Short 1–2 sentence overview referencing the user's hair type and scalp condition.",
  "careTips": [
    "Short, practical tip 1 tailored to the user's hair type and scalp condition",
    "Short, practical tip 2"
  ],
  "recommendations": [
    {
      "title": "Anti-dandruff shampoo (ketoconazole-based)",
      "description": "1–2 sentences explaining why this type of product may help given what you see.",
      "usageHint": "How often and how to use it briefly.",
      "exampleProducts": [
        "Ketoconazole anti-dandruff shampoo",
        "Zinc pyrithione scalp shampoo"
      ]
    }
  ],
  "whenToSeeProfessional": "1–3 sentences describing when they should see a dermatologist or trichologist.",
  "disclaimer": "Short, clear disclaimer that this is not a medical diagnosis and cannot replace an in-person professional assessment."
}

CRITICAL: Return ONLY valid JSON. No markdown, no code blocks, no explanations. The "hairType" and "scalpCondition" fields MUST exactly match the user's self-reported values above.
  `.trim();

  let result;
  try {
    result = await generateWithFallback(m.apiKey, [
      prompt,
      {
        inlineData: {
          data: base64Data,
          mimeType: 'image/jpeg',
        },
      },
    ]);
  } catch (e) {
    throw new Error(getUserFacingGeminiErrorMessage(e));
  }

  const response = result.response;
  const text = response.text();

  let cleanedText = text.trim();
  cleanedText = cleanedText.replace(/```json\\s*/gi, '');
  cleanedText = cleanedText.replace(/```\\s*/g, '');

  const jsonStart = cleanedText.indexOf('{');
  const jsonEnd = cleanedText.lastIndexOf('}') + 1;

  if (jsonStart === -1 || jsonEnd === 0) {
    throw new Error('No valid JSON object found in Gemini response');
  }

  const jsonString = cleanedText.substring(jsonStart, jsonEnd);

  try {
    return JSON.parse(jsonString);
  } catch (e) {
    throw new Error('Failed to parse JSON returned by Gemini');
  }
};


