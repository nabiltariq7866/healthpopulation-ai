import type { Patient } from "../../types";
export const generatePatientPopulationSummary = (patient: Patient) => ({
  patientId: patient.id,
  cohorts: patient.cohorts,
  openCareGaps: patient.gaps.filter((gap) => gap.status === "Open").length,
  evidence: patient.signals,
  recommendation: "Requires care-team review",
  disclaimer: "Demo risk model. Not validated for clinical use.",
});
