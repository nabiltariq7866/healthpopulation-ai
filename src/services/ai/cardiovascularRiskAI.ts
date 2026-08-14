import type { Patient } from "../../types";
export const identifyCardiovascularRisk = (patients: Patient[]) =>
  patients.filter((p) => p.conditions.includes("Cardiovascular") && (p.risk === "High" || p.risk === "Priority Review"));
