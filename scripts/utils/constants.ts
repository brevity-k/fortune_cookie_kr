/**
 * Re-export shared constants from src/types/fortune.ts (single source of truth).
 * Scripts should import from here to maintain a clean dependency boundary.
 *
 * IMPORTANT: Scripts should NEVER import directly from ../../src/types/fortune.
 * Add any needed exports here instead.
 */
export {
  VALID_COLORS,
  FORTUNE_CATEGORIES,
  CATEGORIES,
  CATEGORY_LABELS,
  FORTUNE_ID_PATTERN,
  type CategoryInfo,
  type Fortune,
  type ValidColor,
  type FortuneCategory,
} from '../../src/types/fortune';
