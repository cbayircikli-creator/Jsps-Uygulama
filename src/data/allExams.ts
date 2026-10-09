// Uygulamadaki tüm denemeler: içe aktarılanlar ve "Sayılar ve Süreler" testi.
import { importedExams } from './exams';
import { factExam } from './factQuestions';

export const allExams = [factExam, ...importedExams];
