/**
 * Shared utilities for reading and modifying fortune data files.
 *
 * Used by generate-fortunes.ts and generate-seasonal-fortunes.ts
 * to avoid duplicating file parsing and writing logic.
 */

import * as fs from 'fs';
import * as path from 'path';
import { VALID_COLORS, type Fortune, type FortuneCategory } from './constants';
import { atomicWriteFile } from './json';

const FORTUNES_DIR = path.join(process.cwd(), 'src', 'data', 'fortunes');

function getCategoryFilePath(category: FortuneCategory): string {
  return path.join(FORTUNES_DIR, `${category}.ts`);
}

/**
 * Read a fortune category file and extract existing messages and highest ID number.
 */
export function readExistingFortunes(category: FortuneCategory): {
  fileContent: string;
  messages: string[];
  highestIdNum: number;
} {
  const filePath = getCategoryFilePath(category);
  const fileContent = fs.readFileSync(filePath, 'utf-8');

  // Extract all messages
  const messageRegex = /message:\s*'([^']+)'/g;
  const messages: string[] = [];
  let match;
  while ((match = messageRegex.exec(fileContent)) !== null) {
    messages.push(match[1]);
  }

  // Find highest ID number
  const idRegex = new RegExp(`${category}_(\\d+)`, 'g');
  let highestIdNum = 0;
  while ((match = idRegex.exec(fileContent)) !== null) {
    const num = parseInt(match[1], 10);
    if (num > highestIdNum) highestIdNum = num;
  }

  return { fileContent, messages, highestIdNum };
}

/**
 * Extract 2-3 sample fortune objects from file content for use as style reference.
 * Returns empty string with warning if no samples found.
 */
export function getSampleFortunes(fileContent: string): string {
  const blocks: string[] = [];
  const lines = fileContent.split('\n');
  let current = '';
  let inBlock = false;

  for (const line of lines) {
    if (!inBlock && line.includes("id: '") && line.trim().startsWith("id:")) {
      inBlock = true;
      current = '  {\n' + line + '\n';
      continue;
    }
    if (inBlock) {
      current += line + '\n';
      if (line.includes('},')) {
        blocks.push(current.trim().replace(/,\s*$/, ''));
        current = '';
        inBlock = false;
      }
    }
  }

  if (blocks.length === 0) {
    console.warn('  ⚠️ Could not extract sample fortunes. Generated content may lack style consistency.');
    return '';
  }

  // Pick 2-3 samples from different positions
  const indices: number[] = [0];
  if (blocks.length > 5) indices.push(Math.floor(blocks.length / 2));
  if (blocks.length > 2) indices.push(blocks.length - 1);

  return indices
    .map((i) => blocks[i])
    .filter(Boolean)
    .join(',\n  ');
}

/**
 * Fix recoverable issues in AI output in place: invalid luckyColor values and
 * single quotes (which would break the single-quoted TS literals).
 */
export function sanitizeFortunes(fortunes: Fortune[]): void {
  const validColors: readonly string[] = VALID_COLORS;

  for (const f of fortunes) {
    if (!validColors.includes(f.luckyColor)) {
      const original = f.luckyColor;
      f.luckyColor = VALID_COLORS[Math.floor(Math.random() * VALID_COLORS.length)];
      console.log(`  ⚠️ luckyColor 자동 수정: "${original}" → "${f.luckyColor}"`);
    }

    for (const field of ['message', 'interpretation', 'shareText'] as const) {
      if (typeof f[field] === 'string' && f[field].includes("'")) {
        f[field] = f[field].replace(/'/g, '\u2019');
        console.log(`  ⚠️ ${field}의 작은따옴표 자동 수정 (${f.id})`);
      }
    }
  }
}

function formatFortuneAsCode(f: Fortune): string {
  return `  {
    id: '${f.id}',
    category: '${f.category}',
    message: '${f.message.replace(/'/g, "\\'")}',
    interpretation: '${f.interpretation.replace(/'/g, "\\'")}',
    luckyNumber: ${f.luckyNumber},
    luckyColor: '${f.luckyColor}',
    rating: ${f.rating},
    emoji: '${f.emoji}',
    shareText: '${f.shareText.replace(/'/g, "\\'")}',
  },`;
}

/** Append fortunes to the end of a category data file. */
export function appendFortunesToFile(category: FortuneCategory, fortunes: Fortune[]): void {
  const filePath = getCategoryFilePath(category);
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const fortuneCode = fortunes.map(formatFortuneAsCode).join('\n');

  // Insert before the closing ];
  const insertPoint = fileContent.lastIndexOf('];');
  if (insertPoint === -1) {
    throw new Error(`Could not find closing ]; in ${category}.ts`);
  }

  const updatedContent =
    fileContent.slice(0, insertPoint) + fortuneCode + '\n' + fileContent.slice(insertPoint);
  atomicWriteFile(filePath, updatedContent);
}
