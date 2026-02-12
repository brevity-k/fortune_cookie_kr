/**
 * Shared utilities for reading and modifying fortune data files.
 *
 * Used by generate-fortunes.ts and generate-seasonal-fortunes.ts
 * to avoid duplicating file parsing logic.
 */

import * as fs from 'fs';
import * as path from 'path';
import type { FortuneCategory } from './constants';

const FORTUNES_DIR = path.join(process.cwd(), 'src', 'data', 'fortunes');

export function getCategoryFilePath(category: FortuneCategory): string {
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
