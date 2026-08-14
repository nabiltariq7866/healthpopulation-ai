import type { Patient } from "../../types";
const rank = { Low: 0, Moderate: 1, High: 2, "Priority Review": 3 } as const;
export const prioritizeOutreach = (patients: Patient[]) => [...patients].sort((a, b) =>
  rank[b.risk] - rank[a.risk] ||
  b.gaps.filter((g) => g.status !== "Completed").length - a.gaps.filter((g) => g.status !== "Completed").length ||
  Number(b.medicationRisk) - Number(a.medicationRisk),
);
