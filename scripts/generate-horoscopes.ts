/**
 * Horoscope content generation script
 *
 * Usage:
 *   npx tsx scripts/generate-horoscopes.ts              # Auto: daily + weekly if Sunday + monthly if 1st
 *   npx tsx scripts/generate-horoscopes.ts --daily       # Generate daily horoscopes only
 *   npx tsx scripts/generate-horoscopes.ts --weekly      # Generate weekly horoscopes only
 *   npx tsx scripts/generate-horoscopes.ts --monthly     # Generate monthly horoscopes only
 *   npx tsx scripts/generate-horoscopes.ts --all         # Generate all three
 *
 * Environment:
 *   ANTHROPIC_API_KEY - Claude API key (required)
 */

import Anthropic from '@anthropic-ai/sdk';
import * as fs from 'fs';
import * as path from 'path';
import { withRetry } from './utils/retry';

const DATA_FILE = path.join(__dirname, '..', 'src', 'data', 'horoscopes.json');

const ZODIAC_SIGNS = [
  { key: 'aries', name: 'Aries', symbol: '\u2648', element: 'Fire', dateRange: 'Mar 21 - Apr 19', ruler: 'Mars' },
  { key: 'taurus', name: 'Taurus', symbol: '\u2649', element: 'Earth', dateRange: 'Apr 20 - May 20', ruler: 'Venus' },
  { key: 'gemini', name: 'Gemini', symbol: '\u264A', element: 'Air', dateRange: 'May 21 - Jun 20', ruler: 'Mercury' },
  { key: 'cancer', name: 'Cancer', symbol: '\u264B', element: 'Water', dateRange: 'Jun 21 - Jul 22', ruler: 'Moon' },
  { key: 'leo', name: 'Leo', symbol: '\u264C', element: 'Fire', dateRange: 'Jul 23 - Aug 22', ruler: 'Sun' },
  { key: 'virgo', name: 'Virgo', symbol: '\u264D', element: 'Earth', dateRange: 'Aug 23 - Sep 22', ruler: 'Mercury' },
  { key: 'libra', name: 'Libra', symbol: '\u264E', element: 'Air', dateRange: 'Sep 23 - Oct 22', ruler: 'Venus' },
  { key: 'scorpio', name: 'Scorpio', symbol: '\u264F', element: 'Water', dateRange: 'Oct 23 - Nov 21', ruler: 'Pluto' },
  { key: 'sagittarius', name: 'Sagittarius', symbol: '\u2650', element: 'Fire', dateRange: 'Nov 22 - Dec 21', ruler: 'Jupiter' },
  { key: 'capricorn', name: 'Capricorn', symbol: '\u2651', element: 'Earth', dateRange: 'Dec 22 - Jan 19', ruler: 'Saturn' },
  { key: 'aquarius', name: 'Aquarius', symbol: '\u2652', element: 'Air', dateRange: 'Jan 20 - Feb 18', ruler: 'Uranus' },
  { key: 'pisces', name: 'Pisces', symbol: '\u2653', element: 'Water', dateRange: 'Feb 19 - Mar 20', ruler: 'Neptune' },
];

const MOODS = [
  'energetic', 'determined', 'curious', 'reflective', 'confident', 'focused',
  'harmonious', 'intense', 'adventurous', 'ambitious', 'innovative', 'intuitive',
  'playful', 'calm', 'passionate', 'grounded', 'inspired', 'optimistic',
];

const COLORS = [
  'red', 'blue', 'green', 'gold', 'silver', 'purple', 'pink', 'orange',
  'white', 'navy', 'maroon', 'teal', 'coral', 'lavender', 'charcoal',
  'emerald', 'crimson', 'amber', 'indigo', 'seafoam', 'electric blue',
];

interface HoroscopeData {
  daily: {
    date: string;
    horoscopes: Record<string, {
      text: string;
      love: number;
      career: number;
      health: number;
      luckyNumber: number;
      luckyColor: string;
      mood: string;
    }>;
  };
  weekly: {
    weekOf: string;
    horoscopes: Record<string, {
      overview: string;
      love: string;
      career: string;
      advice: string;
    }>;
  };
  monthly: {
    month: string;
    horoscopes: Record<string, {
      overview: string;
      love: string;
      career: string;
      health: string;
      advice: string;
    }>;
  };
}

