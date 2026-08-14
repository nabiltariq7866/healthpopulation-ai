import { create } from "zustand";
import { persist } from "zustand/middleware";
import { patients as seedPatients } from "./data";
import type {
  Audit,
  Campaign,
  CampaignResponse,
  CarePlan,
  DataSource,
  GapStatus,
  NotificationItem,
  Outreach,
  OutreachStatus,
  Patient,
  RiskTier,
  Role,
  SavedCohort,
  Task,
  TaskStatus,
} from "./types";

export type Permission = "analytics" | "cohorts" | "outreach" | "carePlan" | "screening" | "admin";
const permissions: Record<Role, Permission[]> = {
  "Population Health Director": ["analytics", "cohorts", "outreach", "carePlan", "screening"],
  "Care Manager": ["analytics", "outreach", "carePlan"],
  "Primary Care Clinician": ["analytics", "carePlan"],
  "Chronic Disease Nurse": ["analytics", "outreach", "carePlan", "screening"],
  "Preventive Care Coordinator": ["analytics", "outreach", "screening"],
  Analyst: ["analytics", "cohorts"],
  Administrator: ["analytics", "cohorts", "outreach", "carePlan", "screening", "admin"],
};
export const can = (role: Role, permission: Permission) => permissions[role].includes(permission);
export const canEdit = (role: Role) => can(role, "outreach") || can(role, "carePlan") || can(role, "screening");

const actorByRole: Record<Role, string> = {
  "Population Health Director": "Dr. Eleanor Hayes",
  "Care Manager": "Olivia Bennett",
  "Primary Care Clinician": "Dr. Marcus Green",
  "Chronic Disease Nurse": "Sofia Malik",
  "Preventive Care Coordinator": "Ava Patel",
  Analyst: "Daniel Brooks",
  Administrator: "Alex Morgan",
};
const now = () => new Date().toISOString();
const today = () => now().slice(0, 10);
const makeAudit = (role: Role, subject: string, action: string, previous: string, next: string): Audit => ({
  id: crypto.randomUUID(),
  timestamp: now(),
  user: actorByRole[role],
  role,
  subject,
  action,
  previous,
  next,
});
const notify = (title: string, detail: string, type: NotificationItem["type"]): NotificationItem => ({
  id: crypto.randomUUID(),
  title,
  detail,
  type,
  read: false,
  created: now(),
});
const sourceSeed: DataSource[] = [
  { id: "SRC-EHR", name: "EHR", kind: "Clinical record", status: "Demo Connected", lastRefresh: "8 minutes ago", completeness: "99.2%", freshnessMinutes: 8 },
  { id: "SRC-LAB", name: "Laboratory", kind: "Laboratory", status: "Demo Connected", lastRefresh: "12 minutes ago", completeness: "98.7%", freshnessMinutes: 12 },
  { id: "SRC-PHM", name: "Pharmacy", kind: "Medication history", status: "Attention Required", lastRefresh: "22 minutes ago", completeness: "94.1%", freshnessMinutes: 22 },
  { id: "SRC-APT", name: "Appointments", kind: "Scheduling", status: "Demo Connected", lastRefresh: "6 minutes ago", completeness: "99.6%", freshnessMinutes: 6 },
  { id: "SRC-ENC", name: "Encounters", kind: "Utilization", status: "Syncing", lastRefresh: "18 minutes ago", completeness: "97.9%", freshnessMinutes: 18 },
  { id: "SRC-SCR", name: "Screening", kind: "Preventive care", status: "Simulated", lastRefresh: "35 minutes ago", completeness: "96.4%", freshnessMinutes: 35 },
];
const initialCarePlans = (): CarePlan[] => [
  {
    id: "CP-2026-019",
    patientId: "PH-19872",
    name: "Readmission Follow-up Plan",
    owner: "Olivia Bennett",
    startDate: "2026-08-03",
    status: "Active",
    goals: ["Complete post-discharge review", "Resolve medication review gap"],
    monitoring: ["Review new encounters and follow-up completion"],
    screenings: ["Cardiovascular review"],
    followUps: ["Post-discharge appointment"],
    taskIds: [],
  },
  {
    id: "CP-2026-020",
    patientId: "PH-22691",
    name: "Cardiovascular Prevention Plan",
    owner: "Olivia Bennett",
    startDate: "2026-07-30",
    status: "Active",
    goals: ["Complete cardiovascular review"],
    monitoring: ["Track preventive-care gap"],
    screenings: ["Cardiovascular Review"],
    followUps: ["Review screening outcome"],
    taskIds: [],
  },
];
const initial = () => ({
  patients: structuredClone(seedPatients),
  outreach: [] as Outreach[],
  tasks: [] as Task[],
  carePlans: initialCarePlans(),
  campaigns: [
    {
      id: "CAM-2026-008",
      name: "Cardiovascular Screening Recovery",
      cohort: "Cardiovascular Screening Gap",
      channel: "Patient Portal",
      targeted: 500,
      delivered: 0,
      responses: 0,
      scheduled: 0,
      completed: 0,
      noResponse: 0,
      optedOut: 0,
      status: "Draft",
    },
  ] as Campaign[],
  campaignResponses: [] as CampaignResponse[],
  savedCohorts: [
    {
      id: "COH-2026-014",
      name: "High Diabetes Risk — Overdue Review",
      description: "High demo diabetes risk with overdue follow-up and no recent contact",
      owner: "Dr. Eleanor Hayes",
      refreshBehavior: "Dynamic",
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
      refreshBehavior: "Dynamic",
      rules: [{ field: "Cohort", value: "Cardiovascular Screening Gap" }],
      created: "2026-08-08",
    },
  ] as SavedCohort[],
  dataSources: structuredClone(sourceSeed),
  audit: [] as Audit[],
  notifications: [
    notify("High-risk cohort increased", "High Diabetes Risk · 12 min ago", "risk"),
    notify("Outreach follow-up overdue", "Maria Collins · 28 min ago", "outreach"),
    notify("New readmission-risk patient", "Population feed · 1 hr ago", "risk"),
    notify("Campaign response received", "Cardiovascular Recovery · 2 hr ago", "campaign"),
    notify("Some source records are stale", "Pharmacy feed · review freshness", "data"),
  ],
});

