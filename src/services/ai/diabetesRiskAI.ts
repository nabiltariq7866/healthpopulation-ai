import type { Patient } from "../../types";
export const identifyDiabetesRisk = (patients: Patient[]) =>
  patients.filter((p) => p.conditions.includes("Diabetes") && (p.risk === "High" || p.risk === "Priority Review"));
