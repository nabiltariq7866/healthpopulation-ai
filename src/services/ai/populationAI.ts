import type { Patient } from "../../types";
export const identifyDiabetesRisk = (patients: Patient[]) =>
  patients.filter(
    (p) =>
      p.conditions.includes("Diabetes") &&
      (p.risk === "High" || p.risk === "Priority Review"),
  );
export const identifyReadmissionRisk = (patients: Patient[]) =>
  patients.filter((p) => p.cohorts.includes("High Readmission Risk"));
export const identifyHighUtilization = (patients: Patient[]) =>
  patients.filter((p) => p.edVisits >= 3 || p.admissions >= 2);
export const detectCareGaps = (patients: Patient[]) =>
  patients.flatMap((patient) =>
    patient.gaps
      .filter((g) => g.status === "Open")
      .map((gap) => ({ patient, gap })),
  );
export const buildCohort = (
  patients: Patient[],
  rules: {
    condition?: string;
    risk?: string;
    openGap?: boolean;
    noContactDays?: number;
  },
  today = new Date("2026-08-14"),
) =>
  patients.filter((p) => {
    const days = (today.getTime() - new Date(p.lastContact).getTime()) / 864e5;
    return (
      (!rules.condition || p.conditions.includes(rules.condition)) &&
      (!rules.risk || p.risk === rules.risk) &&
      (!rules.openGap || p.gaps.some((g) => g.status === "Open")) &&
      (!rules.noContactDays || days > rules.noContactDays)
    );
  });
export const validateCohortRules = (rules: {
  condition?: string;
  risk?: string;
  openGap?: boolean;
  noContactDays?: number;
}) => {
  if (
    !Object.values(rules).some((value) => value !== undefined && value !== "")
  )
    return { valid: false, error: "At least one cohort rule is required" };
  if (rules.noContactDays !== undefined && rules.noContactDays < 0)
    return { valid: false, error: "Last-contact interval cannot be negative" };
  if (
    rules.risk &&
    !["Low", "Moderate", "High", "Priority Review"].includes(rules.risk)
  )
    return { valid: false, error: "Unknown risk tier" };
  return { valid: true };
};
export const explainPatientRisk = (p: Patient) =>
  p.signals.map((signal) => ({ ...signal, requiresHumanReview: true }));
export const prioritizeOutreach = (patients: Patient[]) =>
  [...patients].sort(
    (a, b) =>
      (b.risk === "Priority Review" ? 2 : b.risk === "High" ? 1 : 0) -
        (a.risk === "Priority Review" ? 2 : a.risk === "High" ? 1 : 0) ||
      b.gaps.filter((g) => g.status === "Open").length -
        a.gaps.filter((g) => g.status === "Open").length,
  );
