import type { Patient } from "../../types";
export const detectAdherenceConcern = (patients: Patient[]) =>
  patients
    .filter((p) => p.medicationRisk)
    .map((patient) => ({
      patient,
      label: "Potential adherence concern",
      requiresReview: true,
    }));
