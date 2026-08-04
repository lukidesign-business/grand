import 'server-only';

import type { Locale } from './config';
import en from './en.json';
import pl from './pl.json';

/** The English file is the source of truth for the dictionary shape. */
export type Dictionary = typeof en;

const dictionaries: Record<Locale, Dictionary> = {
  en,
  // Both files are authored against the same key structure; the cast keeps
  // TypeScript honest about that contract without duplicating the type.
  pl: pl as unknown as Dictionary
};

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

export { fill } from './fill';
export type { Locale };
