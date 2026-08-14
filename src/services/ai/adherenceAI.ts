import type { Patient } from "../../types";
export const detectAdherenceConcern = (patients: Patient[]) =>
  patients.filter((p) => p.medicationRisk || p.medications.some((m) => m.refillIndicator !== "Current"));
export const explainAdherenceConcern = (patient: Patient) => patient.medications
  .filter((m) => m.refillIndicator !== "Current")
  .map((m) => ({ medication: m.name, indicator: m.refillIndicator, source: m.source, lastRefill: m.lastRefill, caution: "Potential adherence concern. Requires review." }));
