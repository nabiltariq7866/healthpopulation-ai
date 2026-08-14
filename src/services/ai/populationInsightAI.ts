export const generatePopulationInsight = (
  affected: number,
  cohort: string,
) => ({
  title: `${cohort} operational opportunity`,
  affected,
  recommendation:
    "Review this population segment with the responsible care team.",
  disclaimer:
    "AI-generated population-management insight. Not a clinical diagnosis.",
});
