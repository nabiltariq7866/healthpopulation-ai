import type { CareGap, Patient, RiskTier } from "../../types";
import type { ReactNode } from "react";

type Tone = "blue" | "green" | "gold" | "rose" | "violet";
const SemanticBadge = ({
  children,
  tone = "blue",
}: {
  children: ReactNode;
  tone?: Tone;
}) => <span className={`badge ${tone}`}>{children}</span>;

export function PopulationMetricCard({
  label,
  value,
  context,
  tone = "blue",
  onOpen,
}: {
  label: string;
  value: string;
  context: string;
  tone?: Tone;
  onOpen?: () => void;
}) {
  return (
    <button className={`stat ${onOpen ? "clickable" : ""}`} onClick={onOpen}>
      <span className={`stat-icon ${tone}`} aria-hidden="true" />
      <span className="stat-label">{label}</span>
      <b>{value}</b>
      <small>{context}</small>
    </button>
  );
}
export function CohortCard({
  id,
  name,
  population,
  owner,
  onOpen,
}: {
  id: string;
  name: string;
  population: number;
  owner: string;
  onOpen?: () => void;
}) {
  return (
    <button className="saved-cohort" onClick={onOpen}>
      <span aria-hidden="true">◎</span>
      <div>
        <b>{name}</b>
        <small>
          {id} · {population.toLocaleString()} patients · {owner}
        </small>
      </div>
    </button>
  );
}
export function RiskTierBadge({ risk }: { risk: RiskTier }) {
  return (
    <SemanticBadge
      tone={
        risk === "High" || risk === "Priority Review"
          ? "rose"
          : risk === "Low"
            ? "green"
            : "blue"
      }
    >
      {risk}
    </SemanticBadge>
  );
}
export function CareGapBadge({ status }: { status: CareGap["status"] }) {
  return (
    <SemanticBadge
      tone={
        status === "Completed"
          ? "green"
          : status === "Scheduled" || status === "In Progress"
            ? "blue"
            : "gold"
      }
    >
      {status}
    </SemanticBadge>
  );
}
export function PopulationInsightCard({
  title,
  affected,
  action,
}: {
  title: string;
  affected: number;
  action: string;
}) {
  return (
    <section className="card ai-card">
      <small>AI POPULATION INSIGHT</small>
      <h2>{title}</h2>
      <p>
        <b>{affected.toLocaleString()} affected patients.</b>
      </p>
      <div className="recommend">
        <small>RECOMMENDED OPERATIONAL ACTION</small>
        <p>{action}</p>
      </div>
      <footer>Not a clinical diagnosis. Human review required.</footer>
    </section>
  );
}
export function RiskExplanationPanel({ patient }: { patient: Patient }) {
  return (
    <div className="signals">
      {patient.signals.map((signal) => (
        <div key={signal.title}>
          <div>
            <b>{signal.title}</b>
            <p>{signal.evidence}</p>
            <small>
              {signal.source} · {signal.date}
            </small>
          </div>
        </div>
      ))}
    </div>
  );
}
export function PatientCohortList({ cohorts }: { cohorts: string[] }) {
  return (
    <ul aria-label="Patient cohorts">
      {cohorts.map((cohort) => (
        <li key={cohort}>{cohort}</li>
      ))}
    </ul>
  );
}
export function CareGapTimeline({ gap }: { gap: CareGap }) {
  return (
    <div className="timeline">
      {gap.history.map((event, index) => (
        <div key={`${event.date}-${index}`}>
          <i />
          <time>{event.date}</time>
          <span>
            <b>{event.label}</b>
          </span>
        </div>
      ))}
    </div>
  );
}
export function OutreachStatus({ status }: { status: string }) {
  return (
    <SemanticBadge
      tone={
        status === "Completed" || status === "Contacted"
          ? "green"
          : status === "No Response"
            ? "gold"
            : "blue"
      }
    >
      {status}
    </SemanticBadge>
  );
}
export function CampaignPerformance({
  targeted,
  delivered,
  responses,
  scheduled,
}: {
  targeted: number;
  delivered: number;
  responses: number;
  scheduled: number;
}) {
  return (
    <div className="campaign-metrics">
      <span>
        <b>{targeted}</b>Targeted
      </span>
      <span>
        <b>{delivered}</b>Delivered
      </span>
      <span>
        <b>{responses}</b>Responses
      </span>
      <span>
        <b>{scheduled}</b>Scheduled
      </span>
    </div>
  );
}
export function CohortBuilderRule({
  index,
  field,
  value,
  options,
  onChange,
}: {
  index: number;
  field: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="rule">
      <span>{index}</span>
      <label>
        {field}
        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
        >
          {options.map((option) => (
            <option key={option}>{option}</option>
          ))}
        </select>
      </label>
      <SemanticBadge>{index === 1 ? "WHERE" : "AND"}</SemanticBadge>
    </div>
  );
}
export function SourceEvidenceDrawer({
  open,
  title,
  evidence,
  onClose,
}: {
  open: boolean;
  title: string;
  evidence: Patient["signals"];
  onClose: () => void;
}) {
  if (!open) return null;
  return (
    <aside className="modal" role="dialog" aria-modal="true" aria-label={title}>
      <button className="modal-x" onClick={onClose} aria-label="Close evidence">
        ×
      </button>
      <h2>{title}</h2>
      {evidence.map((item) => (
        <div className="gap" key={item.title}>
          <div>
            <b>{item.title}</b>
            <small>
              {item.source} · {item.date}
            </small>
          </div>
        </div>
      ))}
    </aside>
  );
}
export function CareManagerCard({
  name,
  role,
  assigned,
}: {
  name: string;
  role: string;
  assigned: number;
}) {
  return (
    <section className="card">
      <h2>{name}</h2>
      <p>{role}</p>
      <b>{assigned} assigned patients</b>
    </section>
  );
}
