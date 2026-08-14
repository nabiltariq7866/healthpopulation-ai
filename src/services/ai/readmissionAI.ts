import type { Patient } from "../../types";
export const identifyReadmissionRisk = (patients: Patient[]) => patients.filter((p) => p.cohorts.includes("High Readmission Risk"));
