import type { Patient } from "../../types";
export const detectCareGaps = (patients: Patient[]) => patients.flatMap((patient) => patient.gaps.filter((gap) => gap.status !== "Completed").map((gap) => ({ patient, gap })));
