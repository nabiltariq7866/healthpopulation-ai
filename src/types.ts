export type RiskTier = "Low" | "Moderate" | "High" | "Priority Review";
export type GapStatus =
  | "Open"
  | "Outreach Planned"
  | "Contacted"
  | "Scheduled"
  | "In Progress"
  | "Completed"
  | "Unable to Reach"
  | "Deferred";
export type Role =
  | "Population Health Director"
  | "Care Manager"
  | "Primary Care Clinician"
  | "Chronic Disease Nurse"
  | "Preventive Care Coordinator"
  | "Analyst"
  | "Administrator";
export interface CareGap {
  id: string;
  type: string;
  condition: string;
  due: string;
  status: GapStatus;
  priority: "High" | "Medium" | "Low";
  history: { label: string; date: string }[];
}
export interface Patient {
  id: string;
  name: string;
  age: number;
  conditions: string[];
  risk: RiskTier;
  cohorts: string[];
  manager: string;
  lastEncounter: string;
  lastContact: string;
  medicationRisk: boolean;
  edVisits: number;
  admissions: number;
  status: "Unmanaged" | "Active Management";
  gaps: CareGap[];
  signals: { title: string; evidence: string; source: string; date: string }[];
  timeline: { date: string; type: string; detail: string }[];
}
export interface Outreach {
  id: string;
  patientId: string;
  reason: string;
  channel: string;
  owner: string;
  status: string;
  followUp: string;
  created: string;
}
export interface Task {
  id: string;
  patientId: string;
  action: string;
  owner: string;
  due: string;
  priority: string;
  status: string;
}
export interface Campaign {
  id: string;
  name: string;
  cohort: string;
  targeted: number;
  delivered: number;
  responses: number;
  scheduled: number;
  completed: number;
  noResponse: number;
  status: "Draft" | "Active" | "Closed";
}
export interface Audit {
  id: string;
  timestamp: string;
  user: string;
  role: string;
  subject: string;
  action: string;
  previous: string;
  next: string;
}
export interface SavedCohort {
  id: string;
  name: string;
  description: string;
  owner: string;
  refreshBehavior: "Dynamic" | "Snapshot";
  rules: { field: string; value: string }[];
  created: string;
}
