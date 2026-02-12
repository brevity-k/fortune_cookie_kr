/**
 * Shared utilities for parsing Claude API responses and file I/O.
 *
 * Centralizes JSON cleanup (code fence stripping, trailing comma removal)
 * that was previously duplicated across 4 generation scripts.
 */

import * as fs from 'fs';

/**
 * Extract text content from a Claude API response.
 * Throws if no text block found.
 */
export function extractTextFromResponse(response: {
  content: Array<{ type: string; text?: string }>;
}): string {
  const textBlock = response.content.find((block) => block.type === 'text');
  if (!textBlock || textBlock.type !== 'text' || !textBlock.text) {
    throw new Error('No text response from API');
  }
  return textBlock.text.trim();
}

/**
 * Parse JSON from Claude API text output.
 * Handles common LLM output artifacts:
 * - Markdown code fences (```json ... ```)
 * - Trailing commas before closing brackets
 */
export function parseClaudeJSON<T>(text: string): T {
  let cleaned = text.trim();

  // Strip markdown code fences if present
  if (cleaned.startsWith('```')) {
    cleaned = cleaned
      .replace(/^```(?:json)?\s*\n?/, '')
      .replace(/\n?```\s*$/, '');
  }

  // Fix trailing commas before closing brackets/braces
  cleaned = cleaned.replace(/,\s*([}\]])/g, '$1');

  return JSON.parse(cleaned) as T;
}

/**
 * Parse a Claude API response as a JSON array.
 * Validates that the result is actually an array.
 */
export function parseClaudeJSONArray<T>(text: string): T[] {
  const parsed = parseClaudeJSON<unknown>(text);
  if (!Array.isArray(parsed)) {
    throw new Error(`Expected JSON array, got ${typeof parsed}`);
  }
  return parsed as T[];
}

/**
 * Read and parse a JSON state file with fallback.
 * Returns the fallback value if:
 * - File doesn't exist
 * - File contains invalid JSON
 * - Parsed value fails the optional validator
 */
export function readStateFile<T>(
  filePath: string,
  fallback: T,
  validator?: (data: unknown) => data is T
): T {
  try {
    const data = fs.readFileSync(filePath, 'utf-8');
    const parsed = JSON.parse(data);
    if (validator && !validator(parsed)) {
      console.warn(`  ⚠️ State file structure invalid, using defaults: ${filePath}`);
      return fallback;
    }
    return parsed as T;
  } catch {
    console.warn(`  ⚠️ Could not read state file, using defaults: ${filePath}`);
    return fallback;
  }
}

/**
 * Write a file atomically using a temp file + rename.
 * Prevents corruption from partial writes.
 * Cleans up temp files on failure.
 */
export function atomicWriteFile(filePath: string, content: string): void {
  const tmpPath = `${filePath}.tmp.${Date.now()}`;
  try {
    fs.writeFileSync(tmpPath, content);
    fs.renameSync(tmpPath, filePath);
  } catch (err) {
    try {
      fs.unlinkSync(tmpPath);
    } catch {
      // temp file may not exist if writeFileSync failed
    }
    throw new Error(
      `Failed to write ${filePath}: ${err instanceof Error ? err.message : String(err)}`
    );
  }
}

/**
 * Write JSON state to file atomically with pretty formatting.
 */
export function writeStateFile(filePath: string, data: unknown): void {
  atomicWriteFile(filePath, JSON.stringify(data, null, 2) + '\n');
}
