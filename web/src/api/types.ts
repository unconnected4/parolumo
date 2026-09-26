export interface ExampleSentence {
  en: string;
  ru: string;
}

export interface Sense {
  id: string; // opaque deterministic sense_id string owned by backend / mock
  translation_ru: string;
  synonyms_ru?: string[];
  meanings_en?: string[];
  examples?: ExampleSentence[];
  saved: boolean;
}

export interface Lexeme {
  lemma: string;
  pos: string; // e.g. "noun", "verb", "adjective"
  transcription?: string;
  senses: Sense[];
}

export interface LookupResponse {
  query: string;
  lexemes: Lexeme[];
}

export interface Card {
  id: string;
  sense_id: string;
  lemma: string;
  pos: string;
  transcription?: string;
  translation_ru: string;
  synonyms_ru?: string[];
  meanings_en?: string[];
  examples?: ExampleSentence[];
  created_at: string;
  notes?: string;
}

export interface User {
  id: string;
  email: string;
}

export interface ApiError {
  message: string;
  status?: number;
}
