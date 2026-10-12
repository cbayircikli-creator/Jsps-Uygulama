import type { CourtDecision } from './types';

// Emsal kararlar, künyesi (mahkeme, esas/karar no, tarih) resmî kaynağından doğrulanarak eklenir.
// Doğrulanmamış veya örnek kayıt eklenmez.
export const decisions: CourtDecision[] = [];
