import * as path from 'path';

export const VOICE_OPTIONS_PATH = path.join(__dirname, '../store/voices.json');
// enum Accent {
//     AMERICAN = 'american',
//     BRITISH_ESSEX = 'british-essex',
//     IRISH = 'irish',
//     AUSTRALIAN = 'australian',
//     BRITISH = 'british',
//     ENGLISH_SWEDISH = 'english-swedish',
//     AMERICAN_IRISH = 'american-irish',
//     AMERICAN_SOUTHERN = 'american-southern',
// }
export const COUNTRIES_BY_ACCENT: Record<string, string> = {
  american: '🇺🇸',
  'british-essex': '🇬🇧',
  irish: '🇮🇪',
  australian: '🇦🇺',
  british: '🇬🇧',
  'english-swedish': '🇬🇧🇸🇪',
  'american-irish': '🇺🇸🇮🇪',
  'american-southern': '🇺🇸',
};
