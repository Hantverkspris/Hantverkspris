export interface Job {
  id: string;
  name: string;
  icon: string;
  hours: number;
  material: number;
  note: string;
}

export const JOBS: Job[] = [
  { id: "ut", name: "Flytta uttag", icon: "🔌", hours: 1.5, material: 300, note: "800–2000 kr" },
  { id: "lm", name: "Lampinstallation", icon: "💡", hours: 1.0, material: 200, note: "300–700 kr/pkt" },
  { id: "sp", name: "Spotlights (4 st)", icon: "✨", hours: 2.5, material: 800, note: "3000–6000 kr" },
  { id: "jf", name: "Jordfelsbrytare", icon: "🛡️", hours: 1.5, material: 900, note: "ca 2500 kr" },
  { id: "ce", name: "Byta elcentral", icon: "⚡", hours: 6.0, material: 5000, note: "15000–40000 kr" },
  { id: "lb", name: "Laddbox EV", icon: "🚗", hours: 4.5, material: 7000, note: "8000–20000 kr" },
  { id: "ba", name: "Badrumsinstallation", icon: "🛁", hours: 5.0, material: 3000, note: "8000–15000 kr" },
  { id: "kr", name: "Byta blandare", icon: "🚿", hours: 1.5, material: 600, note: "ca 2000 kr" },
  { id: "to", name: "Installera toalett", icon: "🪠", hours: 2.5, material: 1500, note: "3500–4000 kr" },
  { id: "sn", name: "Snickeriarbete", icon: "🪚", hours: 4.0, material: 1200, note: "633 kr/tim" },
  { id: "ml", name: "Målning", icon: "🎨", hours: 6.0, material: 1800, note: "570 kr/tim" },
  { id: "an", name: "Annat", icon: "🔩", hours: 2.0, material: 500, note: "varierar" },
];

export const REGION_MULTIPLIERS: Record<string, number> = {
  stockholm: 1.15,
  goteborg: 1.05,
  malmo: 1.05,
  orebro: 0.90,
  norrland: 0.95,
  other: 1.0,
};

export const BASE_RATE = 762;

export function calculateEstimate(params: {
  selectedJobs: Set<string>;
  customJob: string;
  region: string;
  propAge: string;
  numRooms: number;
  measurements: number[];
}) {
  const { selectedJobs, customJob, region, propAge, numRooms, measurements } = params;
  const jobs = JOBS.filter(j => selectedJobs.has(j.id));
  const af = propAge === "gammal" ? 1.45 : propAge === "aldre" ? 1.25 : propAge === "modern" ? 1.1 : 1.0;
  const rm = REGION_MULTIPLIERS[region] || 1.0;
  const xm = measurements.reduce((sum, v) => sum + (isNaN(v) ? 0 : v * 30), 0);

  let lab = 0, mat = 0;
  if (!jobs.length && !customJob.trim()) {
    lab = 2 * BASE_RATE * af * rm;
    mat = 600;
  } else {
    jobs.forEach(j => {
      lab += j.hours * BASE_RATE * af * rm * (1 + 0.07 * (numRooms - 1));
      mat += j.material;
    });
    if (customJob.trim()) {
      lab += 2 * BASE_RATE * af * rm;
      mat += 600;
    }
  }
  mat += xm;

  const tr = 450;
  const sub = Math.max(Math.round(lab + mat + tr), 1500);
  const lo = Math.round(sub * 0.87);
  const hi = Math.round(sub * 1.18);
  const rot = Math.min(Math.round(lab * 0.3), 50000);
  const aft = sub - rot;

  return { labor: Math.round(lab), material: Math.round(mat), travel: tr, subtotal: sub, low: lo, high: hi, rot, afterRot: aft };
}

export function fmt(n: number) {
  return Math.round(n).toLocaleString("sv-SE");
}
