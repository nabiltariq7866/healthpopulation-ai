import type { Patient, RiskTier } from "../../types";

export type PopulationRiskResult = {
  patientId: string;
  tier: RiskTier;
  factors: { label: string; source: string; date: string }[];
  dataFreshness: "Current" | "Review";
  requiresHumanReview: true;
  disclaimer: string;
};

export const calculatePopulationRisk = (patient: Patient): PopulationRiskResult => ({
  patientId: patient.id,
  tier: patient.risk,
  factors: patient.signals.map((signal) => ({ label: signal.evidence, source: signal.source, date: signal.date })),
  dataFreshness: patient.signals.some((signal) => signal.date < "2026-05-01") ? "Review" : "Current",
  requiresHumanReview: true,
  disclaimer: "Demo risk model. Not validated for clinical use.",
});
