import { useEffect, useMemo, useRef, useState } from "react";
import {
  NavLink,
  Route,
  Routes,
  useNavigate,
  useParams,
} from "react-router-dom";
import {
  Activity,
  AlertTriangle,
  BarChart3,
  Bell,
  Brain,
  BriefcaseMedical,
  Building2,
  CalendarCheck,
  ChevronRight,
  ClipboardCheck,
  Database,
  HeartPulse,
  LayoutDashboard,
  Menu,
  MessageSquareMore,
  MoreHorizontal,
  Plus,
  RefreshCw,
  Search,
  Settings,
  ShieldCheck,
  Stethoscope,
  Users,
  UserRound,
  Waypoints,
  X,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { toast } from "sonner";
import { aggregate, trend } from "./data";
import { can, canEdit, useAppStore } from "./store";
import type { GapStatus, OutreachStatus, Patient, RiskTier, Role, TaskStatus } from "./types";
import {
  CampaignPerformance,
  CareGapBadge,
  RiskTierBadge,
  SourceEvidenceDrawer,
} from "./components/product/ProductComponents";
import { CustomSelect } from "./components/ui/CustomSelect";
const fmt = (n: number) => n.toLocaleString("en-GB");
function useDialogFocus(close: () => void) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    const previous = document.activeElement as HTMLElement | null;
    const focusable = () =>
      Array.from(
        dialog.querySelectorAll<HTMLElement>(
          'button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
        ),
      );
    focusable()[0]?.focus();
    const handle = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) return;
      const first = items[0],
        last = items[items.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", handle);
    return () => {
      document.removeEventListener("keydown", handle);
      previous?.focus();
    };
  }, [close]);
  return ref;
}
const groups = [
  [
    "POPULATION",
    [
      ["Population Overview", "/", LayoutDashboard],
      ["Patient Registry", "/patients", Users],
    ],
  ],
  [
    "RISK & COHORTS",
    [
      ["Risk Stratification", "/risk", BarChart3],
      ["Cohorts", "/cohorts", Waypoints],
      ["Care Gaps", "/care-gaps", AlertTriangle],
      ["High Utilization", "/utilization", Activity],
      ["Medication Adherence", "/adherence", ClipboardCheck],
    ],
  ],
  [
    "CHRONIC CONDITIONS",
    [
      ["Diabetes", "/diabetes", Stethoscope],
      ["Cardiovascular", "/cardiovascular", HeartPulse],
      ["Hypertension", "/hypertension", Activity],
      ["Readmission", "/readmission", Building2],
    ],
  ],
  [
    "CARE MANAGEMENT",
    [
      ["Outreach", "/outreach", MessageSquareMore],
      ["Care Management", "/care-management", Users],
      ["Care Plans", "/care-plans", BriefcaseMedical],
      ["Follow-up Tasks", "/tasks", ClipboardCheck],
      ["Screening", "/screening", CalendarCheck],
    ],
  ],
  [
    "INTELLIGENCE",
    [
      ["AI Insights", "/insights", Brain],
      ["Population Trends", "/trends", BarChart3],
      ["Outcome Analytics", "/outcomes", Activity],
    ],
  ],
  [
    "SYSTEM",
    [
      ["Data Sources", "/data-sources", Database],
      ["Integrations", "/integrations", Waypoints],
      ["Audit Trail", "/audit", ShieldCheck],
      ["Settings", "/settings", Settings],
    ],
  ],
] as const;
const roleUsers: Record<Role, string> = {
  "Population Health Director": "Dr. Eleanor Hayes",
  "Care Manager": "Olivia Bennett",
  "Primary Care Clinician": "Dr. Marcus Green",
  "Chronic Disease Nurse": "Sofia Malik",
  "Preventive Care Coordinator": "Ava Patel",
  Analyst: "Daniel Brooks",
  Administrator: "Alex Morgan",
};
function Shell() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [organization, setOrganization] = useState("Northshire Integrated Care Network");
  const [role, setRole] = [
    useAppStore((s) => s.role),
    useAppStore((s) => s.setRole),
  ];
  const nav = useNavigate();
  const patients = useAppStore((s) => s.patients);
  const savedCohorts = useAppStore((s) => s.savedCohorts);
  const campaigns = useAppStore((s) => s.campaigns);
  const notifications = useAppStore((s) => s.notifications);
  const markNotificationsRead = useAppStore((s) => s.markNotificationsRead);
  const query = search.trim().toLowerCase();
  const results = query.length > 1
    ? [
        ...patients
          .filter((p) => `${p.name} ${p.id} ${p.conditions.join(" ")} ${p.cohorts.join(" ")} ${p.manager}`.toLowerCase().includes(query))
          .slice(0, 5)
          .map((p) => ({ id: p.id, title: p.name, detail: `${p.id} · ${p.conditions.join(", ")}`, route: `/patients/${p.id}`, group: "Patient" })),
        ...savedCohorts
          .filter((c) => `${c.name} ${c.description} ${c.owner}`.toLowerCase().includes(query))
          .slice(0, 3)
          .map((c) => ({ id: c.id, title: c.name, detail: `${c.id} · ${c.owner}`, route: "/cohorts", group: "Cohort" })),
        ...campaigns
          .filter((c) => `${c.name} ${c.cohort}`.toLowerCase().includes(query))
          .slice(0, 3)
          .map((c) => ({ id: c.id, title: c.name, detail: `${c.id} · ${c.status}`, route: "/outreach", group: "Campaign" })),
      ].slice(0, 8)
    : [];
  return (
    <div className="app">
      <aside className={open ? "sidebar open" : "sidebar"}>
        <div className="brand">
          <span className="brandmark">
            <HeartPulse size={20} />
          </span>
          <div>
            <b>HealthPopulation</b>
            <span>AI</span>
            <small>Population Intelligence</small>
          </div>
          <button className="mobile-close" onClick={() => setOpen(false)}>
            <X />
          </button>
        </div>
        <nav>
          {groups.map(([title, items]) => (
            <section key={title}>
              <label>{title}</label>
              {items.map(([name, path, Icon]) => (
                <NavLink
                  key={path}
                  to={path}
                  end={path === "/"}
                  onClick={() => setOpen(false)}
                >
                  <Icon size={17} />
                  <span>{name}</span>
                </NavLink>
              ))}
            </section>
          ))}
        </nav>
        <div className="sidebar-foot">
          <ShieldCheck size={16} />
          <div>
            <b>Demo environment</b>
            <small>Synthetic data only</small>
          </div>
        </div>
      </aside>
      <main>
        <header className="topbar">
          <button className="menu" onClick={() => setOpen(true)}>
            <Menu />
          </button>
          <div className="org">
            <Building2 size={17} />
            <CustomSelect
              ariaLabel="Organization selector"
              value={organization}
              onChange={setOrganization}
              options={["Northshire Integrated Care Network", "Westhaven Community Health Demo", "Central County Population Program"]}
              className="organization-select"
            />
          </div>
          <div className="global-search">
            <Search size={17} />
            <input
              aria-label="Global patient search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patients, cohorts, campaigns…"
            />
            {results.length > 0 && (
              <div className="search-results" role="listbox" aria-label="Global search results">
                {results.map((result) => (
                  <button key={`${result.group}-${result.id}`} onClick={() => { nav(result.route); setSearch(""); }}>
                    <small>{result.group}</small>
                    <b>{result.title}</b>
                    <span>{result.detail}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          <span className="period">Reporting: Q3 2026</span>
          <button
            className="icon-btn"
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
            onClick={() => { setNotificationsOpen((value) => !value); markNotificationsRead(); }}
          >
            <Bell size={19} />
            <i />
          </button>
          {notificationsOpen && (
            <div
              className="notifications"
              role="region"
              aria-label="Notifications panel"
            >
              <div className="card-head">
                <div>
                  <h2>Notifications</h2>
                  <p>Operational demo alerts</p>
                </div>
                <Badge tone="rose">{notifications.filter((item) => !item.read).length} new</Badge>
              </div>
              {notifications.slice(0, 8).map((item) => (
                <button key={item.id} onClick={() => setNotificationsOpen(false)}>
                  <b>{item.title}</b>
                  <span>{item.detail}</span>
                </button>
              ))}
            </div>
          )}
          <CustomSelect
            ariaLabel="Current role"
            value={role}
            onChange={(value) => setRole(value as Role)}
            options={[
              "Population Health Director",
              "Care Manager",
              "Primary Care Clinician",
              "Chronic Disease Nurse",
              "Preventive Care Coordinator",
              "Analyst",
              "Administrator",
            ]}
            className="role-select"
          />
          <div className="current-user"><b>{roleUsers[role]}</b><small>{role}</small></div>
          <div className="avatar">{roleUsers[role].split(" ").filter((part) => !part.endsWith(".")).slice(-2).map((part) => part[0]).join("")}</div>
        </header>
        <div className="content">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/patients" element={<Registry />} />
            <Route path="/patients/:id" element={<PatientDetail />} />
            <Route path="/risk" element={<RiskPage />} />
            <Route path="/cohorts" element={<Cohorts />} />
            <Route path="/care-gaps" element={<CareGaps />} />
            <Route
              path="/utilization"
              element={<ConditionPage type="utilization" />}
            />
            <Route path="/adherence" element={<Adherence />} />
            <Route
              path="/diabetes"
              element={<ConditionPage type="diabetes" />}
            />
            <Route
              path="/cardiovascular"
              element={<ConditionPage type="cardiovascular" />}
            />
            <Route
              path="/hypertension"
              element={<ConditionPage type="hypertension" />}
            />
            <Route
              path="/readmission"
              element={<ConditionPage type="readmission" />}
            />
            <Route path="/outreach" element={<Outreach />} />
            <Route path="/care-management" element={<CareManagement />} />
            <Route path="/care-plans" element={<CarePlans />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/screening" element={<Screening />} />
            <Route path="/insights" element={<Insights />} />
            <Route path="/trends" element={<Trends />} />
            <Route path="/outcomes" element={<Outcomes />} />
            <Route path="/data-sources" element={<DataSources />} />
            <Route path="/integrations" element={<Integrations />} />
            <Route path="/audit" element={<Audit />} />
            <Route path="/settings" element={<SettingsPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </div>
      </main>
    </div>
  );
}
const PageHead = ({
  title,
  sub,
  action,
}: {
  title: string;
  sub: string;
  action?: any;
}) => (
  <div className="page-head">
    <div>
      <span className="eyebrow">Population intelligence</span>
      <h1>{title}</h1>
      <p>{sub}</p>
    </div>
    {action}
  </div>
);
const Badge = ({
  children,
  tone = "blue",
}: {
  children: any;
  tone?: string;
}) => <span className={`badge ${tone}`}>{children}</span>;
const Stat = ({
  label,
  value,
  trend: delta,
  icon: Icon = Activity,
  tone = "blue",
  onClick,
}: {
  label: string;
  value: string;
  trend?: string;
  icon?: any;
  tone?: string;
  onClick?: () => void;
}) => {
  const content = (
    <>
      <span className={`stat-icon ${tone}`}>
        <Icon size={19} />
      </span>
      <span className="stat-label">
        {label}
        <MoreHorizontal size={17} />
      </span>
      <b>{value}</b>
      <small>{delta || "Current reporting period"}</small>
      {onClick && <ChevronRight className="stat-arrow" size={17} />}
    </>
  );
  return onClick ? (
    <button className="stat clickable" onClick={onClick}>
      {content}
    </button>
  ) : (
    <div className="stat">{content}</div>
  );
};
function NotFoundPage() {
  const nav = useNavigate();
  return (
    <>
      <PageHead
        title="Page not found"
        sub="This demo route does not exist or is no longer available."
      />
      <section className="card empty-state-card">
        <h2>Unable to open this view</h2>
        <p>Return to the Population Health Overview and continue the connected synthetic demo workflow.</p>
        <button className="primary" onClick={() => nav("/")}>Return to Population Overview</button>
      </section>
    </>
  );
}

function Overview() {
  const nav = useNavigate();
  const ps = useAppStore((s) => s.patients);
  const outreach = useAppStore((s) => s.outreach);
  const open = ps
    .flatMap((p) => p.gaps)
    .filter((g) => g.status === "Open").length;
  const screeningDelta = ps.filter((p) => p.cohorts.includes("Cardiovascular Screening Gap")).flatMap((p) => p.gaps).filter((g) => g.status === "Scheduled" || g.status === "In Progress" || g.status === "Completed").length;
  return (
    <>
      <PageHead
        title="Population Health Overview"
        sub="Proactive visibility across chronic-disease risk, preventive-care gaps, utilization and care-management activity."
        action={
          <button
            className="secondary"
            onClick={() =>
              toast.success("Population view refreshed from synthetic sources")
            }
          >
            <RefreshCw size={16} /> Refreshed 8 min ago
          </button>
        }
      />
      <div className="stats-grid">
        <Stat
          label="Total population"
          value="128,420"
          trend="+1.2% year on year"
          icon={Users}
        />
        <Stat
          label="High diabetes risk"
          value={fmt(aggregate.diabetes)}
          trend="3.3% of population · +4.2%"
          tone="rose"
          onClick={() => nav("/diabetes")}
        />
        <Stat
          label="Open care gaps"
          value={fmt(9184 - (8 - open))}
          trend="↓ 6.8% this quarter"
          tone="gold"
          onClick={() => nav("/care-gaps")}
        />
        <Stat
          label="Screenings overdue"
          value={fmt(aggregate.cardioScreening - screeningDelta)}
          trend="4.7% of population"
          tone="gold"
          onClick={() => nav("/cardiovascular")}
        />
        <Stat
          label="Readmission risk"
          value="1,203"
          trend="0.9% · requires review"
          tone="rose"
          onClick={() => nav("/readmission")}
        />
        <Stat
          label="Adherence concern"
          value="2,417"
          trend="Potential concern · review"
          tone="violet"
        />
        <Stat
          label="Uncontrolled hypertension"
          value="3,842"
          trend="Demo BP signals"
          tone="rose"
          onClick={() => nav("/hypertension")}
        />
        <Stat
          label="Active outreach"
          value={fmt(186 + outreach.length)}
          trend="72% contact rate"
          tone="green"
          onClick={() => nav("/outreach")}
        />
      </div>
      <div className="grid two">
        <section className="card">
          <div className="card-head">
            <div>
              <h2>Population risk distribution</h2>
              <p>Risk tiers across the attributed population</p>
            </div>
            <Badge>AI-assisted</Badge>
          </div>
          <div className="risk-strip">
            <i style={{ width: "64%" }} />
            <i style={{ width: "25%" }} />
            <i style={{ width: "8%" }} />
            <i style={{ width: "3%" }} />
          </div>
          <div className="legend">
            <span>
              <i className="low" />
              Low <b>82,346</b>
            </span>
            <span>
              <i className="moderate" />
              Moderate <b>32,094</b>
            </span>
            <span>
              <i className="high" />
              High <b>10,274</b>
            </span>
            <span>
              <i className="priority" />
              Priority Review <b>3,706</b>
            </span>
          </div>
          <div className="chart">
            <ResponsiveContainer width="100%" height={210}>
              <AreaChart data={trend}>
                <defs>
                  <linearGradient id="fill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#635BB5" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#635BB5" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="month" />
                <YAxis hide />
                <Tooltip />
                <Area
                  dataKey="gaps"
                  stroke="#635BB5"
                  fill="url(#fill)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>
        <InsightCard />
      </div>
      <DiseaseOverview />
    </>
  );
}
function InsightCard() {
  const maria = useAppStore((s) => s.patients.find((p) => p.name === "Maria Collins"));
  const affected = aggregate.diabetesOverdue - (maria?.gaps.some((g) => g.status === "Open") ? 0 : 1);
  return (
    <section className="card ai-card">
      <div className="ai-title"><span><Brain size={19} /></span><div><small>AI POPULATION INSIGHT</small><h2>Combined risk and follow-up opportunity</h2></div></div>
      <p><b>{fmt(affected)} patients</b> in the High Diabetes Risk demo cohort also have an overdue follow-up requirement.</p>
      <div className="recommend"><small>RECOMMENDED OPERATIONAL ACTION</small><p>Prioritize patients with both high-risk status and unresolved follow-up gaps for care-team review.</p></div>
      <div className="evidence"><span>Laboratory records</span><span>Appointment history</span><span>Pharmacy history</span></div>
      <NavLink className="text-link" to="/diabetes">Review cohort <ChevronRight size={15} /></NavLink>
      <footer><ShieldCheck size={15} /> AI-generated population-management insight. Not a clinical diagnosis.</footer>
    </section>
  );
}
function DiseaseOverview() {
  const items = [
    ["Diabetes", "18,742", "4,281", "1,108", "64%"],
    ["Hypertension", "31,604", "3,842", "2,216", "58%"],
    ["Cardiovascular", "22,318", "2,906", "6,019", "71%"],
    ["COPD", "7,462", "936", "384", "76%"],
  ];
  return (
    <section className="card disease">
      <div className="card-head">
        <div>
          <h2>Chronic disease overview</h2>
          <p>Population size, risk signals and active care gaps</p>
        </div>
        <NavLink className="text-link" to="/risk">
          View stratification <ChevronRight size={15} />
        </NavLink>
      </div>
      <div className="disease-grid">
        {items.map((x) => (
          <div key={x[0]}>
            <div className="disease-top">
              <span className="condition-icon">
                <HeartPulse size={17} />
              </span>
              <b>{x[0]}</b>
              <span>{x[1]} patients</span>
            </div>
            <dl>
              <div>
                <dt>High risk</dt>
                <dd>{x[2]}</dd>
              </div>
              <div>
                <dt>Care gaps</dt>
                <dd>{x[3]}</dd>
              </div>
              <div>
                <dt>Active management</dt>
                <dd>{x[4]}</dd>
              </div>
            </dl>
          </div>
        ))}
      </div>
    </section>
  );
}
function Registry({ filter }: { filter?: (p: Patient) => boolean }) {
  const ps = useAppStore((s) => s.patients);
  const nav = useNavigate();
  const [q, setQ] = useState("");
  const [risk, setRisk] = useState("All");
  const [condition, setCondition] = useState("All");
  const [gap, setGap] = useState("All");
  const [adherence, setAdherence] = useState("All");
  const [utilization, setUtilization] = useState("All");
  const [manager, setManager] = useState("All");
  const [age, setAge] = useState("All");
  const [contact, setContact] = useState("All");
  const [readmission, setReadmission] = useState("All");
  const rows = ps
    .filter(filter || (() => true))
    .filter((p) => {
      const searchText = `${p.name} ${p.id} ${p.conditions.join(" ")} ${p.manager} ${p.cohorts.join(" ")}`.toLowerCase();
      const contactDays =
        (new Date("2026-08-14").getTime() - new Date(p.lastContact).getTime()) / 864e5;
      return (
        searchText.includes(q.toLowerCase()) &&
        (risk === "All" || p.risk === risk) &&
        (condition === "All" || p.conditions.includes(condition)) &&
        (gap === "All" ||
          (gap === "Open"
            ? p.gaps.some((g) => g.status !== "Completed")
            : p.gaps.every((g) => g.status === "Completed"))) &&
        (adherence === "All" || (adherence === "Concern") === p.medicationRisk) &&
        (utilization === "All" ||
          (utilization === "High"
            ? p.edVisits >= 3 || p.admissions >= 2
            : p.edVisits < 3 && p.admissions < 2)) &&
        (manager === "All" ||
          (manager === "Unassigned" ? p.manager === "Unassigned" : p.manager === manager)) &&
        (age === "All" || (age === "65+" ? p.age >= 65 : p.age < 65)) &&
        (contact === "All" || contactDays > 30) &&
        (readmission === "All" || p.cohorts.includes("High Readmission Risk"))
      );
    });
  return (
    <>
      <PageHead
        title="Patient Registry"
        sub="Representative synthetic patients across population cohorts and care-management workflows."
        action={<Badge tone="green">{rows.length} detailed records</Badge>}
      />
      <section className="card table-card">
        <div className="toolbar registry-toolbar">
          <div className="input">
            <Search size={16} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, ID, condition, cohort or manager"
              aria-label="Search patient registry"
            />
          </div>
          <CustomSelect ariaLabel="Filter by risk" value={risk} onChange={setRisk} options={["All", "Low", "Moderate", "High", "Priority Review"]} />
          <CustomSelect ariaLabel="Filter by condition" value={condition} onChange={setCondition} options={["All", "Diabetes", "Cardiovascular", "Hypertension", "COPD"]} />
          <CustomSelect ariaLabel="Filter by care gap" value={gap} onChange={setGap} options={["All", "Open", "Resolved"]} />
          <CustomSelect ariaLabel="Filter by medication adherence" value={adherence} onChange={setAdherence} options={["All", "Concern", "No concern"]} />
          <CustomSelect ariaLabel="Filter by utilization" value={utilization} onChange={setUtilization} options={["All", "High", "Standard"]} />
          <CustomSelect ariaLabel="Filter by care manager" value={manager} onChange={setManager} options={["All", "Unassigned", "Olivia Bennett", "Sofia Malik", "Noah Williams"]} />
          <CustomSelect ariaLabel="Filter by age" value={age} onChange={setAge} options={["All", "Under 65", "65+"]} />
          <CustomSelect ariaLabel="Filter by last contact" value={contact} onChange={setContact} options={["All", "Over 30 days"]} />
          <CustomSelect ariaLabel="Filter by readmission risk" value={readmission} onChange={setReadmission} options={["All", "High readmission risk"]} />
        </div>
        <PatientTable rows={rows} onOpen={(p) => nav(`/patients/${p.id}`)} />
      </section>
    </>
  );
}
function PatientTable({
  rows,
  onOpen,
}: {
  rows: Patient[];
  onOpen: (p: Patient) => void;
}) {
  const [selected, setSelected] = useState<string[]>([]);
  const assignManager = useAppStore((s) => s.assignManager);
  const createTask = useAppStore((s) => s.createTask);
  const createCampaign = useAppStore((s) => s.createCampaign);
  const role = useAppStore((s) => s.role);
  const [sort, setSort] = useState<"name" | "risk">("name");
  const [page, setPage] = useState(1);
  const pageSize = 5;
  const ranked = { Low: 0, Moderate: 1, High: 2, "Priority Review": 3 };
  const sortedRows = [...rows].sort((a, b) =>
    sort === "name"
      ? a.name.localeCompare(b.name)
      : ranked[b.risk] - ranked[a.risk],
  );
  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const visibleRows = sortedRows.slice((page - 1) * pageSize, page * pageSize);
  const allSelected =
    visibleRows.length > 0 && visibleRows.every((p) => selected.includes(p.id));
  const toggleAll = () =>
    setSelected(
      allSelected
        ? selected.filter((id) => !visibleRows.some((p) => p.id === id))
        : [...new Set([...selected, ...visibleRows.map((p) => p.id)])],
    );
  const toggle = (id: string) =>
    setSelected((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    );
  return (
    <div className="table-wrap">
      {selected.length > 0 && (
        <div className="bulk-bar">
          <b>{selected.length} selected</b>
          <button
            className="secondary"
            disabled={!can(role, "outreach")}
            onClick={() => {
              createCampaign(
                `Registry outreach — ${selected.length} patients`,
                "Selected Registry Patients",
                selected.length,
              );
              toast.success("Selected patients added to campaign draft");
              setSelected([]);
            }}
          >
            Add to outreach campaign
          </button>
          <button
            className="secondary"
            disabled={!can(role, "carePlan")}
            onClick={() => {
              selected.forEach((id) => assignManager(id, "Olivia Bennett"));
              toast.success("Care manager assigned to selected patients");
              setSelected([]);
            }}
          >
            Assign care manager
          </button>
          <button
            className="secondary"
            disabled={!can(role, "carePlan")}
            onClick={() => {
              selected.forEach((id) =>
                createTask({
                  patientId: id,
                  action: "Population follow-up review",
                  owner: "Olivia Bennett",
                  due: "2026-08-18",
                  priority: "High",
                  source: "Bulk follow-up queue",
                  status: "Open",
                }),
              );
              toast.success("Follow-up queue created");
              setSelected([]);
            }}
          >
            Create follow-up queue
          </button>
          <button
            className="secondary"
            onClick={() => {
              const selectedPatients = rows.filter((patient) => selected.includes(patient.id));
              const csv = [
                ["Patient ID", "Name", "Conditions", "Risk", "Care Manager", "Status"],
                ...selectedPatients.map((patient) => [patient.id, patient.name, patient.conditions.join(" | "), patient.risk, patient.manager, patient.status]),
              ].map((line) => line.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
              const url = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
              const a = document.createElement("a");
              a.href = url; a.download = "healthpopulation-demo-list.csv"; a.click(); URL.revokeObjectURL(url);
              toast.success("Selected demo list exported");
            }}
          >
            Export demo list
          </button>
        </div>
      )}
      <table>
        <thead>
          <tr>
            <th>
              <input
                aria-label="Select all visible patients"
                type="checkbox"
                checked={allSelected}
                onChange={toggleAll}
              />
            </th>
            <th>
              <button className="sort-button" onClick={() => setSort("name")}>
                Patient {sort === "name" ? "↑" : ""}
              </button>
            </th>
            <th>Age</th>
            <th>Primary conditions</th>
            <th>
              <button className="sort-button" onClick={() => setSort("risk")}>
                Current risk {sort === "risk" ? "↓" : ""}
              </button>
            </th>
            <th>Care gaps</th>
            <th>Last encounter</th>
            <th>Medication risk</th>
            <th>Utilization</th>
            <th>Care manager</th>
            <th>Status</th>
            <th />
          </tr>
        </thead>
        <tbody>
          {visibleRows.map((p) => (
            <tr key={p.id}>
              <td>
                <input
                  aria-label={`Select ${p.name}`}
                  type="checkbox"
                  checked={selected.includes(p.id)}
                  onChange={() => toggle(p.id)}
                />
              </td>
              <td>
                <button className="patient-link" onClick={() => onOpen(p)}>
                  <span>
                    {p.name
                      .split(" ")
                      .map((x) => x[0])
                      .join("")}
                  </span>
                  <b>
                    {p.name}
                    <small>
                      {p.id} · Age {p.age}
                    </small>
                  </b>
                </button>
              </td>
              <td>{p.age}</td>
              <td>{p.conditions.join(", ")}</td>
              <td><RiskTierBadge risk={p.risk} /></td>
              <td><b>{p.gaps.filter((g) => g.status !== "Completed").length}</b> unresolved</td>
              <td>{p.lastEncounter}</td>
              <td>{p.medicationRisk ? <Badge tone="gold">Potential concern</Badge> : <Badge tone="green">No current concern</Badge>}</td>
              <td>{p.edVisits} ED · {p.admissions} adm.</td>
              <td>{p.manager}</td>
              <td>
                <Badge
                  tone={p.status === "Active Management" ? "green" : "gold"}
                >
                  {p.status}
                </Badge>
              </td>
              <td>
                <button
                  className="icon-btn"
                  onClick={() => onOpen(p)}
                  aria-label={`Open ${p.name}`}
                >
                  <ChevronRight size={17} />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length > pageSize && (
        <div className="pagination">
          <span>
            Page {page} of {totalPages}
          </span>
          <button
            className="secondary"
            disabled={page === 1}
            onClick={() => setPage((value) => value - 1)}
          >
            Previous
          </button>
          <button
            className="secondary"
            disabled={page === totalPages}
            onClick={() => setPage((value) => value + 1)}
          >
            Next
          </button>
        </div>
      )}
      {!rows.length && (
        <div className="empty">
          <Search />
          <h3>No patients match this view</h3>
          <p>Adjust search or filters to broaden the cohort.</p>
        </div>
      )}
    </div>
  );
}
function PatientDetail() {
  const { id } = useParams();
  const p = useAppStore((s) => s.patients.find((x) => x.id === id));
  const assign = useAppStore((s) => s.assignManager);
  const plan = useAppStore((s) => s.createCarePlan);
  const role = useAppStore((s) => s.role);
  const [tab, setTab] = useState("Overview");
  const [modal, setModal] = useState(false);
  const [evidenceOpen, setEvidenceOpen] = useState(false);
  const [scheduleTarget, setScheduleTarget] = useState<{ id: string; title: string } | null>(null);
  const [managerChoice, setManagerChoice] = useState("Olivia Bennett");
  if (!p)
    return (
      <div className="empty">
        <AlertTriangle />
        <h2>Patient record unavailable</h2>
        <p>The synthetic record may have been reset.</p>
      </div>
    );
  return (
    <>
      <div className="patient-head">
        <div className="patient-avatar">{p.name.split(" ").map((x) => x[0]).join("")}</div>
        <div>
          <span className="eyebrow">{p.id} · Synthetic patient</span>
          <h1>{p.name}</h1>
          <p>Age {p.age} · {p.conditions.join(" · ")}</p>
        </div>
        <div className="patient-status">
          <RiskTierBadge risk={p.risk} />
          <span>Care manager <b>{p.manager}</b></span>
        </div>
        <div className="inline-action">
          <CustomSelect ariaLabel="Assign care manager" value={managerChoice} onChange={setManagerChoice} options={["Olivia Bennett", "Sofia Malik", "Noah Williams"]} disabled={!can(role, "carePlan")} />
          <button className="secondary" disabled={!can(role, "carePlan") || p.manager === managerChoice} onClick={() => { assign(p.id, managerChoice); toast.success("Care manager assigned"); }}>Assign manager</button>
        </div>
        <button className="primary" disabled={!can(role, "outreach")} onClick={() => setModal(true)}><Plus size={16} /> Create outreach</button>
      </div>
      <div className="tabs" aria-label="Patient record sections">
        {["Overview", "Risk Profile", "Conditions", "Care Gaps", "Medications", "Screenings", "Utilization", "Outreach", "Care Plan", "Timeline"].map((x) => (
          <button className={tab === x ? "active" : ""} onClick={() => setTab(x)} key={x}>{x}</button>
        ))}
      </div>
      {tab === "Overview" || tab === "Risk Profile" ? (
        <div className="grid patient-grid">
          <section className="card span2">
            <div className="card-head">
              <div><h2>{tab === "Risk Profile" ? "Explainable risk profile" : "AI population summary"}</h2><p>Grounded only in current synthetic patient state.</p></div>
              <Badge tone="violet">Requires care-team review</Badge>
            </div>
            <p>
              {p.name} is part of the <b>{p.cohorts.join(" and ")}</b> cohort{p.cohorts.length > 1 ? "s" : ""}. {p.gaps.filter((g) => g.status !== "Completed").length} unresolved care gap(s), {p.edVisits} emergency encounter(s), and {p.medicationRisk ? "a potential medication-adherence concern" : "no current medication-adherence concern"} are visible in the demo record.
            </p>
            <div className="signals">
              {p.signals.map((signal) => (
                <div key={signal.title}>
                  <span className="signal-icon"><Brain size={16} /></span>
                  <div>
                    <b>{signal.title}</b>
                    <p>{signal.evidence}</p>
                    <small><Database size={13} />{signal.source} · {signal.date}</small>
                  </div>
                </div>
              ))}
            </div>
            <button className="secondary" onClick={() => setEvidenceOpen(true)}><Database size={15} /> View source evidence</button>
            {p.riskReview && <div className="notice compact"><ShieldCheck /><div><b>Human review preserved</b><p>{p.riskReview.original} → {p.riskReview.reviewed}: {p.riskReview.reason} · {p.riskReview.by}</p></div></div>}
            <footer className="disclaimer"><ShieldCheck size={15} /> Demo risk model. Not validated for clinical use. Human review required.</footer>
          </section>
          <section className="card">
            <h2>Current care gaps</h2>
            {p.gaps.map((g) => (
              <div className="gap" key={g.id}>
                <div><b>{g.type}</b><small>{g.condition} · Due {g.due}</small></div>
                <CareGapBadge status={g.status} />
                {g.status === "Open" && <button className="text-link" disabled={!can(role, "screening") && !can(role, "carePlan")} onClick={() => setScheduleTarget({ id: g.id, title: g.type })}>Schedule</button>}
              </div>
            ))}
          </section>
          <section className="card">
            <h2>Care-management status</h2>
            <div className="status-block"><span><UserRound /></span><div><small>Assigned manager</small><b>{p.manager}</b></div></div>
            <div className="status-block"><span><BriefcaseMedical /></span><div><small>Management status</small><b>{p.status}</b></div></div>
            {p.status === "Unmanaged" && <button className="primary full" disabled={!can(role, "carePlan")} onClick={() => { plan(p.id); toast.success("Active management plan created"); }}>Create care plan</button>}
          </section>
        </div>
      ) : <DetailTab p={p} tab={tab} />}
      {modal && <OutreachModal patient={p} close={() => setModal(false)} />}
      {scheduleTarget && <ScheduleGapModal patient={p} gapId={scheduleTarget.id} title={scheduleTarget.title} close={() => setScheduleTarget(null)} />}
      <SourceEvidenceDrawer open={evidenceOpen} title={`${p.name} — source evidence`} evidence={p.signals} onClose={() => setEvidenceOpen(false)} />
    </>
  );
}
function DetailTab({ p, tab }: { p: Patient; tab: string }) {
  // Select stable store collections first. Returning a freshly filtered array
  // directly from a Zustand selector can cause useSyncExternalStore to see a
  // new snapshot on every render (React 19 / Zustand 5), leading to a maximum
  // update-depth loop. Filter locally with useMemo instead.
  const outreachItems = useAppStore((s) => s.outreach);
  const carePlanItems = useAppStore((s) => s.carePlans);
  const taskItems = useAppStore((s) => s.tasks);
  const outreach = useMemo(
    () => outreachItems.filter((item) => item.patientId === p.id),
    [outreachItems, p.id],
  );
  const plans = useMemo(
    () => carePlanItems.filter((item) => item.patientId === p.id),
    [carePlanItems, p.id],
  );
  const tasks = useMemo(
    () => taskItems.filter((item) => item.patientId === p.id),
    [taskItems, p.id],
  );
  if (tab === "Conditions") return <RecordSection title="Conditions" sub="Current synthetic problem-list context">{p.conditions.map((item) => <div className="record-row" key={item}><b>{item}</b><span>Source: Synthetic EHR</span></div>)}</RecordSection>;
  if (tab === "Care Gaps") return <RecordSection title="Care Gaps" sub="Detection, outreach, scheduling and completion history">{p.gaps.map((g) => <div className="record-row" key={g.id}><div><b>{g.type}</b><small>{g.condition} · Due {g.due}</small></div><CareGapBadge status={g.status} /><small>{g.history.map((h) => `${h.date}: ${h.label}`).join(" · ")}</small></div>)}</RecordSection>;
  if (tab === "Medications") return <RecordSection title="Medications" sub="Potential adherence signals remain separate from clinical conclusions">{p.medications.map((m) => <div className="record-row" key={m.id}><div><b>{m.name}</b><small>{m.schedule}</small></div><Badge tone={m.refillIndicator === "Potential Gap" ? "gold" : "green"}>{m.refillIndicator}</Badge><small>Last refill {m.lastRefill} · {m.reportedAdherence} · {m.source}</small></div>)}</RecordSection>;
  if (tab === "Screenings") return <RecordSection title="Screenings" sub="Preventive-care history and scheduled review state">{p.screenings.map((scr) => <div className="record-row" key={scr.id}><div><b>{scr.type}</b><small>{scr.source}</small></div><Badge tone={scr.status === "Completed" ? "green" : scr.status === "Scheduled" ? "blue" : "gold"}>{scr.status}</Badge><span>{scr.date}</span></div>)}</RecordSection>;
  if (tab === "Utilization") return <RecordSection title="Utilization" sub={`${p.edVisits} ED visits · ${p.admissions} admissions in the synthetic review window`}>{p.encounters.map((enc) => <div className="record-row" key={enc.id}><div><b>{enc.type}</b><small>{enc.facility} · {enc.source}</small></div><span>{enc.date}</span></div>)}</RecordSection>;
  if (tab === "Outreach") return <RecordSection title="Outreach" sub="Patient-level communication and follow-up history">{outreach.length ? outreach.map((item) => <div className="record-row" key={item.id}><div><b>{item.reason}</b><small>{item.channel} · {item.owner} · Follow-up {item.followUp}</small></div><Badge>{item.status}</Badge><span>{item.created}</span></div>) : <EmptyInline text="No outreach activity has been created for this patient." />}</RecordSection>;
  if (tab === "Care Plan") return <RecordSection title="Care Plan" sub="Human-owned goals, tasks, monitoring and follow-up">{plans.length ? plans.map((plan) => <div className="care-plan-detail" key={plan.id}><div className="card-head"><div><b>{plan.name}</b><small>{plan.id} · Owner {plan.owner} · Started {plan.startDate}</small></div><Badge tone="green">{plan.status}</Badge></div><p><b>Goals:</b> {plan.goals.join(" · ")}</p><p><b>Monitoring:</b> {plan.monitoring.join(" · ")}</p><p><b>Screening:</b> {plan.screenings.join(" · ") || "None configured"}</p><p><b>Follow-ups:</b> {plan.followUps.join(" · ")}</p><p><b>Tasks:</b> {tasks.filter((task) => plan.taskIds.includes(task.id)).map((task) => `${task.action} (${task.status})`).join(" · ") || "No linked tasks"}</p></div>) : <EmptyInline text="No active care plan. A care manager or clinician can create one from Overview." />}</RecordSection>;
  return <RecordSection title="Timeline" sub="Connected synthetic source and care-management events">{p.timeline.map((event, index) => <div className="timeline-row" key={`${event.date}-${index}`}><time>{event.date}</time><div><b>{event.type}</b><p>{event.detail}</p></div></div>)}</RecordSection>;
}
function RecordSection({ title, sub, children }: { title: string; sub: string; children: any }) {
  return <section className="card"><div className="card-head"><div><h2>{title}</h2><p>{sub}</p></div></div><div className="record-list">{children}</div></section>;
}
function EmptyInline({ text }: { text: string }) { return <div className="empty inline-empty"><ClipboardCheck /><h3>Nothing to show</h3><p>{text}</p></div>; }
function ReasonModal({ title, description, confirmLabel, close, onConfirm }: { title: string; description: string; confirmLabel: string; close: () => void; onConfirm: (reason: string) => void }) {
  const [reason, setReason] = useState("");
  const ref = useDialogFocus(close);
  return <div className="overlay" onMouseDown={(event) => event.target === event.currentTarget && close()}><div ref={ref} className="modal" role="dialog" aria-modal="true" aria-labelledby="reason-modal-title"><button className="modal-x" onClick={close} aria-label="Close review dialog"><X /></button><span className="modal-icon"><ShieldCheck /></span><h2 id="reason-modal-title">{title}</h2><p>{description}</p><label>Human-review reason<textarea value={reason} onChange={(event) => setReason(event.target.value)} placeholder="Enter a clear reason for the human decision" /></label><div className="modal-actions"><button className="secondary" onClick={close}>Cancel</button><button className="primary" disabled={!reason.trim()} onClick={() => { onConfirm(reason.trim()); close(); }}>{confirmLabel}</button></div></div></div>;
}
function ConfirmationModal({ title, description, confirmLabel, close, onConfirm }: { title: string; description: string; confirmLabel: string; close: () => void; onConfirm: () => void }) {
  const ref = useDialogFocus(close);
  return <div className="overlay" onMouseDown={(event) => event.target === event.currentTarget && close()}><div ref={ref} className="modal" role="dialog" aria-modal="true" aria-labelledby="confirm-modal-title"><button className="modal-x" onClick={close} aria-label="Close confirmation"><X /></button><span className="modal-icon"><AlertTriangle /></span><h2 id="confirm-modal-title">{title}</h2><p>{description}</p><div className="modal-actions"><button className="secondary" onClick={close}>Cancel</button><button className="danger" onClick={() => { onConfirm(); close(); }}>{confirmLabel}</button></div></div></div>;
}
function ScheduleGapModal({ patient, gapId, title, close }: { patient: Patient; gapId: string; title: string; close: () => void }) {
  const scheduleGap = useAppStore((s) => s.scheduleGap);
  const [date, setDate] = useState("2026-08-22");
  const ref = useDialogFocus(close);
  return <div className="overlay" onMouseDown={(event) => event.target === event.currentTarget && close()}><div ref={ref} className="modal" role="dialog" aria-modal="true" aria-labelledby="schedule-gap-title"><button className="modal-x" onClick={close} aria-label="Close scheduling dialog"><X /></button><span className="modal-icon"><CalendarCheck /></span><h2 id="schedule-gap-title">Schedule {title}</h2><p>Select a synthetic review date for {patient.name}. This updates the care gap, appointment history, screening state, patient timeline and audit trail.</p><label>Review date<input aria-label="Review date" type="date" min="2026-08-15" value={date} onChange={(event) => setDate(event.target.value)} /></label><div className="modal-actions"><button className="secondary" onClick={close}>Cancel</button><button className="primary" disabled={!date} onClick={() => { scheduleGap(patient.id, gapId, date); toast.success("Review scheduled"); close(); }}>Schedule review</button></div></div></div>;
}
function OutreachModal({
  patient,
  close,
}: {
  patient: Patient;
  close: () => void;
}) {
  const create = useAppStore((s) => s.createOutreach);
  const dialogRef = useDialogFocus(close);
  const [channel, setChannel] = useState("Phone");
  const [owner, setOwner] = useState(
    patient.manager === "Unassigned" ? "Olivia Bennett" : patient.manager,
  );
  const [followUp, setFollowUp] = useState("2026-08-18");
  const [reason, setReason] = useState(patient.gaps[0]?.type || "Care-management follow-up");
  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div ref={dialogRef} className="modal" role="dialog" aria-modal="true" aria-labelledby="out-title">
        <button className="modal-x" onClick={close} aria-label="Close patient outreach"><X /></button>
        <span className="modal-icon"><MessageSquareMore /></span>
        <h2 id="out-title">Create patient outreach</h2>
        <p>Plan a simulated contact action for {patient.name}. No real message will be sent.</p>
        <label>
          Reason
          <input value={reason} onChange={(e) => setReason(e.target.value)} />
        </label>
        <div className="form-row">
          <label>
            Channel
            <CustomSelect
              ariaLabel="Outreach channel"
              value={channel}
              onChange={setChannel}
              options={["Phone", "SMS", "Email", "Patient Portal", "Letter"]}
            />
          </label>
          <label>
            Assigned to
            <CustomSelect
              ariaLabel="Outreach owner"
              value={owner}
              onChange={setOwner}
              options={["Olivia Bennett", "Sofia Malik", "Noah Williams"]}
            />
          </label>
        </div>
        <label>
          Message template
          <textarea defaultValue={`Hello ${patient.name}, this is a synthetic reminder to arrange your ${reason.toLowerCase()}.`} />
        </label>
        <label>
          Follow-up date
          <input type="date" value={followUp} onChange={(e) => setFollowUp(e.target.value)} />
        </label>
        <div className="modal-actions">
          <button className="secondary" onClick={close}>Cancel</button>
          <button
            className="primary"
            disabled={!reason.trim() || !followUp}
            onClick={() => {
              create({ patientId: patient.id, reason: reason.trim(), channel, owner, status: "Planned", followUp });
              toast.success("Outreach created");
              close();
            }}
          >
            Create outreach
          </button>
        </div>
      </div>
    </div>
  );
}
function RiskPage() {
  const ps = useAppStore((s) => s.patients);
  const role = useAppStore((s) => s.role);
  const updateRiskPriority = useAppStore((s) => s.updateRiskPriority);
  const nav = useNavigate();
  const [view, setView] = useState("Overall");
  const [reviewTarget, setReviewTarget] = useState<{ patient: Patient; tier: RiskTier } | null>(null);
  const rows = ps.filter((p) => {
    if (view === "Diabetes") return p.conditions.includes("Diabetes");
    if (view === "Cardiovascular") return p.conditions.includes("Cardiovascular");
    if (view === "Readmission") return p.cohorts.includes("High Readmission Risk");
    if (view === "Adherence") return p.medicationRisk;
    if (view === "Utilization") return p.edVisits >= 3 || p.admissions >= 2;
    return true;
  });
  return (
    <>
      <PageHead
        title="Risk Stratification"
        sub="Explainable demo risk signals for operational prioritization—not clinical diagnosis."
      />
      <div className="stats-grid compact">
        <Stat label="Low risk" value="82,346" tone="green" />
        <Stat label="Moderate risk" value="32,094" />
        <Stat label="High risk" value="10,274" tone="rose" />
        <Stat label="Priority review" value="3,706" tone="rose" />
      </div>
      <div className="tabs" aria-label="Risk stratification views">
        {["Overall", "Diabetes", "Cardiovascular", "Readmission", "Adherence", "Utilization"].map((item) => (
          <button key={item} className={view === item ? "active" : ""} onClick={() => setView(item)}>{item}</button>
        ))}
      </div>
      <section className="card table-card">
        <div className="card-head">
          <div>
            <h2>{view} risk review</h2>
            <p>Human reviewers can confirm or change operational priority while preserving the AI-assisted suggestion and supporting evidence.</p>
          </div>
          <Badge tone="violet">Demo model · human review required</Badge>
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Patient</th><th>AI-assisted tier</th><th>Why flagged?</th><th>Care gaps</th><th>Data freshness</th><th>Human review</th><th /></tr></thead>
            <tbody>
              {rows.map((p) => (
                <RiskReviewRow key={p.id} patient={p} role={role} onReview={(tier) => setReviewTarget({ patient: p, tier })} onOpen={() => nav(`/patients/${p.id}`)} />
              ))}
            </tbody>
          </table>
        </div>
      </section>
      {reviewTarget && <ReasonModal
        title={reviewTarget.tier === reviewTarget.patient.risk ? "Confirm population priority" : "Change population priority"}
        description={`${reviewTarget.patient.name}: ${reviewTarget.patient.risk} → ${reviewTarget.tier}. Add the human-review reason; the original AI-assisted tier remains traceable.`}
        confirmLabel="Save human review"
        close={() => setReviewTarget(null)}
        onConfirm={(reason) => { updateRiskPriority(reviewTarget.patient.id, reviewTarget.tier, reason); toast.success(reviewTarget.tier === reviewTarget.patient.risk ? "Priority confirmed" : "Priority updated with human-review reason"); }}
      />}
    </>
  );
}
function RiskReviewRow({
  patient,
  role,
  onReview,
  onOpen,
}: {
  patient: Patient;
  role: Role;
  onReview: (tier: RiskTier) => void;
  onOpen: () => void;
}) {
  const [tier, setTier] = useState<RiskTier>(patient.risk);

  const unresolvedGaps = patient.gaps.filter(
    (gap) => gap.status !== "Completed",
  ).length;

  const signal = patient.signals[0];

  const initials = patient.name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("");

  return (
    <tr className="risk-review-row">
      <td>
        <button
          type="button"
          className="risk-patient-cell"
          onClick={onOpen}
          aria-label={`Open ${patient.name}`}
        >
          <span className="risk-patient-avatar">{initials}</span>

          <span className="risk-patient-copy">
            <b>{patient.name}</b>
            <small>{patient.id}</small>
          </span>
        </button>
      </td>

      <td>
        <div className="risk-tier-cell">
          <RiskTierBadge risk={patient.risk} />

          {patient.riskReview && (
            <small className="risk-reviewed-label">
              Human reviewed · {patient.riskReview.reviewed}
            </small>
          )}
        </div>
      </td>

      <td>
        <div className="risk-evidence-cell">
          <b>{signal?.evidence ?? "No current signal"}</b>

          <span>
            {signal?.source ?? "No supporting source"}
          </span>
        </div>
      </td>

      <td>
        <div className="risk-gap-cell">
          <span
            className={
              unresolvedGaps > 1
                ? "risk-gap-count attention"
                : "risk-gap-count"
            }
          >
            {unresolvedGaps}
          </span>

          <span>
            {unresolvedGaps === 1 ? "care gap" : "care gaps"}
          </span>
        </div>
      </td>

      <td>
        <div className="risk-freshness">
          <span className="risk-freshness-status">
            <i />
            Current
          </span>

          <small>
            Latest source
            <b>{signal?.date ?? "Unknown"}</b>
          </small>
        </div>
      </td>

      <td>
        <div className="risk-review-actions">
          <div className="risk-review-select">
            <CustomSelect
              ariaLabel={`Human risk review for ${patient.name}`}
              value={tier}
              onChange={(value) => setTier(value as RiskTier)}
              options={[
                "Low",
                "Moderate",
                "High",
                "Priority Review",
              ]}
              disabled={!can(role, "carePlan")}
            />
          </div>

          <button
            type="button"
            className={
              tier === patient.risk
                ? "secondary risk-confirm-btn"
                : "primary risk-confirm-btn"
            }
            disabled={!can(role, "carePlan")}
            onClick={() => onReview(tier)}
          >
            {tier === patient.risk ? "Confirm" : "Apply change"}
          </button>
        </div>
      </td>

      <td className="risk-open-cell">
        <button
          type="button"
          className="risk-open-button"
          aria-label={`Open ${patient.name}`}
          onClick={onOpen}
        >
          <ChevronRight size={18} />
        </button>
      </td>
    </tr>
  );
}
const config = {
  diabetes: {
    title: "Diabetes Population",
    sub: "Monitor diabetes risk signals, follow-up gaps and adherence concerns.",
    cohort: "High Diabetes Risk",
    metrics: [
      ["Patients with diabetes", "18,742"],
      ["High-risk diabetes", "4,281"],
      ["Overdue follow-up", "742"],
      ["Adherence concern", "1,108"],
    ],
  },
  cardiovascular: {
    title: "Cardiovascular Health",
    sub: "Organize cardiovascular risk and preventive screening recovery.",
    cohort: "Cardiovascular Screening Gap",
    metrics: [
      ["Cardiovascular cohort", "22,318"],
      ["High cardiovascular risk", "2,906"],
      ["Screening overdue", "6,019"],
      ["Recent admissions", "684"],
    ],
  },
  hypertension: {
    title: "Hypertension Management",
    sub: "Review repeated elevated synthetic blood-pressure signals and overdue monitoring.",
    cohort: "Uncontrolled Hypertension",
    metrics: [
      ["Hypertension population", "31,604"],
      ["Uncontrolled trend", "3,842"],
      ["Overdue review", "1,416"],
      ["Adherence concern", "886"],
    ],
  },
  readmission: {
    title: "Readmission Risk",
    sub: "Prioritize recent discharges with unresolved follow-up and medication review needs.",
    cohort: "High Readmission Risk",
    metrics: [
      ["High readmission risk", "1,203"],
      ["Recent discharges", "468"],
      ["Follow-up missing", "286"],
      ["Medication review needed", "314"],
    ],
  },
  utilization: {
    title: "High Utilization",
    sub: "Review repeated emergency, admission and unscheduled-care signals.",
    cohort: "High Utilization",
    metrics: [
      ["High-utilization cohort", "936"],
      ["Repeated ED visits", "618"],
      ["Multiple admissions", "284"],
      ["No active care plan", "197"],
    ],
  },
};
function ConditionPage({ type }: { type: keyof typeof config }) {
  const c = config[type];
  const ps = useAppStore((s) => s.patients);
  const nav = useNavigate();
  const rows = ps.filter((p) => p.cohorts.includes(c.cohort));
  const metricRows = c.metrics.map((item) => [...item] as [string, string]);
  if (type === "diabetes") {
    const resolved = ps.filter((p) => p.conditions.includes("Diabetes") && p.gaps.every((g) => g.status !== "Open")).length;
    metricRows[2][1] = fmt(Math.max(0, aggregate.diabetesOverdue - resolved));
  }
  if (type === "cardiovascular") {
    const moved = rows.flatMap((p) => p.gaps).filter((g) => g.status === "Scheduled" || g.status === "Completed").length;
    metricRows[2][1] = fmt(Math.max(0, aggregate.cardioScreening - moved));
  }
  return (
    <>
      <PageHead
        title={c.title}
        sub={c.sub}
        action={<button className="primary" onClick={() => nav("/cohorts")}><Waypoints size={16} /> Open cohort builder</button>}
      />
      <div className="stats-grid compact">
        {metricRows.map((x, i) => <Stat key={x[0]} label={x[0]} value={x[1]} tone={i === 1 ? "rose" : i === 2 ? "gold" : "blue"} />)}
      </div>
      <div className="grid two">
        <section className="card span2">
          <div className="card-head"><div><h2>{c.cohort}</h2><p>Representative detailed records within the aggregate cohort</p></div><Badge>{rows.length} sample patients</Badge></div>
          <ConditionCohortTable type={type} rows={rows} onOpen={(p) => nav(`/patients/${p.id}`)} />
        </section>
        <ConditionInsight type={type} />
      </div>
    </>
  );
}
function ConditionCohortTable({ type, rows, onOpen }: { type: keyof typeof config; rows: Patient[]; onOpen: (p: Patient) => void }) {
  const headers = type === "diabetes"
    ? ["Patient", "Latest result", "Trend", "Medication adherence", "Last review", "Care gap", "Risk", "Action"]
    : type === "cardiovascular"
      ? ["Patient", "Screening", "Due", "Last encounter", "Care gap", "Risk", "Action"]
      : type === "hypertension"
        ? ["Patient", "Latest BP", "Trend", "Review", "Medication", "Risk", "Action"]
        : type === "readmission"
          ? ["Patient", "Admissions", "Last discharge/encounter", "Follow-up", "Medication review", "Risk", "Action"]
          : ["Patient", "ED visits", "Admissions", "Last encounter", "Care gaps", "Care manager", "Action"];
  return <div className="table-wrap"><table><thead><tr>{headers.map((header) => <th key={header}>{header}</th>)}</tr></thead><tbody>{rows.map((p) => {
    const openGap = p.gaps.find((g) => g.status !== "Completed");
    if (type === "diabetes") return <tr key={p.id}><td><b>{p.name}</b><small>{p.id}</small></td><td>{p.labs[0]?.result ?? "No recent result"}</td><td>{p.labs[0]?.trend ?? "Unknown"}</td><td>{p.medicationRisk ? "Potential concern" : "No current concern"}</td><td>{p.lastEncounter}</td><td>{openGap?.type ?? "No open gap"}</td><td><RiskTierBadge risk={p.risk} /></td><td><button className="secondary" aria-label={`Open ${p.name}`} onClick={() => onOpen(p)}>Review patient</button></td></tr>;
    if (type === "cardiovascular") return <tr key={p.id}><td><b>{p.name}</b><small>{p.id}</small></td><td>{p.screenings[0]?.type ?? "Cardiovascular review"}</td><td>{openGap?.due ?? p.screenings[0]?.date}</td><td>{p.lastEncounter}</td><td><CareGapBadge status={openGap?.status ?? "Completed"} /></td><td><RiskTierBadge risk={p.risk} /></td><td><button className="secondary" aria-label={`Open ${p.name}`} onClick={() => onOpen(p)}>Review patient</button></td></tr>;
    if (type === "hypertension") return <tr key={p.id}><td><b>{p.name}</b><small>{p.id}</small></td><td>{p.labs[0]?.result ?? "Synthetic observation"}</td><td>{p.labs[0]?.trend ?? "Review"}</td><td>{openGap?.due ?? "Current"}</td><td>{p.medications[0]?.refillIndicator ?? "Current"}</td><td><RiskTierBadge risk={p.risk} /></td><td><button className="secondary" aria-label={`Open ${p.name}`} onClick={() => onOpen(p)}>Review patient</button></td></tr>;
    if (type === "readmission") return <tr key={p.id}><td><b>{p.name}</b><small>{p.id}</small></td><td>{p.admissions}</td><td>{p.lastEncounter}</td><td>{p.gaps.find((g) => g.condition === "Readmission")?.status ?? "No open follow-up"}</td><td>{p.gaps.find((g) => g.type.includes("Medication"))?.status ?? "No current gap"}</td><td><RiskTierBadge risk={p.risk} /></td><td><button className="secondary" aria-label={`Open ${p.name}`} onClick={() => onOpen(p)}>Review patient</button></td></tr>;
    return <tr key={p.id}><td><b>{p.name}</b><small>{p.id}</small></td><td>{p.edVisits}</td><td>{p.admissions}</td><td>{p.lastEncounter}</td><td>{p.gaps.filter((g) => g.status !== "Completed").length}</td><td>{p.manager}</td><td><button className="secondary" aria-label={`Open ${p.name}`} onClick={() => onOpen(p)}>Review patient</button></td></tr>;
  })}</tbody></table>{!rows.length && <div className="empty"><Users /><h3>No detailed patients in this cohort</h3><p>The aggregate metric remains available as synthetic population context.</p></div>}</div>;
}
function ConditionInsight({ type }: { type: keyof typeof config }) {
  const content = {
    diabetes: ["742", "High diabetes-risk patients also have overdue follow-up", "Prioritize the combined risk-and-gap cohort for care-management review."],
    cardiovascular: ["6,019", "Cardiovascular screening backlog remains unresolved", "Use a controlled screening-recovery campaign for longest-overdue eligible patients."],
    hypertension: ["3,842", "Repeated elevated synthetic BP signals require organized review", "Prioritize patients who also have overdue monitoring or no recent contact."],
    readmission: ["1,203", "Recent discharge and follow-up gaps overlap", "Create care-manager follow-up for patients missing post-discharge review."],
    utilization: ["936", "Repeated emergency and admission use is visible", "Review patients without an active care plan for human-led management."],
  }[type];
  return <section className="card ai-card"><small>AI POPULATION INSIGHT</small><h2>{content[1]}</h2><p><b>{content[0]} affected synthetic patients.</b></p><div className="recommend"><small>RECOMMENDED OPERATIONAL ACTION</small><p>{content[2]}</p></div><footer><ShieldCheck size={15} /> Population-level prioritization only. Not a diagnosis.</footer></section>;
}
function Adherence() {
  const patients = useAppStore((s) => s.patients).filter(
    (p) => p.medicationRisk,
  );
  const nav = useNavigate();
  return (
    <>
      <PageHead
        title="Medication Adherence Risk"
        sub="Potential refill and adherence concerns for care-team review; a refill gap does not establish non-compliance."
      />
      <div className="stats-grid compact">
        <Stat label="Potential adherence concern" value="2,417" tone="gold" />
        <Stat label="Refill gap indicator" value="1,106" tone="gold" />
        <Stat label="Care-manager contact due" value="684" />
        <Stat label="Under active review" value="1,248" tone="green" />
      </div>
      <section className="card table-card">
        <div className="card-head">
          <div>
            <h2>Medication review cohort</h2>
            <p>Representative records beneath aggregate metrics</p>
          </div>
          <Badge tone="violet">Requires review</Badge>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Medication</th>
                <th>Refill gap indicator</th>
                <th>Last reported adherence</th>
                <th>Care-manager contact</th>
                <th>Risk</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {patients.map((p) => (
                <tr key={p.id}>
                  <td>
                    <b>{p.name}</b>
                    <small>{p.id}</small>
                  </td>
                  <td>{p.medications[0]?.name ?? `${p.conditions[0]} therapy`}</td>
                  <td><Badge tone="gold">{p.medications[0]?.refillIndicator ?? "Potential gap"}</Badge></td>
                  <td>{p.medications[0]?.reportedAdherence ?? "Requires confirmation"}</td>
                  <td>{p.lastContact}</td>
                  <td>
                    <Badge tone="rose">{p.risk}</Badge>
                  </td>
                  <td>
                    <button
                      className="secondary"
                      onClick={() => nav(`/patients/${p.id}`)}
                    >
                      Review patient
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <footer className="disclaimer">
          <ShieldCheck /> Pharmacy history is synthetic. Refill timing is a
          potential adherence concern, not proof of medication non-compliance.
        </footer>
      </section>
    </>
  );
}
function Cohorts() {
  const ps = useAppStore((s) => s.patients);
  const nav = useNavigate();
  const saved = useAppStore((s) => s.savedCohorts);
  const saveCohort = useAppStore((s) => s.saveCohort);
  const outreach = useAppStore((s) => s.outreach);
  const role = useAppStore((s) => s.role);
  const [condition, setCondition] = useState("Diabetes");
  const [risk, setRisk] = useState("High");
  const [age, setAge] = useState("Any");
  const [gap, setGap] = useState("Overdue");
  const [screening, setScreening] = useState("Any");
  const [medication, setMedication] = useState("Any");
  const [utilization, setUtilization] = useState("Any");
  const [recentAdmission, setRecentAdmission] = useState("Any");
  const [contact, setContact] = useState(">30 days");
  const today = new Date("2026-08-14");
  const result = ps.filter((p) => {
    const daysSinceContact = (today.getTime() - new Date(p.lastContact).getTime()) / 864e5;
    const hasOpenGap = p.gaps.some((g) => g.status !== "Completed");
    const hasOverdueScreening = p.screenings.some((item) => item.status === "Overdue");
    return (
      (condition === "Any" || p.conditions.includes(condition)) &&
      (risk === "Any" || p.risk === risk) &&
      (age === "Any" || (age === "65+" ? p.age >= 65 : p.age < 65)) &&
      (gap === "Any" || (gap === "Overdue" ? hasOpenGap : !hasOpenGap)) &&
      (screening === "Any" || (screening === "Overdue" ? hasOverdueScreening : p.screenings.some((item) => item.status === screening))) &&
      (medication === "Any" || (medication === "Concern") === p.medicationRisk) &&
      (utilization === "Any" || (utilization === "High" ? p.edVisits >= 3 || p.admissions >= 2 : p.edVisits < 3 && p.admissions < 2)) &&
      (recentAdmission === "Any" || (recentAdmission === "Recent admission" ? p.encounters.some((e) => e.type === "Admission" && e.date >= "2026-05-14") : true)) &&
      (contact === "Any" || daysSinceContact > 30)
    );
  });
  const canonical = condition === "Diabetes" && risk === "High" && gap === "Overdue" && contact === ">30 days" && age === "Any" && screening === "Any" && medication === "Any" && utilization === "Any" && recentAdmission === "Any";
  const estimated = canonical ? 742 : Math.max(result.length, result.length * 127);
  const rules = [
    ["Condition", condition, setCondition, ["Any", "Diabetes", "Cardiovascular", "Hypertension", "COPD"]],
    ["Risk", risk, setRisk, ["Any", "Low", "Moderate", "High", "Priority Review"]],
    ["Age", age, setAge, ["Any", "Under 65", "65+"]],
    ["Care gap", gap, setGap, ["Any", "Overdue", "Resolved"]],
    ["Screening", screening, setScreening, ["Any", "Overdue", "Scheduled", "Completed"]],
    ["Medication risk", medication, setMedication, ["Any", "Concern", "No concern"]],
    ["Utilization", utilization, setUtilization, ["Any", "High", "Standard"]],
    ["Recent admission", recentAdmission, setRecentAdmission, ["Any", "Recent admission"]],
    ["Last contact", contact, setContact, ["Any", ">30 days"]],
  ] as const;
  return (
    <>
      <PageHead title="Cohorts" sub="Build transparent population segments and keep outreach, care-gap and saved-cohort counts connected to current state." />
      <div className="grid cohort-layout">
        <section className="card builder">
          <div className="card-head"><div><h2>Cohort Builder</h2><p>All active rules must match (AND)</p></div><Badge tone="violet">Deterministic demo logic</Badge></div>
          <div className="cohort-rule-grid">
            {rules.map(([label, value, setter, options], index) => (
              <div className="rule" key={label}>
                <span>{index + 1}</span>
                <label>{label}<CustomSelect ariaLabel={`${label} cohort rule`} value={value} onChange={setter} options={[...options]} /></label>
                <Badge tone="blue">{index ? "AND" : "WHERE"}</Badge>
              </div>
            ))}
          </div>
          <div className="cohort-result">
            <div><small>ESTIMATED POPULATION</small><b>{fmt(estimated)}</b><span>{result.length} representative detailed patient(s) match current rules</span></div>
            <button className="primary" disabled={!can(role, "cohorts") || result.length === 0} onClick={() => {
              saveCohort({
                name: `${condition === "Any" ? "Population" : condition} ${risk === "Any" ? "" : risk} — Outreach Priority`.trim(),
                description: "Transparent AND-rule population segment created in the demo cohort builder.",
                owner: role === "Analyst" ? "Daniel Brooks" : "Dr. Eleanor Hayes",
                refreshBehavior: "Dynamic",
                rules: rules.filter(([, value]) => value !== "Any").map(([field, value]) => ({ field, value })),
              });
              toast.success("Cohort saved");
            }}>Save cohort</button>
          </div>
          {result.length === 0 && <p className="error-text" role="alert">No patients match this cohort. Adjust one or more rules before saving.</p>}
        </section>
        <section className="card">
          <div className="card-head"><div><h2>Saved cohorts</h2><p>Dynamic segments used by care-management and outreach workflows</p></div><Badge>{saved.length}</Badge></div>
          {saved.map((cohort) => {
            const activeGapCount = ps.filter((p) => p.gaps.some((g) => g.status !== "Completed") && (cohort.name.includes("Diabetes") ? p.conditions.includes("Diabetes") : cohort.name.includes("Cardiovascular") ? p.conditions.includes("Cardiovascular") : true)).length;
            const outreachCount = outreach.filter((item) => ps.some((p) => p.id === item.patientId && (cohort.name.includes("Diabetes") ? p.conditions.includes("Diabetes") : cohort.name.includes("Cardiovascular") ? p.conditions.includes("Cardiovascular") : true))).length;
            return <div className="saved-cohort detailed" key={cohort.id}>
              <div><b>{cohort.name}</b><small>{cohort.id} · {cohort.refreshBehavior} · Owner {cohort.owner}</small><p>{cohort.description}</p></div>
              <div className="cohort-mini-metrics"><span><b>{activeGapCount}</b> active sample gaps</span><span><b>{outreachCount}</b> outreach actions</span></div>
              <button className="secondary" onClick={() => nav(cohort.name.includes("Diabetes") ? "/diabetes" : cohort.name.includes("Cardiovascular") ? "/cardiovascular" : "/patients")}>Open cohort</button>
            </div>;
          })}
        </section>
      </div>
    </>
  );
}
function CareGaps() {
  const ps = useAppStore((s) => s.patients);
  const update = useAppStore((s) => s.updateGap);
  const override = useAppStore((s) => s.overrideGap);
  const role = useAppStore((s) => s.role);
  const [statusFilter, setStatusFilter] = useState("All");
  const [reviewTarget, setReviewTarget] = useState<{ patientId: string; gapId: string; label: string } | null>(null);
  const [scheduleTarget, setScheduleTarget] = useState<{ patient: Patient; gapId: string; title: string } | null>(null);
  const gaps = ps
    .flatMap((p) => p.gaps.map((g) => ({ p, g })))
    .filter(({ g }) => statusFilter === "All" || g.status === statusFilter);
  const statuses: GapStatus[] = ["Open", "Outreach Planned", "Contacted", "Scheduled", "In Progress", "Completed", "Unable to Reach", "Deferred"];
  return (
    <>
      <PageHead title="Care Gaps" sub="Track each gap from detection through outreach, scheduling, human review and completion." />
      <section className="card table-card">
        <div className="toolbar">
          <Badge tone="gold">{ps.flatMap((p) => p.gaps).filter((g) => g.status === "Open").length} open sample gaps</Badge>
          <span className="muted">Aggregate open gaps: 9,184</span>
          <CustomSelect ariaLabel="Filter care gaps by status" value={statusFilter} onChange={setStatusFilter} options={["All", ...statuses]} />
        </div>
        <div className="table-wrap">
          <table>
            <thead><tr><th>Patient</th><th>Gap</th><th>Due date</th><th>Priority</th><th>Status</th><th>Update</th><th>Human review</th></tr></thead>
            <tbody>
              {gaps.map(({ p, g }) => (
                <tr key={g.id}>
                  <td><NavLink to={`/patients/${p.id}`} className="text-link">{p.name}<small>{p.id}</small></NavLink></td>
                  <td><b>{g.type}</b><small>{g.condition}</small></td>
                  <td>{g.due}</td>
                  <td><Badge tone={g.priority === "High" ? "rose" : "gold"}>{g.priority}</Badge></td>
                  <td><CareGapBadge status={g.status} /></td>
                  <td>
                    <CustomSelect
                      ariaLabel={`Update ${g.type}`}
                      value={g.status}
                      options={statuses}
                      disabled={g.status === "Completed" || (!can(role, "carePlan") && !can(role, "screening"))}
                      onChange={(value) => {
                        if (value === "Scheduled") setScheduleTarget({ patient: p, gapId: g.id, title: g.type });
                        else { update(p.id, g.id, value as GapStatus); toast.success(`Care gap marked ${value}`); }
                      }}
                    />
                  </td>
                  <td>
                    <button className="secondary" disabled={g.status === "Completed" || (!can(role, "carePlan") && !can(role, "screening"))} onClick={() => setReviewTarget({ patientId: p.id, gapId: g.id, label: `${p.name} — ${g.type}` })}>Resolve with evidence</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!gaps.length && <div className="empty"><ClipboardCheck /><h3>No care gaps match this view</h3><p>All selected care-gap statuses are clear.</p></div>}
        </div>
      </section>
      {reviewTarget && <ReasonModal title="Resolve care gap with external evidence" description={`${reviewTarget.label}. Add the human-review reason or external-evidence note; the original AI/care-gap record is preserved.`} confirmLabel="Resolve care gap" close={() => setReviewTarget(null)} onConfirm={(reason) => { override(reviewTarget.patientId, reviewTarget.gapId, reason); toast.success("Gap resolved with external evidence"); }} />}
      {scheduleTarget && <ScheduleGapModal patient={scheduleTarget.patient} gapId={scheduleTarget.gapId} title={scheduleTarget.title} close={() => setScheduleTarget(null)} />}
    </>
  );
}
function Outreach() {
  const os = useAppStore((s) => s.outreach);
  const ps = useAppStore((s) => s.patients);
  const update = useAppStore((s) => s.updateOutreach);
  const campaigns = useAppStore((s) => s.campaigns);
  const responses = useAppStore((s) => s.campaignResponses);
  const launch = useAppStore((s) => s.launchCampaign);
  const simulate = useAppStore((s) => s.simulateCampaign);
  const closeCampaign = useAppStore((s) => s.closeCampaign);
  const role = useAppStore((s) => s.role);
  const [campaignBuilder, setCampaignBuilder] = useState(false);
  const [view, setView] = useState("Work Queue");
  const statusOptions: OutreachStatus[] = ["Planned", "Sent", "Contacted", "No Response", "Accepted", "Declined", "Scheduled", "Completed"];
  const latestCampaign = campaigns[0];
  const responseChart = latestCampaign
    ? [
        { n: "Interested / response", v: latestCampaign.responses },
        { n: "No response", v: latestCampaign.noResponse },
        { n: "Scheduled", v: latestCampaign.scheduled },
        { n: "Completed", v: latestCampaign.completed },
        { n: "Opted out", v: latestCampaign.optedOut },
      ]
    : [];
  return (
    <>
      <PageHead
        title="Outreach"
        sub="Coordinate patient work queues, outreach history, deterministic campaigns and response analytics."
        action={<button className="primary" disabled={!can(role, "outreach")} onClick={() => setCampaignBuilder(true)}><Plus /> Create campaign</button>}
      />
      <div className="stats-grid compact">
        <Stat label="Planned outreach" value={fmt(186 + os.filter((x) => x.status === "Planned").length)} tone="gold" />
        <Stat label="Contacted this week" value={fmt(134 + os.filter((x) => x.status === "Contacted").length)} tone="green" />
        <Stat label="Awaiting response" value={fmt(52 + os.filter((x) => x.status === "Sent" || x.status === "No Response").length)} />
        <Stat label="Appointments scheduled" value={fmt(41 + campaigns.reduce((a, c) => a + c.scheduled, 0))} tone="green" />
      </div>
      <div className="tabs" aria-label="Outreach views">
        {["Work Queue", "Campaigns", "Patient Outreach", "Results"].map((item) => <button key={item} className={view === item ? "active" : ""} onClick={() => setView(item)}>{item}</button>)}
      </div>
      {(view === "Work Queue" || view === "Patient Outreach") && (
        <section className="card span2">
          <div className="card-head"><div><h2>{view === "Work Queue" ? "Patient outreach queue" : "Patient outreach history"}</h2><p>Every status update persists across patient, outreach, care-gap and audit views.</p></div><Badge>{os.length} demo actions</Badge></div>
          {os.length ? (
            <div className="table-wrap"><table><thead><tr><th>Patient</th><th>Reason</th><th>Channel</th><th>Owner</th><th>Follow-up</th><th>Status</th></tr></thead><tbody>
              {os.map((o) => (
                <tr key={o.id}>
                  <td><NavLink className="text-link" to={`/patients/${o.patientId}`}>{ps.find((p) => p.id === o.patientId)?.name}<small>{o.patientId}</small></NavLink></td>
                  <td>{o.reason}</td><td>{o.channel}</td><td>{o.owner}</td><td>{o.followUp}</td>
                  <td><CustomSelect ariaLabel={`Outreach status for ${o.patientId}`} value={o.status} options={statusOptions} disabled={!can(role, "outreach") || o.status === "Completed"} onChange={(value) => { update(o.id, value as OutreachStatus); toast.success(`Outreach marked ${value}`); }} /></td>
                </tr>
              ))}
            </tbody></table></div>
          ) : <div className="empty"><MessageSquareMore /><h3>No patient outreach created yet</h3><p>Open a patient record to create the first simulated outreach action.</p></div>}
        </section>
      )}
      {view === "Campaigns" && (
        <div className="grid two">
          {campaigns.map((c) => (
            <section className="card campaign" key={c.id}>
              <div className="card-head"><div><Badge tone={c.status === "Active" ? "green" : c.status === "Closed" ? "blue" : "gold"}>{c.status}</Badge><small>{c.id} · {c.channel}</small></div><span>{c.cohort} · {c.targeted} targeted</span></div>
              <h3>{c.name}</h3>
              <CampaignPerformance targeted={c.targeted} delivered={c.delivered} responses={c.responses} scheduled={c.scheduled} completed={c.completed} noResponse={c.noResponse} optedOut={c.optedOut} />
              <div className="campaign-actions">
                {c.status === "Draft" && <button className="primary" disabled={!can(role, "outreach")} onClick={() => { launch(c.id); toast.success("Demo campaign launched"); }}>Launch demo</button>}
                {c.status === "Active" && <><button className="primary" disabled={!can(role, "outreach")} onClick={() => { simulate(c.id); toast.success("Campaign responses simulated"); }}>Simulate responses</button><button className="secondary" disabled={!can(role, "outreach")} onClick={() => { closeCampaign(c.id); toast.success("Campaign closed"); }}>Close campaign</button></>}
              </div>
              {responses.filter((r) => r.campaignId === c.id).length > 0 && <div className="response-list">{responses.filter((r) => r.campaignId === c.id).map((r) => <span key={r.id}><b>{ps.find((p) => p.id === r.patientId)?.name ?? "Aggregate audience"}</b> {r.status}</span>)}</div>}
            </section>
          ))}
        </div>
      )}
      {view === "Results" && (
        <div className="grid two">
          <section className="card"><h2>Campaign response mix</h2><p>Deterministic synthetic response outcomes for the latest campaign.</p><ResponsiveContainer width="100%" height={280}><PieChart><Pie data={responseChart} dataKey="v" nameKey="n" innerRadius={60} outerRadius={90}>{["#2E8A72", "#DDD8E3", "#4E79A7", "#635BB5", "#B85867"].map((color) => <Cell key={color} fill={color} />)}</Pie><Tooltip /></PieChart></ResponsiveContainer></section>
          <section className="card"><h2>Program response summary</h2><dl className="settings-list"><div><dt>Targeted</dt><dd>{latestCampaign?.targeted ?? 0}</dd></div><div><dt>Delivered</dt><dd>{latestCampaign?.delivered ?? 0}</dd></div><div><dt>Responses</dt><dd>{latestCampaign?.responses ?? 0}</dd></div><div><dt>Appointments scheduled</dt><dd>{latestCampaign?.scheduled ?? 0}</dd></div><div><dt>Completed screenings</dt><dd>{latestCampaign?.completed ?? 0}</dd></div><div><dt>No response</dt><dd>{latestCampaign?.noResponse ?? 0}</dd></div><div><dt>Opted out</dt><dd>{latestCampaign?.optedOut ?? 0}</dd></div></dl></section>
        </div>
      )}
      {campaignBuilder && <CampaignBuilder close={() => setCampaignBuilder(false)} />}
    </>
  );
}
function CampaignBuilder({ close }: { close: () => void }) {
  const create = useAppStore((s) => s.createCampaign);
  const dialogRef = useDialogFocus(close);
  const [name, setName] = useState("Cardiovascular Screening Recovery — Q3");
  const [cohort, setCohort] = useState("Cardiovascular Screening Gap");
  const [channel, setChannel] = useState("Patient Portal");
  const [audience, setAudience] = useState(250);
  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && close()}>
      <div ref={dialogRef} className="modal" role="dialog" aria-modal="true" aria-labelledby="campaign-title">
        <button className="modal-x" onClick={close} aria-label="Close campaign builder"><X /></button>
        <span className="modal-icon"><MessageSquareMore /></span>
        <h2 id="campaign-title">Create outreach campaign</h2>
        <p>Build a controlled synthetic campaign, preview its eligible population, then save it as a launchable draft.</p>
        <label>Campaign name<input value={name} onChange={(e) => setName(e.target.value)} /></label>
        <label>Target cohort<CustomSelect ariaLabel="Target cohort" value={cohort} onChange={setCohort} options={["Cardiovascular Screening Gap", "High Diabetes Risk", "High Readmission Risk", "Uncontrolled Hypertension"]} /></label>
        <div className="form-row">
          <label>Channel<CustomSelect ariaLabel="Campaign channel" value={channel} onChange={setChannel} options={["Patient Portal", "SMS", "Email", "Phone", "Letter"]} /></label>
          <label>Audience<input aria-label="Audience" type="number" min="1" max="500" value={audience} onChange={(e) => setAudience(Number(e.target.value))} /></label>
        </div>
        <div className="cohort-result"><div><small>ELIGIBLE DEMO POPULATION</small><b>{audience > 0 ? fmt(audience) : "0"}</b><span>{cohort} via {channel}</span></div></div>
        {audience <= 0 && <p role="alert" className="error-text">Campaign contains no eligible patients.</p>}
        <div className="modal-actions"><button className="secondary" onClick={close}>Cancel</button><button className="primary" disabled={!name.trim() || audience <= 0} onClick={() => { create(name, cohort, audience, channel); toast.success("Campaign draft created"); close(); }}>Create draft</button></div>
      </div>
    </div>
  );
}
function CareManagement() {
  const patients = useAppStore((s) => s.patients);
  const tasks = useAppStore((s) => s.tasks);
  const outreach = useAppStore((s) => s.outreach);
  const nav = useNavigate();
  const assigned = patients.filter((p) => p.manager === "Olivia Bennett");
  const priority = patients.filter(
    (p) => p.risk === "Priority Review" || p.risk === "High",
  );
  return (
    <>
      <PageHead
        title="Care Manager Workspace"
        sub="Assigned patients, today’s work, overdue follow-ups and population alerts in one operational view."
        action={<Badge tone="green">Olivia Bennett · Care Manager</Badge>}
      />
      <div className="stats-grid compact">
        <Stat
          label="Patients under active management"
          value={fmt(
            614 +
              patients.filter((p) => p.status === "Active Management").length,
          )}
          tone="green"
        />
        <Stat label="New referrals" value="28" tone="blue" />
        <Stat
          label="Open tasks"
          value={fmt(42 + tasks.filter((t) => t.status !== "Completed").length)}
          tone="gold"
        />
        <Stat
          label="Follow-ups due"
          value={fmt(16 + patients.flatMap((p) => p.gaps).filter((g) => g.status !== "Completed" && g.due <= "2026-08-14").length)}
          tone="gold"
        />
        <Stat
          label="High priority"
          value={fmt(18 + priority.length)}
          tone="rose"
        />
      </div>
      <div className="grid two">
        <section className="card span2">
          <div className="card-head">
            <div>
              <h2>Assigned patients</h2>
              <p>Current care-manager panel and management status</p>
            </div>
            <Badge>{assigned.length} detailed records</Badge>
          </div>
          <PatientTable
            rows={assigned}
            onOpen={(p) => nav(`/patients/${p.id}`)}
          />
        </section>
        <section className="card">
          <div className="card-head">
            <h2>Today’s tasks</h2>
            <NavLink className="text-link" to="/tasks">
              Open task queue <ChevronRight />
            </NavLink>
          </div>
          {tasks.length ? (
            tasks.slice(0, 4).map((task) => (
              <div className="plan-row" key={task.id}>
                <span className="condition-icon">
                  <ClipboardCheck />
                </span>
                <div>
                  <b>{task.action}</b>
                  <small>
                    {patients.find((p) => p.id === task.patientId)?.name} · Due{" "}
                    {task.due}
                  </small>
                </div>
                <Badge tone={task.priority === "High" ? "rose" : "gold"}>
                  {task.status}
                </Badge>
              </div>
            ))
          ) : (
            <div className="empty">
              <ClipboardCheck />
              <h3>No tasks due today</h3>
              <p>New care-plan and follow-up tasks will appear here.</p>
            </div>
          )}
        </section>
        <section className="card">
          <div className="card-head">
            <h2>Outreach queue</h2>
            <NavLink className="text-link" to="/outreach">
              Open outreach <ChevronRight />
            </NavLink>
          </div>
          {outreach.length ? (
            outreach.slice(0, 4).map((item) => (
              <div className="plan-row" key={item.id}>
                <span className="condition-icon">
                  <MessageSquareMore />
                </span>
                <div>
                  <b>{patients.find((p) => p.id === item.patientId)?.name}</b>
                  <small>
                    {item.reason} · {item.channel}
                  </small>
                </div>
                <Badge>{item.status}</Badge>
              </div>
            ))
          ) : (
            <div className="empty">
              <MessageSquareMore />
              <h3>No assigned outreach</h3>
              <p>Patient outreach actions will appear here.</p>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
function CarePlans() {
  const ps = useAppStore((s) => s.patients);
  const carePlans = useAppStore((s) => s.carePlans);
  const tasks = useAppStore((s) => s.tasks);
  const createPlan = useAppStore((s) => s.createCarePlan);
  const role = useAppStore((s) => s.role);
  return (
    <>
      <PageHead title="Care Plans" sub="Human-owned goals, tasks, monitoring, screening and follow-up for active population-health management." />
      <div className="stats-grid compact">
        <Stat label="Active plans" value={String(carePlans.filter((p) => p.status === "Active").length)} tone="green" />
        <Stat label="Unmanaged sample patients" value={String(ps.filter((p) => p.status === "Unmanaged").length)} tone="gold" />
        <Stat label="Linked tasks" value={String(tasks.length)} />
        <Stat label="Follow-ups due" value={String(tasks.filter((t) => t.status !== "Completed" && t.status !== "Cancelled").length)} tone="rose" />
      </div>
      <div className="grid two">
        {carePlans.map((plan) => {
          const patient = ps.find((p) => p.id === plan.patientId);
          return <section className="card" key={plan.id}>
            <div className="card-head"><div><h2>{plan.name}</h2><p>{plan.id} · {patient?.name} · Owner {plan.owner}</p></div><Badge tone="green">{plan.status}</Badge></div>
            <dl className="settings-list"><div><dt>Goals</dt><dd>{plan.goals.join(" · ")}</dd></div><div><dt>Monitoring</dt><dd>{plan.monitoring.join(" · ")}</dd></div><div><dt>Screening</dt><dd>{plan.screenings.join(" · ") || "None configured"}</dd></div><div><dt>Follow-ups</dt><dd>{plan.followUps.join(" · ")}</dd></div><div><dt>Start date</dt><dd>{plan.startDate}</dd></div></dl>
            <div className="linked-tasks"><b>Linked tasks</b>{tasks.filter((t) => plan.taskIds.includes(t.id)).map((task) => <span key={task.id}>{task.action} · {task.status}</span>)}{!tasks.some((t) => plan.taskIds.includes(t.id)) && <small>No linked tasks yet.</small>}</div>
          </section>;
        })}
      </div>
      <section className="card">
        <div className="card-head"><div><h2>Patients without an active plan</h2><p>Create a structured demo plan; duplicate active plans are blocked in shared state.</p></div></div>
        {ps.filter((p) => p.status === "Unmanaged").map((p) => <div className="plan-row" key={p.id}><span className="condition-icon"><BriefcaseMedical /></span><div><b>{p.name}</b><small>{p.id} · {p.conditions.join(", ")} · {p.manager}</small></div><Badge tone="gold">Unmanaged</Badge><button className="secondary" disabled={!can(role, "carePlan")} onClick={() => { createPlan(p.id); toast.success("Care plan created with linked follow-up task"); }}>Create plan</button></div>)}
      </section>
    </>
  );
}
function Tasks() {
  const tasks = useAppStore((s) => s.tasks);
  const updateTaskStatus = useAppStore((s) => s.updateTaskStatus);
  const create = useAppStore((s) => s.createTask);
  const ps = useAppStore((s) => s.patients);
  const role = useAppStore((s) => s.role);
  const statuses: TaskStatus[] = ["Open", "Assigned", "In Progress", "Completed", "Overdue", "Cancelled"];
  return (
    <>
      <PageHead
        title="Follow-up Tasks"
        sub="Assigned operational work with clear ownership, source, due date and guarded state transitions."
        action={<button className="primary" disabled={!can(role, "carePlan")} onClick={() => { create({ patientId: ps[0].id, action: "Book diabetes review", owner: "Olivia Bennett", due: "2026-08-18", priority: "High", source: "AI Priority Queue", status: "Open" }); toast.success("Follow-up task created"); }}><Plus /> Add demo task</button>}
      />
      <section className="card">
        <div className="card-head"><div><h2>Today’s priority actions</h2><p>AI may suggest ordering; humans own completion and cancellation.</p></div><Badge tone="violet">AI-assisted ordering</Badge></div>
        {tasks.length ? tasks.map((t) => (
          <div className="plan-row" key={t.id}>
            <span className="condition-icon"><ClipboardCheck /></span>
            <div><b>{t.action}</b><small>{ps.find((p) => p.id === t.patientId)?.name} · Due {t.due} · {t.owner} · Source {t.source}</small></div>
            <Badge tone={t.status === "Completed" ? "green" : t.status === "Overdue" ? "rose" : "gold"}>{t.priority}</Badge>
            <CustomSelect ariaLabel={`Task status for ${t.action}`} value={t.status} options={statuses} disabled={!can(role, "carePlan") || t.status === "Completed"} onChange={(value) => { updateTaskStatus(t.id, value as TaskStatus); toast.success(`Task marked ${value}`); }} />
          </div>
        )) : <div className="empty"><ClipboardCheck /><h3>No follow-up tasks</h3><p>Create a demo task or care plan to add work to the connected queue.</p></div>}
      </section>
    </>
  );
}
function Screening() {
  const ps = useAppStore((s) => s.patients);
  const update = useAppStore((s) => s.updateGap);
  const role = useAppStore((s) => s.role);
  const [view, setView] = useState("Overview");
  const [scheduleTarget, setScheduleTarget] = useState<{ patient: Patient; gapId: string; title: string } | null>(null);
  const rows = ps.flatMap((p) => p.gaps.filter((g) => g.type.includes("Review")).map((g) => ({ p, g })));
  const filtered = view === "Overview" ? rows : rows.filter(({ g }) => view === "Overdue" ? g.status === "Open" || g.status === "Outreach Planned" || g.status === "Contacted" : view === "Scheduled" ? g.status === "Scheduled" || g.status === "In Progress" : g.status === "Completed");
  const completedDelta = rows.filter(({ g }) => g.status === "Completed").length;
  const scheduledDelta = rows.filter(({ g }) => g.status === "Scheduled" || g.status === "In Progress").length;
  return (
    <>
      <PageHead title="Preventive Screening" sub="Move preventive-care gaps from detection to outreach, scheduling, completion and traceable gap closure." />
      <div className="stats-grid compact"><Stat label="Overdue" value={fmt(6019 - completedDelta - scheduledDelta)} tone="gold" /><Stat label="Scheduled" value={fmt(1284 + scheduledDelta)} /><Stat label="Completed this quarter" value={fmt(3746 + completedDelta)} tone="green" /><Stat label="Completion rate" value={`${(72.4 + completedDelta * 0.1).toFixed(1)}%`} tone="green" /></div>
      <div className="tabs" aria-label="Screening views">{["Overview", "Overdue", "Scheduled", "Completed"].map((item) => <button key={item} className={view === item ? "active" : ""} onClick={() => setView(item)}>{item}</button>)}</div>
      <section className="card">
        {filtered.map(({ p, g }) => <div className="plan-row" key={g.id}><span className="condition-icon"><CalendarCheck /></span><div><b>{p.name} — {g.type}</b><small>Due {g.due} · {p.id} · General preventive demo workflow</small></div><CareGapBadge status={g.status} />{g.status !== "Completed" && <button className="secondary" disabled={!can(role, "screening") && !can(role, "carePlan")} onClick={() => { if (g.status === "Scheduled") { update(p.id, g.id, "Completed"); toast.success("Screening completed"); } else { setScheduleTarget({ patient: p, gapId: g.id, title: g.type }); } }}>{g.status === "Scheduled" ? "Complete" : "Schedule"}</button>}</div>)}
        {!filtered.length && <div className="empty"><CalendarCheck /><h3>No screenings in this state</h3><p>Switch views to review other synthetic screening records.</p></div>}
      </section>
      {scheduleTarget && <ScheduleGapModal patient={scheduleTarget.patient} gapId={scheduleTarget.gapId} title={scheduleTarget.title} close={() => setScheduleTarget(null)} />}
    </>
  );
}
function Insights() {
  const nav = useNavigate();
  const insights = [
    [
      "High diabetes-risk patients with overdue review",
      "742",
      "Laboratory trends, overdue appointments and medication records",
      "Review combined cohort for care-management outreach.",
    ],
    [
      "Cardiovascular screening backlog",
      "6,019",
      "Screening and appointment data",
      "Prioritize longest-overdue eligible patients in a controlled campaign.",
    ],
    [
      "Readmission-risk patients missing follow-up",
      "286",
      "Recent discharge and appointment records",
      "Create care-manager follow-up queue.",
    ],
    [
      "High-utilization patients without active plan",
      "197",
      "Emergency and admission encounters",
      "Review for active-management suitability.",
    ],
  ];
  return (
    <>
      <PageHead
        title="AI Insights"
        sub="Prioritized population opportunities with evidence, traceability and human oversight."
      />
      {insights.map((x) => (
        <section className="card insight-row" key={x[0]}>
          <span className="modal-icon">
            <Brain />
          </span>
          <div>
            <Badge tone="violet">AI-generated operational insight</Badge>
            <h2>{x[0]}</h2>
            <p>
              <b>{x[1]} affected patients.</b> Evidence: {x[2]}.
            </p>
            <div className="recommend">
              <small>RECOMMENDED ACTION</small>
              <p>{x[3]}</p>
            </div>
          </div>
          <button
            className="secondary"
            onClick={() =>
              nav(
                x[0].includes("diabetes")
                  ? "/diabetes"
                  : x[0].includes("Cardiovascular")
                    ? "/cardiovascular"
                    : x[0].includes("Readmission")
                      ? "/readmission"
                      : "/utilization",
              )
            }
          >
            Review cohort <ChevronRight />
          </button>
        </section>
      ))}
    </>
  );
}
function Trends() {
  const chartCards = [
    ["Risk over time", "highRisk", "#B85867", "area"],
    ["Care-gap closure", "closed", "#2E8A72", "bar"],
    ["Screening completion", "screening", "#C99A42", "area"],
    ["Outreach activity", "outreach", "#4E79A7", "bar"],
    ["Readmission-risk cohort", "readmission", "#635BB5", "area"],
    ["High utilization", "utilization", "#372A45", "bar"],
  ] as const;
  return (
    <>
      <PageHead title="Population Trends" sub="Longitudinal demo analytics for risk, care-gap closure, screening, outreach, readmission risk and high utilization." />
      <div className="grid two">
        {chartCards.map(([title, key, color, type]) => (
          <section className="card" key={key}>
            <h2>{title}</h2>
            <p>Deterministic aggregate demo trend. Not a causal clinical outcome.</p>
            <ResponsiveContainer width="100%" height={260}>
              {type === "bar" ? (
                <BarChart data={trend}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="month" /><YAxis /><Tooltip /><Bar dataKey={key} fill={color} radius={[5, 5, 0, 0]} /></BarChart>
              ) : (
                <AreaChart data={trend}><CartesianGrid strokeDasharray="3 3" vertical={false} /><XAxis dataKey="month" /><YAxis /><Tooltip /><Area dataKey={key} stroke={color} fill={`${color}22`} strokeWidth={2} /></AreaChart>
              )}
            </ResponsiveContainer>
          </section>
        ))}
      </div>
    </>
  );
}
function Outcomes() {
  const patients = useAppStore((s) => s.patients);
  const outreach = useAppStore((s) => s.outreach);
  const tasks = useAppStore((s) => s.tasks);
  const completedGapDelta = patients.flatMap((p) => p.gaps).filter((g) => g.status === "Completed").length;
  return (
    <>
      <PageHead title="Outcome Analytics" sub="Observed changes during simulated care-management activity without false causal claims." />
      <div className="stats-grid compact">
        <Stat label="Care gaps closed" value={fmt(1738 + completedGapDelta)} trend="During demo period" tone="green" />
        <Stat label="Screenings scheduled" value={fmt(1284 + patients.flatMap((p) => p.gaps).filter((g) => g.status === "Scheduled").length)} tone="green" />
        <Stat label="Follow-up completed" value={fmt(846 + tasks.filter((t) => t.status === "Completed").length)} tone="green" />
        <Stat label="Patients contacted" value={fmt(2106 + outreach.filter((o) => ["Contacted", "Accepted", "Scheduled", "Completed"].includes(o.status)).length)} />
        <Stat label="Average outreach response" value="42.1%" />
        <Stat label="Active-management completion" value="68.4%" />
      </div>
      <section className="card notice"><ShieldCheck /><div><h2>Responsible interpretation</h2><p>During the demo period, unresolved care gaps decreased alongside simulated outreach activity. This product does not claim that AI caused admissions, screening completion, or clinical outcomes.</p></div></section>
    </>
  );
}
function DataSources() {
  const sources = useAppStore((s) => s.dataSources);
  const role = useAppStore((s) => s.role);
  const setStatus = useAppStore((s) => s.setDataSourceStatus);
  const refreshSources = useAppStore((s) => s.refreshDataSources);
  const [mode, setMode] = useState<"ready" | "loading">("ready");
  const stale = sources.filter((source) => source.status === "Attention Required" || source.freshnessMinutes > 30).length;
  const unavailableSource = sources.find((source) => source.status === "Attention Required");
  return (
    <>
      <PageHead
        title="Population Data Sources"
        sub="Transparent synthetic source coverage, freshness and data-quality context. No live clinical systems are connected."
        action={<div className="page-actions">
          <button className="secondary" disabled={!can(role, "admin") || mode === "loading"} onClick={() => {
            setMode("loading");
            window.setTimeout(() => { refreshSources(); setMode("ready"); toast.success("Synthetic sources refreshed"); }, 450);
          }}><RefreshCw /> Refresh all</button>
          <button className="secondary" disabled={!can(role, "admin")} onClick={() => { setStatus("SRC-PHM", "Attention Required"); toast.warning("Synthetic pharmacy source marked attention required"); }}><AlertTriangle /> Simulate source issue</button>
        </div>}
      />
      {role !== "Administrator" && <section className="card notice"><ShieldCheck /><div><h2>Read-only source view</h2><p>Switch to Administrator to simulate source status changes or refresh the demo feeds.</p></div></section>}
      {mode === "loading" && <section className="card state-panel" role="status"><RefreshCw className="spin" /><div><h2>Calculating population view…</h2><p>Reviewing care gaps and refreshing synthetic source freshness.</p></div></section>}
      {unavailableSource && mode !== "loading" && (
        <section className="card state-panel error-state" role="alert" aria-live="assertive">
          <AlertTriangle />
          <div>
            <h2>Data source unavailable</h2>
            <p>{unavailableSource.name} is marked Attention Required in this synthetic demo. Population risk summaries using this source should be reviewed cautiously until the connection is restored.</p>
          </div>
        </section>
      )}
      <div className="source-grid">
        {sources.map((source) => (
          <section className="card source" key={source.id}>
            <span className="condition-icon"><Database /></span>
            <div><h3>{source.name}</h3><Badge tone={source.status === "Demo Connected" ? "green" : source.status === "Attention Required" ? "gold" : "blue"}>{source.status}</Badge></div>
            <dl><div><dt>Type</dt><dd>{source.kind}</dd></div><div><dt>Last simulated refresh</dt><dd>{source.lastRefresh}</dd></div><div><dt>Record completeness</dt><dd>{source.completeness}</dd></div><div><dt>Freshness</dt><dd>{source.freshnessMinutes <= 15 ? "Current" : source.freshnessMinutes <= 30 ? "Review" : "Stale"}</dd></div></dl>
            {source.status === "Attention Required" && <button className="secondary" disabled={!can(role, "admin")} onClick={() => { setStatus(source.id, "Demo Connected"); toast.success(`${source.name} synthetic source restored`); }}>Retry connection</button>}
          </section>
        ))}
      </div>
      <section className="card">
        <div className="card-head"><div><h2>Data quality</h2><p>Representative quality indicators used to explain uncertainty in population-level intelligence.</p></div><Badge tone={stale ? "gold" : "green"}>{stale ? `${stale} freshness issue(s)` : "Sources current"}</Badge></div>
        <div className="stats-grid compact quality-grid"><Stat label="Complete records" value="124,906" tone="green" /><Stat label="Missing demographics" value="842" tone="gold" /><Stat label="Missing recent encounter" value="1,842" tone="gold" /><Stat label="Unmatched medication record" value="316" tone="gold" /><Stat label="Stale data" value={fmt(stale ? 1842 : 0)} tone={stale ? "rose" : "green"} /></div>
        <div className="notice compact"><AlertTriangle /><div><h2>AI data-quality insight</h2><p>{stale ? "Some population risk signals use records older than the configured freshness threshold. Review source coverage before action." : "Current demo source freshness is within the configured review window."}</p></div></div>
      </section>
    </>
  );
}
function Integrations() {
  const sources = useAppStore((s) => s.dataSources);
  const role = useAppStore((s) => s.role);
  const setStatus = useAppStore((s) => s.setDataSourceStatus);
  const protocols: Record<string, string> = { EHR: "FHIR / EHR Demo", Laboratory: "HL7 / Lab Feed Demo", Pharmacy: "REST / Pharmacy Demo", Appointments: "Scheduling API Demo", Encounters: "Event Feed Demo", Screening: "Batch Registry Demo" };
  return (
    <>
      <PageHead title="Integrations" sub="Frontend-only integration concepts with stateful health, freshness and recovery simulation. No real clinical connection exists." />
      <div className="source-grid">
        {sources.map((source) => <section className="card source" key={source.id}>
          <span className="condition-icon"><Waypoints /></span>
          <div><h3>{source.name}</h3><Badge tone={source.status === "Demo Connected" ? "green" : source.status === "Attention Required" ? "gold" : "blue"}>{source.status}</Badge></div>
          <p>{protocols[source.name] ?? "Synthetic interface"}</p>
          <small>Last refresh: {source.lastRefresh} · {source.completeness} completeness</small>
          <div className="campaign-actions"><button className="secondary" disabled={!can(role, "admin") || source.status === "Attention Required"} onClick={() => { setStatus(source.id, "Attention Required"); toast.warning(`${source.name} demo interface needs attention`); }}>Create demo issue</button><button className="secondary" disabled={!can(role, "admin") || source.status === "Demo Connected"} onClick={() => { setStatus(source.id, "Demo Connected"); toast.success(`${source.name} demo interface restored`); }}>Restore</button></div>
        </section>)}
      </div>
      <section className="card notice"><ShieldCheck /><div><h2>Simulation boundary</h2><p>These controls change only local frontend demo state. No FHIR server, EHR, laboratory, pharmacy or outreach provider is contacted.</p></div></section>
    </>
  );
}
function Audit() {
  const rows = useAppStore((s) => s.audit);
  return (
    <>
      <PageHead
        title="Audit Trail"
        sub="Trace population and patient-level demo actions from suggestion to human decision."
      />
      <section className="card table-card">
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Timestamp</th>
                <th>User / role</th>
                <th>Patient / cohort</th>
                <th>Action</th>
                <th>Previous</th>
                <th>New</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((a) => (
                <tr key={a.id}>
                  <td>{new Date(a.timestamp).toLocaleString()}</td>
                  <td>
                    <b>{a.user}</b>
                    <small>{a.role}</small>
                  </td>
                  <td>{a.subject}</td>
                  <td>{a.action}</td>
                  <td>{a.previous}</td>
                  <td>{a.next}</td>
                </tr>
              ))}
            </tbody>
          </table>
          {!rows.length && (
            <div className="empty">
              <ShieldCheck />
              <h3>No recorded actions yet</h3>
              <p>Workflow actions will appear here automatically.</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}
function SettingsPage() {
  const reset = useAppStore((s) => s.reset),
    role = useAppStore((s) => s.role);
  const [resetConfirm, setResetConfirm] = useState(false);
  return (
    <>
      <PageHead
        title="Settings"
        sub="Demo controls, responsible AI governance and role simulation."
      />
      <div className="grid two">
        <section className="card">
          <h2>Demo controls</h2>
          <p>
            Restore all patients, gaps, outreach, campaigns and audit activity
            to their deterministic seed state.
          </p>
          <button
            className="danger"
            disabled={role !== "Administrator"}
            onClick={() => setResetConfirm(true)}
          >
            <RefreshCw /> Reset demo data
          </button>
          {role !== "Administrator" && (
            <small className="hint">
              Switch to Administrator to reset demo state.
            </small>
          )}
        </section>
        <section className="card">
          <h2>AI Governance / Responsible Use</h2>
          <dl className="settings-list">
            <div>
              <dt>Model</dt>
              <dd>Deterministic demo rules</dd>
            </div>
            <div>
              <dt>Data coverage</dt>
              <dd>Synthetic records only</dd>
            </div>
            <div>
              <dt>Human review</dt>
              <dd>Required for every action</dd>
            </div>
            <div>
              <dt>Last simulated validation</dt>
              <dd>01 Aug 2026</dd>
            </div>
          </dl>
          <p className="disclaimer">
            <ShieldCheck /> No diagnosis, prescribing, autonomous exclusion or
            irreversible clinical decision-making.
          </p>
        </section>
      </div>
      {resetConfirm && <ConfirmationModal title="Reset demo data" description="Restore all synthetic patients, care gaps, outreach, campaigns, data-source states and audit activity to the deterministic seed state?" confirmLabel="Reset demo" close={() => setResetConfirm(false)} onConfirm={() => { reset(); toast.success("Demo data reset"); }} />}
    </>
  );
}
export default function App() {
  return <Shell />;
}