function readData(): HoroscopeData {
  const raw = fs.readFileSync(DATA_FILE, 'utf-8');
  return JSON.parse(raw);
}

function writeData(data: HoroscopeData): void {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2) + '\n');
}

function getToday(): string {
  const d = new Date();
  return d.toISOString().split('T')[0];
}

function getWeekStart(): string {
  const d = new Date();
  const day = d.getDay();
  const diff = d.getDate() - day; // Sunday = 0
  const sunday = new Date(d.setDate(diff));
  return sunday.toISOString().split('T')[0];
}

function getCurrentMonth(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
}

function getSeasonContext(): string {
  const month = new Date().getMonth() + 1;
  if (month >= 3 && month <= 5) return 'spring — renewal, growth, new beginnings';
  if (month >= 6 && month <= 8) return 'summer — vitality, passion, abundance';
  if (month >= 9 && month <= 11) return 'autumn — harvest, reflection, transformation';
  return 'winter — introspection, planning, resilience';
}

async function generateDaily(client: Anthropic): Promise<HoroscopeData['daily']['horoscopes']> {
  const today = getToday();
  const season = getSeasonContext();
  const signList = ZODIAC_SIGNS.map(
    (s) => `${s.name} (${s.symbol}, ${s.element}, ruled by ${s.ruler}, ${s.dateRange})`
  ).join('\n');

  const prompt = `You are an expert astrologer writing daily horoscopes for a fortune cookie website. Generate today's horoscope for all 12 zodiac signs.

## Context
- Date: ${today}
- Season: ${season}
- Write in English, with an engaging, warm, and insightful tone
- Reference planetary movements, transits, and house placements to feel authentic
- Each sign's horoscope should be 2-3 sentences (40-80 words)
- Vary the tone: some optimistic, some cautionary, some introspective

## Zodiac Signs
${signList}

## Output Format
Return a JSON object with keys for each sign (lowercase). Each value has:
- "text": string (the horoscope reading, 2-3 sentences)
- "love": number 1-5 (star rating)
- "career": number 1-5
- "health": number 1-5
- "luckyNumber": number 1-99
- "luckyColor": string (from: ${COLORS.join(', ')})
- "mood": string (from: ${MOODS.join(', ')})

Ensure variety in ratings (not all 4s and 5s — include some 2s and 3s).
Ensure each sign gets a unique luckyNumber, luckyColor, and mood.

**Return ONLY the JSON object. No markdown code fences or extra text.**`;

  const response = await withRetry(() =>
    client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 4000,
      messages: [{ role: 'user', content: prompt }],
    })
  );

  const textBlock = response.content.find((b) => b.type === 'text');
  if (!textBlock || textBlock.type !== 'text') throw new Error('No text response');

  let json = textBlock.text.trim();
  if (json.startsWith('```')) {
    json = json.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
  }
  json = json.replace(/,\s*([}\]])/g, '$1');

  return JSON.parse(json);
}

async function generateWeekly(client: Anthropic): Promise<HoroscopeData['weekly']['horoscopes']> {
  const weekOf = getWeekStart();
  const season = getSeasonContext();
  const signList = ZODIAC_SIGNS.map(
    (s) => `${s.name} (${s.symbol}, ${s.element}, ruled by ${s.ruler})`
  ).join('\n');

  const prompt = `You are an expert astrologer writing weekly horoscopes. Generate this week's horoscope for all 12 zodiac signs.

## Context
- Week of: ${weekOf}
- Season: ${season}
- Write in English with depth and nuance
- Reference planetary aspects, retrogrades, and transits relevant to this week
- Each section should be 2-3 sentences

## Zodiac Signs
${signList}

## Output Format
Return a JSON object with keys for each sign (lowercase). Each value has:
- "overview": string (general weekly overview, 2-3 sentences)
- "love": string (love & relationships, 2-3 sentences)
- "career": string (career & finance, 2-3 sentences)
- "advice": string (one key piece of advice, 1-2 sentences)

**Return ONLY the JSON object. No markdown code fences or extra text.**`;

  const response = await withRetry(() =>
    client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 6000,
      messages: [{ role: 'user', content: prompt }],
    })
  );

  const textBlock = response.content.find((b) => b.type === 'text');
  if (!textBlock || textBlock.type !== 'text') throw new Error('No text response');

  let json = textBlock.text.trim();
  if (json.startsWith('```')) {
    json = json.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
  }
  json = json.replace(/,\s*([}\]])/g, '$1');

  return JSON.parse(json);
}