type State = ReturnType<typeof initial> & {
  role: Role;
  activePatient?: string;
  setRole: (r: Role) => void;
  setActivePatient: (id?: string) => void;
  markNotificationsRead: () => void;
  updateGap: (patientId: string, gapId: string, status: GapStatus) => void;
  scheduleGap: (patientId: string, gapId: string, date: string) => void;
  overrideGap: (patientId: string, gapId: string, reason: string) => void;
  updateRiskPriority: (patientId: string, risk: RiskTier, reason: string) => void;
  createOutreach: (x: Omit<Outreach, "id" | "created">) => void;
  updateOutreach: (id: string, status: OutreachStatus) => void;
  assignManager: (patientId: string, manager: string) => void;
  createTask: (x: Omit<Task, "id">) => void;
  updateTaskStatus: (id: string, status: TaskStatus) => void;
  completeTask: (id: string) => void;
  createCarePlan: (patientId: string) => void;
  createCampaign: (name: string, cohort: string, targeted: number, channel?: string) => void;
  saveCohort: (cohort: Omit<SavedCohort, "id" | "created">) => void;
  launchCampaign: (id: string) => void;
  simulateCampaign: (id: string) => void;
  closeCampaign: (id: string) => void;
  setDataSourceStatus: (id: string, status: DataSource["status"]) => void;
  refreshDataSources: () => void;
  reset: () => void;
};

const permissionForGap = (role: Role) => can(role, "screening") || can(role, "carePlan");

