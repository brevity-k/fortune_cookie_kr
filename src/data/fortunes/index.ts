import { Fortune } from '@/types/fortune';
import { loveFortunes } from './love';
import { careerFortunes } from './career';
import { healthFortunes } from './health';
import { studyFortunes } from './study';
import { generalFortunes } from './general';
import { relationshipFortunes } from './relationship';

export const allFortunes: Fortune[] = [
  ...loveFortunes,
  ...careerFortunes,
  ...healthFortunes,
  ...studyFortunes,
  ...generalFortunes,
  ...relationshipFortunes,
];

export {
  loveFortunes,
  careerFortunes,
  healthFortunes,
  studyFortunes,
  generalFortunes,
  relationshipFortunes,
};
