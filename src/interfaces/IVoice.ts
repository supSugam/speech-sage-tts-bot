import { Accent, Age, Gender } from '../enums/voice.enum';

export interface IVoice {
  voice_id: string;
  labels: Labels;
  name: string;
}
export interface Labels {
  accent: Accent;
  description?: string;
  age: Age;
  gender: Gender;
  use_case: string;
}
