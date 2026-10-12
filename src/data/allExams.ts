// Uygulamadaki tüm denemeler: Uzman Kolluk denemeleri, "Sayılar ve Süreler" testi ve içe aktarılanlar.
import { importedExams } from './exams';
import { factExam } from './factQuestions';
import { newExams } from './newExams';

export const allExams = [...newExams, factExam, ...importedExams];
