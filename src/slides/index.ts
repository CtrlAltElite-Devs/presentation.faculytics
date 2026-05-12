import type { SlideDef } from "./types";
import { slide02Title } from "./02-title";
import { slide03Rationale } from "./03-rationale";
import { slide04Objectives } from "./04-objectives";
import { slide05Design } from "./05-design";
import { slide06Pipeline } from "./06-pipeline";
import { slide07SentimentModel } from "./07-sentiment-model";
import { slide08TopicArch } from "./08-topic-arch";
import { slide09TopicResults } from "./09-topic-results";
import { slide10SentimentResults } from "./10-sentiment-results";
import {
  slideStudentSection,
  slideFacultySection,
  slideDeanSection,
  slideSuperadminSection,
  uiTourSlides,
} from "./ui-tour";
import { slide30Conclusions } from "./30-conclusions";

const studentSlides = uiTourSlides.filter((s) => s.id.startsWith("ui-student-"));
const facultySlides = uiTourSlides.filter((s) => s.id.startsWith("ui-faculty-"));
const deanSlides = uiTourSlides.filter((s) => s.id.startsWith("ui-dean-"));
const adminSlides = uiTourSlides.filter((s) => s.id.startsWith("ui-admin-"));

export const slides: SlideDef[] = [
  slide02Title,
  slide03Rationale,
  slide04Objectives,
  slide05Design,
  slide06Pipeline,
  slide07SentimentModel,
  slide08TopicArch,
  slide09TopicResults,
  slide10SentimentResults,

  // UI tour
  slideStudentSection,
  ...studentSlides,
  slideFacultySection,
  ...facultySlides,
  slideDeanSection,
  ...deanSlides,
  slideSuperadminSection,
  ...adminSlides,

  // Finale
  slide30Conclusions,
];