export const useAppStore = create<State>()(
  persist(
    (set, get) => ({
      ...initial(),
      role: "Population Health Director",
      activePatient: undefined,
      setRole: (role) => set({ role }),
      setActivePatient: (activePatient) => set({ activePatient }),
      markNotificationsRead: () => set((s) => ({ notifications: s.notifications.map((n) => ({ ...n, read: true })) })),
      updateGap: (patientId, gapId, status) =>
        set((s) => {
          if (!permissionForGap(s.role)) return s;
          const p = s.patients.find((x) => x.id === patientId);
          const g = p?.gaps.find((x) => x.id === gapId);
          if (!p || !g || g.status === "Completed" || g.status === status) return s;
          const previous = g.status;
          const nextScreeningStatus = status === "Completed" ? "Completed" : status === "Scheduled" || status === "In Progress" ? "Scheduled" : "Overdue";
          return {
            patients: s.patients.map((x) =>
              x.id !== patientId
                ? x
                : {
                    ...x,
                    gaps: x.gaps.map((y) =>
                      y.id !== gapId
                        ? y
                        : { ...y, status, history: [...y.history, { label: status, date: today() }] },
                    ),
                    screenings: x.screenings.map((scr) =>
                      scr.type === g.type || scr.type.includes(g.condition)
                        ? { ...scr, status: nextScreeningStatus as "Overdue" | "Scheduled" | "Completed", date: status === "Scheduled" || status === "Completed" ? today() : scr.date }
                        : scr,
                    ),
                    appointments:
                      status === "Scheduled"
                        ? [
                            { id: `APT-${crypto.randomUUID().slice(0, 6)}`, type: g.type, date: "2026-08-22", status: "Scheduled" as const, source: "Synthetic Appointment Service" },
                            ...x.appointments.filter((a) => !(a.type === g.type && a.status === "Overdue")),
                          ]
                        : x.appointments,
                    timeline: [{ date: today(), type: "Care gap", detail: `${g.type}: ${status}` }, ...x.timeline],
                  },
            ),
            audit: [makeAudit(s.role, patientId, `Care gap ${g.type}`, previous, status), ...s.audit],
            notifications:
              status === "Completed"
                ? [notify("Care gap closed", `${p.name} · ${g.type}`, "task"), ...s.notifications]
                : s.notifications,
          };
        }),
      scheduleGap: (patientId, gapId, date) =>
        set((s) => {
          if (!permissionForGap(s.role) || !date) return s;
          const patient = s.patients.find((p) => p.id === patientId);
          const gap = patient?.gaps.find((g) => g.id === gapId);
          if (!patient || !gap || gap.status === "Completed" || gap.status === "Scheduled") return s;
          return {
            patients: s.patients.map((p) => p.id !== patientId ? p : {
              ...p,
              gaps: p.gaps.map((g) => g.id !== gapId ? g : { ...g, status: "Scheduled" as const, history: [...g.history, { label: `Scheduled for ${date}`, date: today() }] }),
              screenings: p.screenings.map((scr) => scr.type === gap.type || scr.type.includes(gap.condition) ? { ...scr, status: "Scheduled" as const, date } : scr),
              appointments: [{ id: `APT-${crypto.randomUUID().slice(0, 6)}`, type: gap.type, date, status: "Scheduled" as const, source: "Synthetic Appointment Service" }, ...p.appointments.filter((a) => !(a.type === gap.type && a.status === "Overdue"))],
              timeline: [{ date: today(), type: "Screening", detail: `${gap.type} scheduled for ${date}` }, ...p.timeline],
            }),
            audit: [makeAudit(s.role, patientId, `Screening scheduled: ${gap.type}`, gap.status, date), ...s.audit],
            notifications: [notify("Screening scheduled", `${patient.name} · ${gap.type} · ${date}`, "task"), ...s.notifications],
          };
        }),
      overrideGap: (patientId, gapId, reason) =>
        set((s) => {
          if (!permissionForGap(s.role)) return s;
          const patient = s.patients.find((p) => p.id === patientId);
          const gap = patient?.gaps.find((g) => g.id === gapId);
          if (!patient || !gap || gap.status === "Completed" || !reason.trim()) return s;
          return {
            patients: s.patients.map((p) =>
              p.id !== patientId
                ? p
                : {
                    ...p,
                    gaps: p.gaps.map((g) =>
                      g.id !== gapId
                        ? g
                        : { ...g, status: "Completed" as const, history: [...g.history, { label: `Resolved — External Evidence: ${reason}`, date: today() }] },
                    ),
                    screenings: p.screenings.map((scr) =>
                      scr.type === gap.type || scr.type.includes(gap.condition) ? { ...scr, status: "Completed" as const, date: today() } : scr,
                    ),
                    timeline: [{ date: today(), type: "Human override", detail: `${gap.type}: ${reason}` }, ...p.timeline],
                  },
            ),
            audit: [makeAudit(s.role, patientId, `Care gap override: ${reason}`, gap.status, "Resolved — External Evidence"), ...s.audit],
          };
        }),
      updateRiskPriority: (patientId, risk, reason) =>
        set((s) => {
          if (!can(s.role, "carePlan") || !reason.trim()) return s;
          const p = s.patients.find((x) => x.id === patientId);
          if (!p) return s;
          const previous = p.risk;
          const action = previous === risk ? "Risk priority confirmed" : "Risk priority reviewed";
          return {
            patients: s.patients.map((x) =>
              x.id === patientId
                ? { ...x, risk, riskReview: { original: previous, reviewed: risk, reason, by: actorByRole[s.role], date: today() }, timeline: [{ date: today(), type: "Human review", detail: `${action}: ${previous}${previous === risk ? "" : ` → ${risk}`}: ${reason}` }, ...x.timeline] }
                : x,
            ),
            audit: [makeAudit(s.role, patientId, action, previous, `${risk} — ${reason}`), ...s.audit],
          };
        }),
      createOutreach: (x) =>
        set((s) => {
          if (!can(s.role, "outreach")) return s;
          const patient = s.patients.find((p) => p.id === x.patientId);
          if (!patient) return s;
          const item: Outreach = { ...x, id: `OUT-${String(s.outreach.length + 1).padStart(3, "0")}`, created: today() };
          return {
            outreach: [item, ...s.outreach],
            patients: s.patients.map((p) =>
              p.id !== x.patientId
                ? p
                : { ...p, timeline: [{ date: item.created, type: "Outreach", detail: `${x.channel} outreach planned: ${x.reason}` }, ...p.timeline] },
            ),
            audit: [makeAudit(s.role, x.patientId, "Outreach created", "None", x.status), ...s.audit],
            notifications: [notify("Outreach created", `${patient.name} · follow-up ${x.followUp}`, "outreach"), ...s.notifications],
          };
        }),
      updateOutreach: (id, status) =>
        set((s) => {
          if (!can(s.role, "outreach")) return s;
          const o = s.outreach.find((x) => x.id === id);
          if (!o || o.status === "Completed" || o.status === status) return s;
          const patient = s.patients.find((p) => p.id === o.patientId);
          return {
            outreach: s.outreach.map((x) => (x.id === id ? { ...x, status } : x)),
            patients: s.patients.map((p) =>
              p.id !== o.patientId
                ? p
                : {
                    ...p,
                    lastContact: ["Contacted", "Accepted", "Scheduled", "Completed"].includes(status) ? today() : p.lastContact,
                    timeline: [{ date: today(), type: "Outreach", detail: `${o.reason}: ${status}` }, ...p.timeline],
                    gaps: ["Contacted", "Scheduled"].includes(status)
                      ? p.gaps.map((g) => g.status === "Open" ? { ...g, status: status === "Scheduled" ? "Scheduled" as const : "Contacted" as const, history: [...g.history, { label: status, date: today() }] } : g)
                      : p.gaps,
                  },
            ),
            audit: [makeAudit(s.role, o.patientId, "Outreach status", o.status, status), ...s.audit],
            notifications: status === "Contacted" ? [notify("Patient contacted", `${patient?.name ?? o.patientId} · ${o.reason}`, "outreach"), ...s.notifications] : s.notifications,
          };
        }),
      assignManager: (patientId, manager) =>
        set((s) => {
          if (!can(s.role, "carePlan")) return s;
          const patient = s.patients.find((p) => p.id === patientId);
          if (!patient || patient.manager === manager) return s;
          return {
            patients: s.patients.map((p) => p.id === patientId ? { ...p, manager } : p),
            carePlans: s.carePlans.map((plan) => plan.patientId === patientId ? { ...plan, owner: manager } : plan),
            audit: [makeAudit(s.role, patientId, "Care manager assigned", patient.manager, manager), ...s.audit],
          };
        }),
      createTask: (x) =>
        set((s) => {
          if (!can(s.role, "carePlan")) return s;
          const duplicate = s.tasks.some((t) => t.patientId === x.patientId && t.action === x.action && t.status !== "Completed" && t.status !== "Cancelled");
          if (duplicate || !s.patients.some((p) => p.id === x.patientId)) return s;
          const item: Task = { ...x, id: `TSK-${String(s.tasks.length + 1).padStart(3, "0")}` };
          return {
            tasks: [item, ...s.tasks],
            patients: s.patients.map((p) => p.id === x.patientId ? { ...p, timeline: [{ date: today(), type: "Task", detail: `${x.action}: ${x.status}` }, ...p.timeline] } : p),
            audit: [makeAudit(s.role, x.patientId, "Task created", "None", x.action), ...s.audit],
          };
        }),
      updateTaskStatus: (id, status) =>
        set((s) => {
          if (!can(s.role, "carePlan")) return s;
          const t = s.tasks.find((x) => x.id === id);
          if (!t || t.status === "Completed" || t.status === status) return s;
          return {
            tasks: s.tasks.map((x) => x.id === id ? { ...x, status } : x),
            patients: s.patients.map((p) => p.id === t.patientId ? { ...p, timeline: [{ date: today(), type: "Task", detail: `${t.action}: ${status}` }, ...p.timeline] } : p),
            audit: [makeAudit(s.role, t.patientId, "Task status", t.status, status), ...s.audit],
          };
        }),
      completeTask: (id) => get().updateTaskStatus(id, "Completed"),
      createCarePlan: (patientId) =>
        set((s) => {
          if (!can(s.role, "carePlan")) return s;
          const patient = s.patients.find((p) => p.id === patientId);
          if (!patient || patient.status === "Active Management" || s.carePlans.some((p) => p.patientId === patientId && p.status === "Active")) return s;
          const owner = patient.manager === "Unassigned" ? actorByRole[s.role] : patient.manager;
          const task: Task = { id: `TSK-${String(s.tasks.length + 1).padStart(3, "0")}`, patientId, action: `Book ${patient.conditions[0]} review`, owner, due: "2026-08-22", priority: "High", source: "Care Plan", status: "Open" };
          const plan: CarePlan = {
            id: `CP-2026-${String(s.carePlans.length + 21).padStart(3, "0")}`,
            patientId,
            name: `${patient.conditions[0]} Follow-up Plan`,
            owner,
            startDate: today(),
            status: "Active",
            goals: ["Resolve open follow-up requirements", "Coordinate patient contact"],
            monitoring: ["Review new synthetic encounters and source freshness"],
            screenings: patient.gaps.map((g) => g.type),
            followUps: ["Care-manager review", "Patient contact"],
            taskIds: [task.id],
          };
          return {
            patients: s.patients.map((p) => p.id === patientId ? { ...p, status: "Active Management", manager: p.manager === "Unassigned" ? owner : p.manager, timeline: [{ date: today(), type: "Care plan", detail: `${plan.name} created` }, ...p.timeline] } : p),
            carePlans: [plan, ...s.carePlans],
            tasks: [task, ...s.tasks],
            audit: [makeAudit(s.role, patientId, "Care plan created", "Unmanaged", "Active Management"), ...s.audit],
          };
        }),
      saveCohort: (cohort) =>
        set((s): Partial<State> => {
          if (!can(s.role, "cohorts") || !cohort.name.trim() || !cohort.rules.length) return s;
          return {
            savedCohorts: [{ ...cohort, id: `COH-2026-${String(s.savedCohorts.length + 15).padStart(3, "0")}`, created: today() }, ...s.savedCohorts],
            audit: [makeAudit(s.role, cohort.name, "Cohort created", "None", cohort.refreshBehavior), ...s.audit],
          };
        }),
      createCampaign: (name, cohort, targeted, channel = "Patient Portal") =>
        set((s) => {
          if (!can(s.role, "outreach") || !name.trim() || !cohort.trim() || targeted <= 0) return s;
          return {
            campaigns: [{ id: `CAM-2026-${String(s.campaigns.length + 9).padStart(3, "0")}`, name, cohort, channel, targeted, delivered: 0, responses: 0, scheduled: 0, completed: 0, noResponse: 0, optedOut: 0, status: "Draft" }, ...s.campaigns],
            audit: [makeAudit(s.role, cohort, "Campaign created", "None", name), ...s.audit],
          };
        }),
      launchCampaign: (id) =>
        set((s) => {
          if (!can(s.role, "outreach")) return s;
          const c = s.campaigns.find((x) => x.id === id);
          if (!c || c.targeted === 0 || c.status !== "Draft") return s;
          return {
            campaigns: s.campaigns.map((x) => x.id === id ? { ...x, status: "Active", delivered: x.targeted } : x),
            audit: [makeAudit(s.role, id, "Campaign launched", "Draft", "Active"), ...s.audit],
            notifications: [notify("Campaign launched", `${c.name} · ${c.targeted} synthetic patients`, "campaign"), ...s.notifications],
          };
        }),
      simulateCampaign: (id) =>
        set((s) => {
          if (!can(s.role, "outreach")) return s;
          const c = s.campaigns.find((x) => x.id === id);
          if (!c || c.status !== "Active") return s;
          const responses = Math.round(c.targeted * 0.42);
          const scheduled = Math.round(c.targeted * 0.24);
          const completed = Math.round(c.targeted * 0.08);
          const optedOut = Math.round(c.targeted * 0.06);
          const noResponse = c.targeted - responses;
          const cohortPatients = s.patients.filter((p) => p.cohorts.includes(c.cohort));
          const detailedResponses: CampaignResponse[] = cohortPatients.map((p, index) => ({
            id: crypto.randomUUID(),
            campaignId: id,
            patientId: p.id,
            status: index % 4 === 0 ? "Scheduled" : index % 4 === 1 ? "Already Completed" : index % 4 === 2 ? "Interested" : "Declined",
            date: today(),
          }));
          const aggregateExamples: CampaignResponse[] = ["Interested", "No Response", "Declined"].map((status) => ({ id: crypto.randomUUID(), campaignId: id, status: status as CampaignResponse["status"], date: today() }));
          return {
            campaigns: s.campaigns.map((x) => x.id === id ? { ...x, responses, scheduled, completed, noResponse, optedOut } : x),
            campaignResponses: [...detailedResponses, ...aggregateExamples, ...s.campaignResponses.filter((r) => r.campaignId !== id)],
            patients: s.patients.map((p) => {
              if (!p.cohorts.includes(c.cohort)) return p;
              const response = detailedResponses.find((r) => r.patientId === p.id);
              const newStatus = response?.status === "Already Completed" ? "Completed" : response?.status === "Scheduled" || response?.status === "Interested" ? "Scheduled" : undefined;
              if (!newStatus) return p;
              return {
                ...p,
                gaps: p.gaps.map((g, i) => i === 0 && g.status !== "Completed" ? { ...g, status: newStatus as GapStatus, history: [...g.history, { label: `${newStatus} via campaign`, date: today() }] } : g),
                screenings: p.screenings.map((scr, i) => i === 0 ? { ...scr, status: newStatus === "Completed" ? "Completed" as const : "Scheduled" as const, date: newStatus === "Completed" ? today() : "2026-08-26" } : scr),
                appointments: newStatus === "Scheduled"
                  ? [{ id: `APT-${crypto.randomUUID().slice(0, 6)}`, type: p.gaps[0]?.type ?? "Preventive Review", date: "2026-08-26", status: "Scheduled" as const, source: "Synthetic Campaign Scheduling" }, ...p.appointments]
                  : p.appointments,
                timeline: [{ date: today(), type: "Campaign", detail: `${c.name}: ${response?.status}${newStatus === "Scheduled" ? " · appointment 2026-08-26" : ""}` }, ...p.timeline],
              };
            }),
            audit: [makeAudit(s.role, id, "Campaign responses simulated", "0 responses", `${responses} responses · ${scheduled} scheduled · ${completed} completed`), ...s.audit],
            notifications: [notify("Campaign responses received", `${c.name} · ${responses} responses`, "campaign"), ...s.notifications],
          };
        }),
      closeCampaign: (id) =>
        set((s) => {
          if (!can(s.role, "outreach")) return s;
          const campaign = s.campaigns.find((item) => item.id === id);
          if (!campaign || campaign.status !== "Active") return s;
          return { campaigns: s.campaigns.map((item) => item.id === id ? { ...item, status: "Closed" as const } : item), audit: [makeAudit(s.role, id, "Campaign closed", "Active", "Closed"), ...s.audit] };
        }),
      setDataSourceStatus: (id, status) =>
        set((s) => {
          if (!can(s.role, "admin")) return s;
          const source = s.dataSources.find((x) => x.id === id);
          if (!source || source.status === status) return s;
          return {
            dataSources: s.dataSources.map((x) => x.id === id ? { ...x, status, lastRefresh: status === "Demo Connected" ? "just now" : x.lastRefresh, freshnessMinutes: status === "Demo Connected" ? 0 : x.freshnessMinutes } : x),
            audit: [makeAudit(s.role, id, "Data source status", source.status, status), ...s.audit],
            notifications: status === "Attention Required" ? [notify("Data source requires attention", `${source.name} · review freshness`, "data"), ...s.notifications] : s.notifications,
          };
        }),
      refreshDataSources: () =>
        set((s) => {
          if (!can(s.role, "admin")) return s;
          return {
            dataSources: s.dataSources.map((x) => ({ ...x, status: x.name === "Screening" ? "Simulated" as const : "Demo Connected" as const, lastRefresh: "just now", freshnessMinutes: 0 })),
            audit: [makeAudit(s.role, "All data sources", "Synthetic refresh", "Mixed freshness", "Refreshed"), ...s.audit],
          };
        }),
      reset: () => set({ ...initial(), role: get().role, activePatient: undefined }),
    }),
    {
      name: "healthpopulation-demo-v2",
      partialize: (s) => ({
        patients: s.patients,
        outreach: s.outreach,
        tasks: s.tasks,
        carePlans: s.carePlans,
        campaigns: s.campaigns,
        campaignResponses: s.campaignResponses,
        savedCohorts: s.savedCohorts,
        dataSources: s.dataSources,
        audit: s.audit,
        notifications: s.notifications,
        role: s.role,
      }),
    },
  ),
);
