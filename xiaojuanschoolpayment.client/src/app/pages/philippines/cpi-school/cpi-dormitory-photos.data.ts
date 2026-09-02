export interface CpiDormitoryProfile {
  id: string;
  label: string;
  englishName: string;
  gallery: string[];
}

const photos = (id: string, count: number): string[] => Array.from(
  { length: count },
  (_, index) => `/assets/cpi/dorm-photos/${id}-${String(index + 1).padStart(2, '0')}.jpg`,
);

// Original photographs from CH_宿务CPI-宿舍照片.pdf, pages 2–10.
// A/B are the photo guide's labels, not an inferred mapping to current room prices.
export const CPI_DORMITORY_PROFILES: CpiDormitoryProfile[] = [
  { id: 'single-a', label: '单人间A', englishName: 'SUPERIOR SINGLE', gallery: photos('single-a', 3) },
  { id: 'single-b', label: '单人间B', englishName: 'EXECUTIVE SINGLE', gallery: photos('single-b', 4) },
  { id: 'double-a', label: '双人间A', englishName: 'DELUXE DOUBLE', gallery: photos('double-a', 4) },
  { id: 'double-b', label: '双人间B', englishName: 'EXECUTIVE DOUBLE', gallery: photos('double-b', 3) },
  { id: 'triple-a', label: '三人间A', englishName: 'DELUXE TRIPLE', gallery: photos('triple-a', 5) },
  { id: 'triple-b', label: '三人间B', englishName: 'SUPERIOR TRIPLE', gallery: photos('triple-b', 5) },
  { id: 'quad-a', label: '四人间A（上床下桌）', englishName: 'DELUXE QUAD', gallery: photos('quad-a', 4) },
  { id: 'quad-b', label: '四人间B（家庭房）', englishName: 'SUPERIOR QUAD / FAMILY ROOM', gallery: photos('quad-b', 3) },
  { id: 'six-female', label: '六人间（女生专用）', englishName: 'SUPERIOR HEXA', gallery: photos('six-female', 6) },
];
