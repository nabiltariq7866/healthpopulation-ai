import type { Patient } from "../../types";
export type CohortRules = {
  age?: "Under 65" | "65+";
  condition?: string;
  risk?: string;
  careGap?: "Overdue" | "Resolved";
  screening?: "Overdue" | "Scheduled" | "Completed";
  medicationRisk?: boolean;
  highUtilization?: boolean;
  recentAdmission?: boolean;
  noContactDays?: number;
};
export const buildCohort = (patients: Patient[], rules: CohortRules, today = new Date("2026-08-14")) => patients.filter((p) => {
  const days = (today.getTime() - new Date(p.lastContact).getTime()) / 864e5;
  return (!rules.condition || p.conditions.includes(rules.condition)) &&
    (!rules.risk || p.risk === rules.risk) &&
    (!rules.age || (rules.age === "65+" ? p.age >= 65 : p.age < 65)) &&
    (!rules.careGap || (rules.careGap === "Overdue" ? p.gaps.some((g) => g.status !== "Completed") : p.gaps.every((g) => g.status === "Completed"))) &&
    (!rules.screening || p.screenings.some((s) => s.status === rules.screening)) &&
    (rules.medicationRisk === undefined || p.medicationRisk === rules.medicationRisk) &&
    (rules.highUtilization === undefined || (p.edVisits >= 3 || p.admissions >= 2) === rules.highUtilization) &&
    (rules.recentAdmission === undefined || p.encounters.some((e) => e.type === "Admission" && e.date >= "2026-05-14") === rules.recentAdmission) &&
    (!rules.noContactDays || days > rules.noContactDays);
});
