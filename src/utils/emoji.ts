import { Age, Gender } from '../enums/voice.enum';
import { IVoice } from '../interfaces/IVoice';
import { COUNTRIES_BY_ACCENT } from './constants';

export const getEmojiByVoice = (voice: IVoice) => {
  let emoji = '';

  switch (voice.labels.gender) {
    case Gender.MALE: {
      switch (voice.labels.age) {
        case Age.YOUNG:
          emoji = '👦';
          break;
        case Age.MIDDLE_AGED:
          emoji = '🧔';
          break;
        case Age.OLD:
          emoji = '👴';
          break;
      }
      break;
    }

    case Gender.FEMALE: {
      switch (voice.labels.age) {
        case Age.YOUNG:
          emoji = '👧';
          break;
        case Age.MIDDLE_AGED:
          emoji = '👩';
          break;
        case Age.OLD:
          emoji = '👵';
          break;
      }
      break;
    }
  }
  COUNTRIES_BY_ACCENT[voice.labels.accent]
    ? (emoji += COUNTRIES_BY_ACCENT[voice.labels.accent])
    : (emoji += '🎙️');
  return emoji;
};
