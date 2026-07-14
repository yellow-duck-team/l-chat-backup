import { r2Url } from 'lib/assetUrl';

// Sources for a fab asset on R2
export const fabSources = (path) => [r2Url(`fab/${path}`)].filter(Boolean);

// Loona member names, indexed by member number minus one
export const artistName = [
  '희진 • HeeJin',
  '현진 • HyunJin',
  '하슬 • HaSeul',
  '여진 • YeoJin',
  '비비 • ViVi',
  '김립 • Kim Lip',
  '진솔 • JinSoul',
  '최리 • Choerry',
  '이브 • Yves',
  '츄 • Chuu',
  '고원 • Go Won',
  '올리비아 혜 • Olivia Hye'
];
