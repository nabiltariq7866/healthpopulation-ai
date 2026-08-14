import type { Patient } from "../../types";
export const generatePatientPopulationSummary = (patient: Patient) => ({
  patientId: patient.id,
  cohorts: patient.cohorts,
  riskTier: patient.risk,
  openCareGaps: patient.gaps.filter((gap) => gap.status !== "Completed").length,
  medicationConcern: patient.medicationRisk,
  utilization: { edVisits: patient.edVisits, admissions: patient.admissions },
  evidence: patient.signals.map((signal) => ({ ...signal, sourceTraceable: true })),
  recommendation: "Requires care-team review",
  disclaimer: "Demo risk model. Not validated for clinical use.",
});
