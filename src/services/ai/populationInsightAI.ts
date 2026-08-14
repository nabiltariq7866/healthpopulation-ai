import type { Patient } from "../../types";
export const generatePopulationInsight = (patients: Patient[]) => {
  const diabetes = patients.filter((p) => p.conditions.includes("Diabetes") && p.risk === "High" && p.gaps.some((g) => g.status !== "Completed"));
  return {
    title: "High diabetes-risk patients with unresolved follow-up",
    affectedDetailedPatients: diabetes.length,
    evidence: ["Synthetic laboratory signals", "Appointment history", "Medication history"],
    action: "Prioritize combined risk-and-gap cohort for care-team review.",
    disclaimer: "AI-generated population-management insight. Not a clinical diagnosis.",
  };
};
