import type { Patient } from "../../types";
export const identifyHighUtilization = (patients: Patient[]) => patients.filter((p) => p.edVisits >= 3 || p.admissions >= 2);
