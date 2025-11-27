import type { QuoteInfoIndex } from '../model/index.js';
import type { StaticFile } from './types.js';

export type StaticFileAPI = [
  StaticFile<'Quotes', 'data/quotes.json', QuoteInfoIndex>,
];