async function generateMonthly(client: Anthropic): Promise<HoroscopeData['monthly']['horoscopes']> {
  const month = getCurrentMonth();
  const [year, mon] = month.split('-');
  const monthName = new Date(parseInt(year), parseInt(mon) - 1).toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const season = getSeasonContext();
  const signList = ZODIAC_SIGNS.map(
    (s) => `${s.name} (${s.symbol}, ${s.element}, ruled by ${s.ruler})`
  ).join('\n');

  const prompt = `You are an expert astrologer writing monthly horoscopes. Generate the horoscope for ${monthName} for all 12 zodiac signs.

## Context
- Month: ${monthName}
- Season: ${season}
- Write in English with depth, warmth, and astrological authenticity
- Reference major planetary transits, retrogrades, and eclipses for this month
- Each section should be 2-4 sentences

## Zodiac Signs
${signList}

## Output Format
Return a JSON object with keys for each sign (lowercase). Each value has:
- "overview": string (monthly overview, 3-4 sentences)
- "love": string (love & relationships, 2-3 sentences)
- "career": string (career & finance, 2-3 sentences)
- "health": string (health & wellness, 2-3 sentences)
- "advice": string (key monthly advice, 1-2 sentences)

**Return ONLY the JSON object. No markdown code fences or extra text.**`;

  const response = await withRetry(() =>
    client.messages.create({
      model: 'claude-sonnet-4-5-20250929',
      max_tokens: 8000,
      messages: [{ role: 'user', content: prompt }],
    })
  );

  const textBlock = response.content.find((b) => b.type === 'text');
  if (!textBlock || textBlock.type !== 'text') throw new Error('No text response');

  let json = textBlock.text.trim();
  if (json.startsWith('```')) {
    json = json.replace(/^```(?:json)?\s*\n?/, '').replace(/\n?```\s*$/, '');
  }
  json = json.replace(/,\s*([}\]])/g, '$1');

  return JSON.parse(json);
}

function validateDaily(horoscopes: Record<string, unknown>): string[] {
  const errors: string[] = [];
  for (const sign of ZODIAC_SIGNS) {
    const h = horoscopes[sign.key] as Record<string, unknown> | undefined;
    if (!h) { errors.push(`Missing daily horoscope for ${sign.key}`); continue; }
    if (!h.text || typeof h.text !== 'string') errors.push(`${sign.key}: missing text`);
    if (typeof h.love !== 'number' || h.love < 1 || h.love > 5) errors.push(`${sign.key}: love must be 1-5`);
    if (typeof h.career !== 'number' || h.career < 1 || h.career > 5) errors.push(`${sign.key}: career must be 1-5`);
    if (typeof h.health !== 'number' || h.health < 1 || h.health > 5) errors.push(`${sign.key}: health must be 1-5`);
    if (typeof h.luckyNumber !== 'number' || h.luckyNumber < 1 || h.luckyNumber > 99) errors.push(`${sign.key}: luckyNumber must be 1-99`);
    if (!h.luckyColor || typeof h.luckyColor !== 'string') errors.push(`${sign.key}: missing luckyColor`);
    if (!h.mood || typeof h.mood !== 'string') errors.push(`${sign.key}: missing mood`);
  }
  return errors;
}

function validateWeekly(horoscopes: Record<string, unknown>): string[] {
  const errors: string[] = [];
  for (const sign of ZODIAC_SIGNS) {
    const h = horoscopes[sign.key] as Record<string, unknown> | undefined;
    if (!h) { errors.push(`Missing weekly horoscope for ${sign.key}`); continue; }
    if (!h.overview || typeof h.overview !== 'string') errors.push(`${sign.key}: missing overview`);
    if (!h.love || typeof h.love !== 'string') errors.push(`${sign.key}: missing love`);
    if (!h.career || typeof h.career !== 'string') errors.push(`${sign.key}: missing career`);
    if (!h.advice || typeof h.advice !== 'string') errors.push(`${sign.key}: missing advice`);
  }
  return errors;
}

