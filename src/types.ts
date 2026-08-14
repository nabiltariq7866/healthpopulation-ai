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
export type TaskStatus = "Open" | "Assigned" | "In Progress" | "Completed" | "Overdue" | "Cancelled";
export type OutreachStatus = "Planned" | "Sent" | "Contacted" | "No Response" | "Accepted" | "Declined" | "Scheduled" | "Completed";

export interface CareGap {
  id: string;
  type: string;
  condition: string;
  due: string;
  status: GapStatus;
  priority: "High" | "Medium" | "Low";
  history: { label: string; date: string }[];
}
export interface MedicationRecord {
  id: string;
  name: string;
  schedule: string;
  lastRefill: string;
  refillIndicator: "Current" | "Potential Gap" | "Review Required";
  reportedAdherence: "Reported taken" | "Requires confirmation" | "Potential concern";
  source: string;
}
export interface ScreeningRecord {
  id: string;
  type: string;
  date: string;
  status: "Overdue" | "Scheduled" | "Completed";
  source: string;
}
export interface EncounterRecord {
  id: string;
  date: string;
  type: "Primary Care" | "Emergency" | "Admission" | "Discharge" | "Specialist";
  facility: string;
  source: string;
}
export interface LabRecord {
  id: string;
  test: string;
  result: string;
  date: string;
  source: string;
  trend: "Stable" | "Rising" | "Falling" | "Review";
}
export interface AppointmentRecord {
  id: string;
  type: string;
  date: string;
  status: "Scheduled" | "Completed" | "Missed" | "Overdue";
  source: string;
}
export interface Patient {
  id: string;
  name: string;
  age: number;
  conditions: string[];
  risk: RiskTier;
  riskReview?: {
    original: RiskTier;
    reviewed: RiskTier;
    reason: string;
    by: string;
    date: string;
  };
  cohorts: string[];
  manager: string;
  lastEncounter: string;
  lastContact: string;
  medicationRisk: boolean;
  edVisits: number;
  admissions: number;
  status: "Unmanaged" | "Active Management";
  gaps: CareGap[];
  medications: MedicationRecord[];
  screenings: ScreeningRecord[];
  encounters: EncounterRecord[];
  labs: LabRecord[];
  appointments: AppointmentRecord[];
  signals: { title: string; evidence: string; source: string; date: string }[];
  timeline: { date: string; type: string; detail: string }[];
}
export interface Outreach {
  id: string;
  patientId: string;
  reason: string;
  channel: string;
  owner: string;
  status: OutreachStatus;
  followUp: string;
  created: string;
}
export interface Task {
  id: string;
  patientId: string;
  action: string;
  owner: string;
  due: string;
  priority: "High" | "Medium" | "Low";
  source: string;
  status: TaskStatus;
}
export interface CarePlan {
  id: string;
  patientId: string;
  name: string;
  owner: string;
  startDate: string;
  status: "Active" | "Completed";
  goals: string[];
  monitoring: string[];
  screenings: string[];
  followUps: string[];
  taskIds: string[];
}
export interface CampaignResponse {
  id: string;
  campaignId: string;
  patientId?: string;
  status: "Interested" | "No Response" | "Declined" | "Already Completed" | "Scheduled";
  date: string;
}
export interface Campaign {
  id: string;
  name: string;
  cohort: string;
  channel: string;
  targeted: number;
  delivered: number;
  responses: number;
  scheduled: number;
  completed: number;
  noResponse: number;
  optedOut: number;
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
export interface DataSource {
  id: string;
  name: string;
  kind: string;
  status: "Demo Connected" | "Simulated" | "Syncing" | "Attention Required";
  lastRefresh: string;
  completeness: string;
  freshnessMinutes: number;
}
export interface NotificationItem {
  id: string;
  title: string;
  detail: string;
  type: "risk" | "outreach" | "campaign" | "task" | "data";
  read: boolean;
  created: string;
}
