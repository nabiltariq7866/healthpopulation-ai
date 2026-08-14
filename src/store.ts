import { create } from "zustand";
import { persist } from "zustand/middleware";
import { patients as seedPatients } from "./data";
import type {
  Audit,
  Campaign,
  GapStatus,
  Outreach,
  Patient,
  Role,
  SavedCohort,
  Task,
} from "./types";
type State = {
  patients: Patient[];
  outreach: Outreach[];
  tasks: Task[];
  campaigns: Campaign[];
  savedCohorts: SavedCohort[];
  audit: Audit[];
  role: Role;
  activePatient?: string;
  setRole: (r: Role) => void;
  setActivePatient: (id?: string) => void;
  updateGap: (patientId: string, gapId: string, status: GapStatus) => void;
  createOutreach: (x: Omit<Outreach, "id" | "created">) => void;
  updateOutreach: (id: string, status: string) => void;
  assignManager: (patientId: string, manager: string) => void;
  createTask: (x: Omit<Task, "id">) => void;
  completeTask: (id: string) => void;
  createCarePlan: (patientId: string) => void;
  createCampaign: (name: string, cohort: string, targeted: number) => void;
  saveCohort: (cohort: Omit<SavedCohort, "id" | "created">) => void;
  overrideGap: (patientId: string, gapId: string, reason: string) => void;
  launchCampaign: (id: string) => void;
  simulateCampaign: (id: string) => void;
  closeCampaign: (id: string) => void;
  reset: () => void;
};
const now = () => new Date().toISOString();
const audit = (
  subject: string,
  action: string,
  previous: string,
  next: string,
): Audit => ({
  id: crypto.randomUUID(),
  timestamp: now(),
  user: "Dr. Eleanor Hayes",
  role: "Population Health Director",
  subject,
  action,
  previous,
  next,
});
const initial = () => ({
  patients: structuredClone(seedPatients),
  outreach: [] as Outreach[],
  tasks: [] as Task[],
  campaigns: [
    {
      id: "CAM-2026-008",
      name: "Cardiovascular Screening Recovery",
      cohort: "Cardiovascular Screening Gap",
      targeted: 500,
      delivered: 0,
      responses: 0,
      scheduled: 0,
      completed: 0,
      noResponse: 0,
      status: "Draft" as const,
    },
  ],
  savedCohorts: [
    {
      id: "COH-2026-014",
      name: "High Diabetes Risk — Overdue Review",
      description:
        "High demo diabetes risk with overdue follow-up and no recent contact",
      owner: "Dr. Eleanor Hayes",
      refreshBehavior: "Dynamic" as const,
      rules: [
        { field: "Condition", value: "Diabetes" },
        { field: "Risk", value: "High" },
        { field: "Care gap", value: "Overdue" },
        { field: "Last contact", value: ">30 days" },
      ],
      created: "2026-08-11",
    },
    {
      id: "COH-2026-011",
      name: "Cardiovascular Screening Recovery",
      description: "Overdue cardiovascular review",
      owner: "Ava Patel",
      refreshBehavior: "Dynamic" as const,
      rules: [{ field: "Cohort", value: "Cardiovascular Screening Gap" }],
      created: "2026-08-08",
    },
  ],
  audit: [] as Audit[],
});
export const useAppStore = create<State>()(
  persist(
    (set, get) => ({
      ...initial(),
      role: "Population Health Director",
      setRole: (role) => set({ role }),
      setActivePatient: (activePatient) => set({ activePatient }),
      updateGap: (patientId, gapId, status) =>
        set((s) => {
          const p = s.patients.find((x) => x.id === patientId);
          const g = p?.gaps.find((x) => x.id === gapId);
          if (!p || !g || g.status === "Completed" || g.status === status)
            return s;
          const previous = g.status;
          return {
            patients: s.patients.map((x) =>
              x.id !== patientId
                ? x
                : {
                    ...x,
                    gaps: x.gaps.map((y) =>
                      y.id !== gapId
                        ? y
                        : {
                            ...y,
                            status,
                            history: [
                              ...y.history,
                              { label: status, date: now().slice(0, 10) },
                            ],
                          },
                    ),
                    timeline: [
                      {
                        date: now().slice(0, 10),
                        type: "Care gap",
                        detail: `${g.type}: ${status}`,
                      },
                      ...x.timeline,
                    ],
                  },
            ),
            audit: [
              audit(patientId, `Care gap ${g.type}`, previous, status),
              ...s.audit,
            ],
          };
        }),
      createOutreach: (x) =>
        set((s) => {
          const item = {
            ...x,
            id: `OUT-${String(s.outreach.length + 1).padStart(3, "0")}`,
            created: now().slice(0, 10),
          };
          return {
            outreach: [item, ...s.outreach],
            patients: s.patients.map((p) =>
              p.id !== x.patientId
                ? p
                : {
                    ...p,
                    timeline: [
                      {
                        date: item.created,
                        type: "Outreach",
                        detail: `${x.channel} outreach planned: ${x.reason}`,
                      },
                      ...p.timeline,
                    ],
                  },
            ),
            audit: [
              audit(x.patientId, "Outreach created", "None", x.status),
              ...s.audit,
            ],
          };
        }),
      updateOutreach: (id, status) =>
        set((s) => {
          const o = s.outreach.find((x) => x.id === id);
          if (!o || o.status === "Completed") return s;
          return {
            outreach: s.outreach.map((x) =>
              x.id === id ? { ...x, status } : x,
            ),
            patients: s.patients.map((p) =>
              p.id !== o.patientId
                ? p
                : {
                    ...p,
                    lastContact:
                      status === "Contacted"
                        ? now().slice(0, 10)
                        : p.lastContact,
                  },
            ),
            audit: [
              audit(o.patientId, "Outreach status", o.status, status),
              ...s.audit,
            ],
          };
        }),
      assignManager: (patientId, manager) =>
        set((s) => ({
          patients: s.patients.map((p) =>
            p.id === patientId ? { ...p, manager } : p,
          ),
          audit: [
            audit(
              patientId,
              "Care manager assigned",
              s.patients.find((p) => p.id === patientId)?.manager || "",
              manager,
            ),
            ...s.audit,
          ],
        })),
      createTask: (x) =>
        set((s) => {
          const item = {
            ...x,
            id: `TSK-${String(s.tasks.length + 1).padStart(3, "0")}`,
          };
          return {
            tasks: [item, ...s.tasks],
            audit: [
              audit(x.patientId, "Task created", "None", x.action),
              ...s.audit,
            ],
          };
        }),
      completeTask: (id) =>
        set((s) => {
          const t = s.tasks.find((x) => x.id === id);
          if (!t || t.status === "Completed") return s;
          return {
            tasks: s.tasks.map((x) =>
              x.id === id ? { ...x, status: "Completed" } : x,
            ),
            audit: [
              audit(t.patientId, "Task status", t.status, "Completed"),
              ...s.audit,
            ],
          };
        }),
      createCarePlan: (patientId) =>
        set((s) => {
          const patient = s.patients.find((p) => p.id === patientId);
          if (!patient || patient.status === "Active Management") return s;
          return {
            patients: s.patients.map((p) =>
              p.id === patientId ? { ...p, status: "Active Management" } : p,
            ),
            audit: [
              audit(
                patientId,
                "Care plan created",
                "Unmanaged",
                "Active Management",
              ),
              ...s.audit,
            ],
          };
        }),
      saveCohort: (cohort) =>
        set((s) => ({
          savedCohorts: [
            {
              ...cohort,
              id: `COH-2026-${String(s.savedCohorts.length + 15).padStart(3, "0")}`,
              created: now().slice(0, 10),
            },
            ...s.savedCohorts,
          ],
          audit: [
            audit(
              cohort.name,
              "Cohort created",
              "None",
              cohort.refreshBehavior,
            ),
            ...s.audit,
          ],
        })),
      overrideGap: (patientId, gapId, reason) =>
        set((s) => {
          const patient = s.patients.find((p) => p.id === patientId);
          const gap = patient?.gaps.find((g) => g.id === gapId);
          if (!patient || !gap || gap.status === "Completed" || !reason.trim())
            return s;
          return {
            patients: s.patients.map((p) =>
              p.id !== patientId
                ? p
                : {
                    ...p,
                    gaps: p.gaps.map((g) =>
                      g.id !== gapId
                        ? g
                        : {
                            ...g,
                            status: "Completed" as const,
                            history: [
                              ...g.history,
                              {
                                label: `Resolved — External Evidence: ${reason}`,
                                date: now().slice(0, 10),
                              },
                            ],
                          },
                    ),
                    timeline: [
                      {
                        date: now().slice(0, 10),
                        type: "Human override",
                        detail: `${gap.type}: ${reason}`,
                      },
                      ...p.timeline,
                    ],
                  },
            ),
            audit: [
              audit(
                patientId,
                `Care gap override: ${reason}`,
                gap.status,
                "Resolved — External Evidence",
              ),
              ...s.audit,
            ],
          };
        }),
      createCampaign: (name, cohort, targeted) =>
        set((s) => {
          if (!name.trim() || !cohort.trim() || targeted <= 0) return s;
          return {
            campaigns: [
              {
                id: `CAM-2026-${String(s.campaigns.length + 9).padStart(3, "0")}`,
                name,
                cohort,
                targeted,
                delivered: 0,
                responses: 0,
                scheduled: 0,
                completed: 0,
                noResponse: 0,
                status: "Draft",
              },
              ...s.campaigns,
            ],
            audit: [
              audit(cohort, "Campaign created", "None", name),
              ...s.audit,
            ],
          };
        }),
      launchCampaign: (id) =>
        set((s) => {
          const c = s.campaigns.find((x) => x.id === id);
          if (!c || c.targeted === 0 || c.status !== "Draft") return s;
          return {
            campaigns: s.campaigns.map((x) =>
              x.id === id
                ? { ...x, status: "Active", delivered: x.targeted }
                : x,
            ),
            audit: [
              audit(id, "Campaign launched", "Draft", "Active"),
              ...s.audit,
            ],
          };
        }),
      simulateCampaign: (id) =>
        set((s) => {
          const c = s.campaigns.find((x) => x.id === id);
          if (!c || c.status !== "Active") return s;
          const responses = Math.round(c.targeted * 0.42),
            scheduled = Math.round(c.targeted * 0.24),
            completed = Math.round(c.targeted * 0.08);
          return {
            campaigns: s.campaigns.map((x) =>
              x.id === id
                ? {
                    ...x,
                    responses,
                    scheduled,
                    completed,
                    noResponse: x.targeted - responses,
                  }
                : x,
            ),
            patients: s.patients.map((p) =>
              p.cohorts.includes(c.cohort) && p.gaps[0]?.status === "Open"
                ? {
                    ...p,
                    gaps: p.gaps.map((g, i) =>
                      i === 0
                        ? {
                            ...g,
                            status: "Scheduled" as const,
                            history: [
                              ...g.history,
                              {
                                label: "Scheduled via campaign",
                                date: now().slice(0, 10),
                              },
                            ],
                          }
                        : g,
                    ),
                  }
                : p,
            ),
            audit: [
              audit(
                id,
                "Campaign responses simulated",
                "0 responses",
                `${responses} responses`,
              ),
              ...s.audit,
            ],
          };
        }),
      closeCampaign: (id) =>
        set((s) => {
          const campaign = s.campaigns.find((item) => item.id === id);
          if (!campaign || campaign.status !== "Active") return s;
          return {
            campaigns: s.campaigns.map((item) =>
              item.id === id ? { ...item, status: "Closed" as const } : item,
            ),
            audit: [
              audit(id, "Campaign closed", "Active", "Closed"),
              ...s.audit,
            ],
          };
        }),
      reset: () =>
        set({ ...initial(), role: get().role, activePatient: undefined }),
    }),
    {
      name: "healthpopulation-demo-v1",
      partialize: (s) => ({
        patients: s.patients,
        outreach: s.outreach,
        tasks: s.tasks,
        campaigns: s.campaigns,
        savedCohorts: s.savedCohorts,
        audit: s.audit,
        role: s.role,
      }),
    },
  ),
);
export type Permission =
  "analytics" | "cohorts" | "outreach" | "carePlan" | "screening" | "admin";
const permissions: Record<Role, Permission[]> = {
  "Population Health Director": [
    "analytics",
    "cohorts",
    "outreach",
    "carePlan",
    "screening",
  ],
  "Care Manager": ["analytics", "outreach", "carePlan"],
  "Primary Care Clinician": ["analytics", "carePlan"],
  "Chronic Disease Nurse": ["analytics", "outreach", "carePlan", "screening"],
  "Preventive Care Coordinator": ["analytics", "outreach", "screening"],
  Analyst: ["analytics", "cohorts"],
  Administrator: [
    "analytics",
    "cohorts",
    "outreach",
    "carePlan",
    "screening",
    "admin",
  ],
};
export const can = (role: Role, permission: Permission) =>
  permissions[role].includes(permission);
export const canEdit = (role: Role) =>
  can(role, "outreach") || can(role, "carePlan") || can(role, "screening");
