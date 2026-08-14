import { beforeEach, describe, expect, it } from "vitest";
import { patients } from "../../data";
import {
  buildCohort,
  detectCareGaps,
  explainPatientRisk,
  identifyDiabetesRisk,
  identifyHighUtilization,
  identifyReadmissionRisk,
  validateCohortRules,
} from "./populationAI";
import { can, useAppStore } from "../../store";
describe("deterministic population intelligence", () => {
  it("builds diabetes outreach cohort from transparent rules", () =>
    expect(
      buildCohort(patients, {
        condition: "Diabetes",
        risk: "High",
        openGap: true,
        noContactDays: 30,
      }).map((p) => p.name),
    ).toContain("Maria Collins"));
  it("finds expected risk cohorts", () => {
    expect(identifyDiabetesRisk(patients).length).toBeGreaterThan(0);
    expect(identifyReadmissionRisk(patients).map((p) => p.name)).toContain(
      "James Turner",
    );
    expect(identifyHighUtilization(patients).map((p) => p.name)).toContain(
      "Daniel Moore",
    );
  });
  it("returns traceable explanations", () =>
    expect(explainPatientRisk(patients[0])[0]).toMatchObject({
      source: "Laboratory Record",
      requiresHumanReview: true,
    }));
  it("detects only open gaps", () =>
    expect(detectCareGaps(patients).every((x) => x.gap.status === "Open")).toBe(
      true,
    ));
  it("rejects invalid cohort rules with an actionable error", () => {
    expect(validateCohortRules({})).toMatchObject({ valid: false });
    expect(validateCohortRules({ noContactDays: -1 }).error).toContain(
      "negative",
    );
    expect(validateCohortRules({ risk: "Extreme" }).error).toContain("Unknown");
    expect(validateCohortRules({ risk: "High" })).toEqual({ valid: true });
  });
});
describe("connected workflow regression", () => {
  beforeEach(() => useAppStore.getState().reset());
  it("completed gap leaves open-gap view and cannot complete twice", () => {
    const s = useAppStore.getState();
    s.updateGap("PH-20418", "G-101", "Completed");
    expect(
      detectCareGaps(useAppStore.getState().patients).some(
        (x) => x.gap.id === "G-101",
      ),
    ).toBe(false);
    const audits = useAppStore.getState().audit.length;
    s.updateGap("PH-20418", "G-101", "Completed");
    expect(useAppStore.getState().audit).toHaveLength(audits);
  });
  it("persists manager assignment across patient state", () => {
    useAppStore.getState().assignManager("PH-20418", "Olivia Bennett");
    expect(
      useAppStore.getState().patients.find((p) => p.id === "PH-20418")?.manager,
    ).toBe("Olivia Bennett");
  });
  it("does not create duplicate scheduled-state events", () => {
    useAppStore.getState().updateGap("PH-20418", "G-101", "Scheduled");
    const audits = useAppStore.getState().audit.length;
    useAppStore.getState().updateGap("PH-20418", "G-101", "Scheduled");
    expect(useAppStore.getState().audit).toHaveLength(audits);
  });
  it("creates and completes a task once", () => {
    useAppStore.getState().createTask({
      patientId: "PH-20418",
      action: "Book review",
      owner: "Olivia Bennett",
      due: "2026-08-18",
      priority: "High",
      status: "Open",
    });
    const id = useAppStore.getState().tasks[0].id;
    useAppStore.getState().completeTask(id);
    expect(useAppStore.getState().tasks[0].status).toBe("Completed");
    const n = useAppStore.getState().audit.length;
    useAppStore.getState().completeTask(id);
    expect(useAppStore.getState().audit).toHaveLength(n);
  });
  it("launches and simulates campaign deterministically", () => {
    const id = useAppStore.getState().campaigns[0].id;
    useAppStore.getState().launchCampaign(id);
    useAppStore.getState().simulateCampaign(id);
    const c = useAppStore.getState().campaigns[0];
    expect(c).toMatchObject({
      status: "Active",
      delivered: 500,
      responses: 210,
      scheduled: 120,
      completed: 40,
    });
  });
  it("rejects zero-audience campaigns and prevents closed campaign relaunch", () => {
    const before = useAppStore.getState().campaigns.length;
    useAppStore.getState().createCampaign("Empty", "Cohort", 0);
    expect(useAppStore.getState().campaigns).toHaveLength(before);
    const id = useAppStore.getState().campaigns[0].id;
    useAppStore.getState().launchCampaign(id);
    useAppStore.getState().closeCampaign(id);
    const audits = useAppStore.getState().audit.length;
    useAppStore.getState().launchCampaign(id);
    expect(useAppStore.getState().campaigns[0].status).toBe("Closed");
    expect(useAppStore.getState().audit).toHaveLength(audits);
  });
  it("connects outreach across queue, patient timeline and audit", () => {
    useAppStore
      .getState()
      .createOutreach({
        patientId: "PH-20418",
        reason: "Diabetes Review",
        channel: "Phone",
        owner: "Olivia Bennett",
        status: "Planned",
        followUp: "2026-08-18",
      });
    const outreach = useAppStore.getState().outreach[0];
    expect(outreach).toMatchObject({
      patientId: "PH-20418",
      status: "Planned",
    });
    expect(useAppStore.getState().patients[0].timeline[0].type).toBe(
      "Outreach",
    );
    useAppStore.getState().updateOutreach(outreach.id, "Contacted");
    expect(useAppStore.getState().outreach[0].status).toBe("Contacted");
    expect(
      useAppStore
        .getState()
        .audit.some((entry) => entry.action === "Outreach status"),
    ).toBe(true);
  });
  it("moves screening from open to scheduled to completed with history", () => {
    useAppStore.getState().updateGap("PH-22146", "G-105", "Scheduled");
    useAppStore.getState().updateGap("PH-22146", "G-105", "Completed");
    const gap = useAppStore
      .getState()
      .patients.find((p) => p.id === "PH-22146")!.gaps[0];
    expect(gap.status).toBe("Completed");
    expect(gap.history.map((event) => event.label)).toEqual(
      expect.arrayContaining(["Scheduled", "Completed"]),
    );
  });
  it("reset restores deterministic seed", () => {
    useAppStore.getState().createCarePlan("PH-20418");
    useAppStore.getState().reset();
    expect(
      useAppStore.getState().patients.find((p) => p.id === "PH-20418")?.status,
    ).toBe("Unmanaged");
    expect(useAppStore.getState().audit).toHaveLength(0);
  });
  it("persists structured saved cohort rules", () => {
    useAppStore.getState().saveCohort({
      name: "Diabetes outreach priority",
      description: "Transparent rules",
      owner: "Dr. Eleanor Hayes",
      refreshBehavior: "Dynamic",
      rules: [{ field: "Condition", value: "Diabetes" }],
    });
    expect(useAppStore.getState().savedCohorts[0]).toMatchObject({
      name: "Diabetes outreach priority",
      refreshBehavior: "Dynamic",
      rules: [{ field: "Condition", value: "Diabetes" }],
    });
  });
  it("human override requires a reason, resolves the gap, and creates audit evidence", () => {
    const before = useAppStore.getState().audit.length;
    useAppStore.getState().overrideGap("PH-20418", "G-101", "");
    expect(useAppStore.getState().audit).toHaveLength(before);
    useAppStore
      .getState()
      .overrideGap(
        "PH-20418",
        "G-101",
        "Completed externally — document reviewed",
      );
    const patient = useAppStore
      .getState()
      .patients.find((p) => p.id === "PH-20418")!;
    expect(patient.gaps[0].status).toBe("Completed");
    expect(patient.gaps[0].history.at(-1)?.label).toContain(
      "External Evidence",
    );
    expect(useAppStore.getState().audit[0].action).toContain("override");
  });
  it("does not create a duplicate care plan", () => {
    useAppStore.getState().createCarePlan("PH-20418");
    const audits = useAppStore.getState().audit.length;
    useAppStore.getState().createCarePlan("PH-20418");
    expect(useAppStore.getState().audit).toHaveLength(audits);
    expect(useAppStore.getState().audit[0]).toMatchObject({
      action: "Care plan created",
      previous: "Unmanaged",
      next: "Active Management",
    });
  });
  it("enforces the role permission matrix", () => {
    expect(can("Analyst", "analytics")).toBe(true);
    expect(can("Analyst", "outreach")).toBe(false);
    expect(can("Preventive Care Coordinator", "screening")).toBe(true);
    expect(can("Preventive Care Coordinator", "carePlan")).toBe(false);
    expect(can("Administrator", "admin")).toBe(true);
    const exact = {
      "Population Health Director": [true, true, true, true, true, false],
      "Care Manager": [true, false, true, true, false, false],
      "Primary Care Clinician": [true, false, false, true, false, false],
      "Chronic Disease Nurse": [true, false, true, true, true, false],
      "Preventive Care Coordinator": [true, false, true, false, true, false],
      Analyst: [true, true, false, false, false, false],
      Administrator: [true, true, true, true, true, true],
    } as const;
    const permissions = [
      "analytics",
      "cohorts",
      "outreach",
      "carePlan",
      "screening",
      "admin",
    ] as const;
    Object.entries(exact).forEach(([role, expected]) =>
      expect(
        permissions.map((permission) =>
          can(role as keyof typeof exact, permission),
        ),
      ).toEqual(expected),
    );
  });
});