function validateMonthly(horoscopes: Record<string, unknown>): string[] {
  const errors: string[] = [];
  for (const sign of ZODIAC_SIGNS) {
    const h = horoscopes[sign.key] as Record<string, unknown> | undefined;
    if (!h) { errors.push(`Missing monthly horoscope for ${sign.key}`); continue; }
    if (!h.overview || typeof h.overview !== 'string') errors.push(`${sign.key}: missing overview`);
    if (!h.love || typeof h.love !== 'string') errors.push(`${sign.key}: missing love`);
    if (!h.career || typeof h.career !== 'string') errors.push(`${sign.key}: missing career`);
    if (!h.health || typeof h.health !== 'string') errors.push(`${sign.key}: missing health`);
    if (!h.advice || typeof h.advice !== 'string') errors.push(`${sign.key}: missing advice`);
  }
  return errors;
}

async function main() {
  const args = process.argv.slice(2);
  const flagDaily = args.includes('--daily');
  const flagWeekly = args.includes('--weekly');
  const flagMonthly = args.includes('--monthly');
  const flagAll = args.includes('--all');

  // Determine what to generate
  let doDaily = false;
  let doWeekly = false;
  let doMonthly = false;

  if (flagAll) {
    doDaily = doWeekly = doMonthly = true;
  } else if (flagDaily || flagWeekly || flagMonthly) {
    doDaily = flagDaily;
    doWeekly = flagWeekly;
    doMonthly = flagMonthly;
  } else {
    // Auto mode: daily always, weekly on Sunday, monthly on 1st
    doDaily = true;
    const today = new Date();
    if (today.getDay() === 0) doWeekly = true;
    if (today.getDate() === 1) doMonthly = true;
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    console.error('ANTHROPIC_API_KEY environment variable is required.');
    process.exit(1);
  }

  const client = new Anthropic();
  const data = readData();

  console.log('');
  console.log('========================================');
  console.log('  ⭐ Horoscope Content Generator');
  console.log('========================================');
  console.log(`  Daily:   ${doDaily ? 'YES' : 'skip'}`);
  console.log(`  Weekly:  ${doWeekly ? 'YES' : 'skip'}`);
  console.log(`  Monthly: ${doMonthly ? 'YES' : 'skip'}`);
  console.log('');

  if (doDaily) {
    console.log('  Generating daily horoscopes...');
    const horoscopes = await generateDaily(client);
    const errors = validateDaily(horoscopes);
    if (errors.length > 0) {
      console.error('  Daily validation errors:');
      errors.forEach((e) => console.error(`    - ${e}`));
      process.exit(1);
    }
    data.daily = { date: getToday(), horoscopes };
    console.log(`  ✅ Daily horoscopes generated for ${getToday()}`);
  }

  if (doWeekly) {
    console.log('  Generating weekly horoscopes...');
    const horoscopes = await generateWeekly(client);
    const errors = validateWeekly(horoscopes);
    if (errors.length > 0) {
      console.error('  Weekly validation errors:');
      errors.forEach((e) => console.error(`    - ${e}`));
      process.exit(1);
    }
    data.weekly = { weekOf: getWeekStart(), horoscopes };
    console.log(`  ✅ Weekly horoscopes generated for week of ${getWeekStart()}`);
  }

  if (doMonthly) {
    console.log('  Generating monthly horoscopes...');
    const horoscopes = await generateMonthly(client);
    const errors = validateMonthly(horoscopes);
    if (errors.length > 0) {
      console.error('  Monthly validation errors:');
      errors.forEach((e) => console.error(`    - ${e}`));
      process.exit(1);
    }
    data.monthly = { month: getCurrentMonth(), horoscopes };
    console.log(`  ✅ Monthly horoscopes generated for ${getCurrentMonth()}`);
  }

  writeData(data);
  console.log('');
  console.log('  📂 Updated: src/data/horoscopes.json');
  console.log('  ✅ All done!');
  console.log('');
}

main().catch((err) => {
  console.error('Error:', err.message);
  process.exit(1);
});
