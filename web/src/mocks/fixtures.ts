import type { Lexeme } from '../api/types';

export const MOCK_LEXEMES_RUN: Lexeme[] = [
  {
    lemma: 'run',
    pos: 'verb',
    transcription: 'rʌn',
    senses: [
      {
        id: 'sense_run_v_1',
        translation_ru: 'бежать',
        synonyms_ru: ['мчаться', 'нестись'],
        meanings_en: ['move at a speed faster than a walk'],
        examples: [
          {
            en: 'She runs five miles every morning along the coast.',
            ru: 'Она бегает пять миль каждое утро вдоль побережья.',
          },
        ],
        saved: false,
      },
      {
        id: 'sense_run_v_2',
        translation_ru: 'управлять',
        synonyms_ru: ['руководить', 'вести'],
        meanings_en: ['be in charge of; manage or organize'],
        examples: [
          {
            en: 'He runs a small independent bakery in the town center.',
            ru: 'Он управляет небольшой независимой пекарней в центре города.',
          },
        ],
        saved: false,
      },
      {
        id: 'sense_run_v_3',
        translation_ru: 'работать',
        synonyms_ru: ['функционировать'],
        meanings_en: ['function or operate continuously'],
        examples: [
          {
            en: 'The engine is running quietly and smoothly.',
            ru: 'Двигатель работает тихо и плавно.',
          },
        ],
        saved: false,
      },
    ],
  },
  {
    lemma: 'run',
    pos: 'noun',
    transcription: 'rʌn',
    senses: [
      {
        id: 'sense_run_n_1',
        translation_ru: 'пробежка',
        synonyms_ru: ['бег'],
        meanings_en: ['an act or spell of running for exercise'],
        examples: [
          {
            en: 'I went for a 5-kilometer run in the park before breakfast.',
            ru: 'Я вышел на 5-километровую пробежку в парке перед завтраком.',
          },
        ],
        saved: false,
      },
      {
        id: 'sense_run_n_2',
        translation_ru: 'полоса',
        synonyms_ru: ['серия'],
        meanings_en: ['a continuous sequence or streak'],
        examples: [
          {
            en: 'The football team enjoyed a magnificent run of six consecutive victories.',
            ru: 'Футбольная команда наслаждалась великолепной серией из шести побед подряд.',
          },
        ],
        saved: false,
      },
    ],
  },
];

export const MOCK_LEXEMES_BANK: Lexeme[] = [
  {
    lemma: 'bank',
    pos: 'noun',
    transcription: 'bæŋk',
    senses: [
      {
        id: 'sense_bank_n_1',
        translation_ru: 'банк',
        synonyms_ru: ['финансовое учреждение'],
        meanings_en: ['a financial institution licensed to receive deposits and make loans'],
        examples: [
          {
            en: 'I went to the bank to open a savings account.',
            ru: 'Я пошёл в банк, чтобы открыть сберегательный счёт.',
          },
        ],
        saved: false,
      },
      {
        id: 'sense_bank_n_2',
        translation_ru: 'берег',
        synonyms_ru: ['набережная', 'склон'],
        meanings_en: ['the land along the edge of a river or lake'],
        examples: [
          {
            en: 'They set up camp on the grassy bank of the river.',
            ru: 'Они разбили лагерь на травянистом берегу реки.',
          },
        ],
        saved: false,
      },
    ],
  },
  {
    lemma: 'bank',
    pos: 'verb',
    transcription: 'bæŋk',
    senses: [
      {
        id: 'sense_bank_v_1',
        translation_ru: 'рассчитывать',
        synonyms_ru: ['полагаться'],
        meanings_en: ['rely on or count on with confidence'],
        examples: [
          {
            en: "You can bank on his support when you need it most.",
            ru: 'Ты можешь рассчитывать на его поддержку, когда она нужнее всего.',
          },
        ],
        saved: false,
      },
    ],
  },
];

export const MOCK_LEXEMES_LIGHT: Lexeme[] = [
  {
    lemma: 'light',
    pos: 'noun',
    transcription: 'laɪt',
    senses: [
      {
        id: 'sense_light_n_1',
        translation_ru: 'свет',
        synonyms_ru: ['освещение', 'сияние'],
        meanings_en: ['the natural agent that stimulates sight and makes things visible'],
        examples: [
          {
            en: 'Morning light began to filter through the trees.',
            ru: 'Утренний свет начал пробиваться сквозь деревья.',
          },
        ],
        saved: false,
      },
    ],
  },
  {
    lemma: 'light',
    pos: 'adjective',
    transcription: 'laɪt',
    senses: [
      {
        id: 'sense_light_adj_1',
        translation_ru: 'лёгкий',
        synonyms_ru: ['невесомый', 'нетяжёлый'],
        meanings_en: ['of little weight; not heavy'],
        examples: [
          {
            en: 'This carbon-fiber bicycle is remarkably light.',
            ru: 'Этот велосипед из углеродного волокна удивительно лёгкий.',
          },
        ],
        saved: false,
      },
      {
        id: 'sense_light_adj_2',
        translation_ru: 'светлый',
        synonyms_ru: ['ясный', 'яркий'],
        meanings_en: ['having a considerable amount of natural or artificial illumination'],
        examples: [
          {
            en: 'The studio apartment was bright, light, and airy.',
            ru: 'Квартира-студия была светлой, яркой и просторной.',
          },
        ],
        saved: false,
      },
    ],
  },
];

export const MOCK_DICTIONARY_FIXTURES: Record<string, Lexeme[]> = {
  run: MOCK_LEXEMES_RUN,
  bank: MOCK_LEXEMES_BANK,
  light: MOCK_LEXEMES_LIGHT,
};
