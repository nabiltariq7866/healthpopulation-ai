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
import type { GapStatus, Patient, Role } from "./types";
import {
  CampaignPerformance,
  CareGapBadge,
  RiskTierBadge,
} from "./components/product/ProductComponents";
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
          'button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
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
function Shell() {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [role, setRole] = [
    useAppStore((s) => s.role),
    useAppStore((s) => s.setRole),
  ];
  const nav = useNavigate();
  const patients = useAppStore((s) => s.patients);
  const results =
    search.length > 1
      ? patients
          .filter((p) =>
            (p.name + p.id + p.conditions.join())
              .toLowerCase()
              .includes(search.toLowerCase()),
          )
          .slice(0, 5)
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
            <span>
              <b>Northshire Integrated Care Network</b>
              <small>128,420 patients</small>
            </span>
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
              <div className="search-results">
                {results.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      nav(`/patients/${p.id}`);
                      setSearch("");
                    }}
                  >
                    <b>{p.name}</b>
                    <span>
                      {p.id} · {p.conditions.join(", ")}
                    </span>
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
            onClick={() => setNotificationsOpen((value) => !value)}
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
                <Badge tone="rose">5 new</Badge>
              </div>
              {[
                [
                  "High-risk cohort increased",
                  "High Diabetes Risk · 12 min ago",
                ],
                ["Outreach follow-up overdue", "Maria Collins · 28 min ago"],
                ["New readmission-risk patient", "Population feed · 1 hr ago"],
                [
                  "Campaign response received",
                  "Cardiovascular Recovery · 2 hr ago",
                ],
                [
                  "Some source records are stale",
                  "Pharmacy feed · review freshness",
                ],
              ].map(([title, detail]) => (
                <button key={title} onClick={() => setNotificationsOpen(false)}>
                  <b>{title}</b>
                  <span>{detail}</span>
                </button>
              ))}
            </div>
          )}
          <select
            aria-label="Current role"
            value={role}
            onChange={(e) => setRole(e.target.value as Role)}
          >
            {[
              "Population Health Director",
              "Care Manager",
              "Primary Care Clinician",
              "Chronic Disease Nurse",
              "Preventive Care Coordinator",
              "Analyst",
              "Administrator",
            ].map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
          <div className="avatar">EH</div>
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
function Overview() {
  const nav = useNavigate();
  const ps = useAppStore((s) => s.patients);
  const outreach = useAppStore((s) => s.outreach);
  const open = ps
    .flatMap((p) => p.gaps)
    .filter((g) => g.status === "Open").length;
  const diabetesDelta =
    ps.find((p) => p.name === "Maria Collins")?.gaps[0].status === "Open"
      ? 0
      : 1;
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
          value={fmt(aggregate.diabetes - diabetesDelta)}
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
          value={fmt(aggregate.cardioScreening)}
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
  return (
    <section className="card ai-card">
      <div className="ai-title">
        <span>
          <Brain size={19} />
        </span>
        <div>
          <small>AI POPULATION INSIGHT</small>
          <h2>Combined risk and follow-up opportunity</h2>
        </div>
      </div>
      <p>
        <b>742 patients</b> in the High Diabetes Risk demo cohort also have an
        overdue follow-up requirement.
      </p>
      <div className="recommend">
        <small>RECOMMENDED OPERATIONAL ACTION</small>
        <p>
          Prioritize patients with both high-risk status and unresolved
          follow-up gaps for care-team review.
        </p>
      </div>
      <div className="evidence">
        <span>Laboratory records</span>
        <span>Appointment history</span>
        <span>Pharmacy history</span>
      </div>
      <NavLink className="text-link" to="/diabetes">
        Review cohort <ChevronRight size={15} />
      </NavLink>
      <footer>
        <ShieldCheck size={15} /> AI-generated population-management insight.
        Not a clinical diagnosis.
      </footer>
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
    .filter(
      (p) =>
        (p.name + p.id + p.conditions)
          .toLowerCase()
          .includes(q.toLowerCase()) &&
        (risk === "All" || p.risk === risk) &&
        (condition === "All" || p.conditions.includes(condition)) &&
        (gap === "All" ||
          (gap === "Open"
            ? p.gaps.some((g) => g.status === "Open")
            : p.gaps.every((g) => g.status !== "Open"))) &&
        (adherence === "All" ||
          (adherence === "Concern") === p.medicationRisk) &&
        (utilization === "All" ||
          (utilization === "High"
            ? p.edVisits >= 3 || p.admissions >= 2
            : p.edVisits < 3 && p.admissions < 2)) &&
        (manager === "All" ||
          (manager === "Unassigned"
            ? p.manager === "Unassigned"
            : p.manager === manager)) &&
        (age === "All" || (age === "65+" ? p.age >= 65 : p.age < 65)) &&
        (contact === "All" ||
          (new Date("2026-08-14").getTime() -
            new Date(p.lastContact).getTime()) /
            864e5 >
            30) &&
        (readmission === "All" || p.cohorts.includes("High Readmission Risk")),
    );
  return (
    <>
      <PageHead
        title="Patient Registry"
        sub="Representative synthetic patients across population cohorts and care-management workflows."
        action={<Badge tone="green">{rows.length} detailed records</Badge>}
      />
      <section className="card table-card">
        <div className="toolbar">
          <div className="input">
            <Search size={16} />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search name, ID or condition"
            />
          </div>
          <select
            aria-label="Filter by risk"
            value={risk}
            onChange={(e) => setRisk(e.target.value)}
          >
            <option>All</option>
            <option>Low</option>
            <option>Moderate</option>
            <option>High</option>
            <option>Priority Review</option>
          </select>
          <select
            aria-label="Filter by condition"
            value={condition}
            onChange={(e) => setCondition(e.target.value)}
          >
            <option>All</option>
            <option>Diabetes</option>
            <option>Cardiovascular</option>
            <option>Hypertension</option>
            <option>COPD</option>
          </select>
          <select
            aria-label="Filter by care gap"
            value={gap}
            onChange={(e) => setGap(e.target.value)}
          >
            <option>All</option>
            <option>Open</option>
            <option>Resolved</option>
          </select>
          <select
            aria-label="Filter by medication adherence"
            value={adherence}
            onChange={(e) => setAdherence(e.target.value)}
          >
            <option>All</option>
            <option>Concern</option>
            <option>No concern</option>
          </select>
          <select
            aria-label="Filter by utilization"
            value={utilization}
            onChange={(e) => setUtilization(e.target.value)}
          >
            <option>All</option>
            <option>High</option>
            <option>Standard</option>
          </select>
          <select
            aria-label="Filter by care manager"
            value={manager}
            onChange={(e) => setManager(e.target.value)}
          >
            <option>All</option>
            <option>Unassigned</option>
            <option>Olivia Bennett</option>
            <option>Sofia Malik</option>
            <option>Noah Williams</option>
          </select>
          <select
            aria-label="Filter by age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          >
            <option>All</option>
            <option>Under 65</option>
            <option>65+</option>
          </select>
          <select
            aria-label="Filter by last contact"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
          >
            <option>All</option>
            <option>Over 30 days</option>
          </select>
          <select
            aria-label="Filter by readmission risk"
            value={readmission}
            onChange={(e) => setReadmission(e.target.value)}
          >
            <option>All</option>
            <option>High readmission risk</option>
          </select>
          <button
            className="secondary"
            onClick={() => toast.success("Demo list exported")}
          >
            Export demo list
          </button>
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
            onClick={() => toast.success("Selected demo list exported")}
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
            <th>Conditions</th>
            <th>
              <button className="sort-button" onClick={() => setSort("risk")}>
                Current risk {sort === "risk" ? "↓" : ""}
              </button>
            </th>
            <th>Care gaps</th>
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
              <td>{p.conditions.join(", ")}</td>
              <td>
                <RiskTierBadge risk={p.risk} />
              </td>
              <td>
                <b>{p.gaps.filter((g) => g.status === "Open").length}</b> open
              </td>
              <td>
                {p.edVisits} ED · {p.admissions} adm.
              </td>
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
  const updateGap = useAppStore((s) => s.updateGap);
  const assign = useAppStore((s) => s.assignManager);
  const plan = useAppStore((s) => s.createCarePlan);
  const role = useAppStore((s) => s.role);
  const [tab, setTab] = useState("Overview");
  const [modal, setModal] = useState(false);
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
        <div className="patient-avatar">
          {p.name
            .split(" ")
            .map((x) => x[0])
            .join("")}
        </div>
        <div>
          <span className="eyebrow">{p.id} · Synthetic patient</span>
          <h1>{p.name}</h1>
          <p>
            Age {p.age} · {p.conditions.join(" · ")}
          </p>
        </div>
        <div className="patient-status">
          <Badge tone="rose">{p.risk}</Badge>
          <span>
            Care manager <b>{p.manager}</b>
          </span>
        </div>
        <button
          className="secondary"
          disabled={!can(role, "carePlan")}
          onClick={() => {
            assign(p.id, "Olivia Bennett");
            toast.success("Care manager assigned");
          }}
        >
          Assign manager
        </button>
        <button
          className="primary"
          disabled={!can(role, "outreach")}
          onClick={() => setModal(true)}
        >
          <Plus size={16} /> Create outreach
        </button>
      </div>
      <div className="tabs">
        {[
          "Overview",
          "Risk Profile",
          "Conditions",
          "Care Gaps",
          "Medications",
          "Screenings",
          "Utilization",
          "Outreach",
          "Care Plan",
          "Timeline",
        ].map((x) => (
          <button
            className={tab === x ? "active" : ""}
            onClick={() => setTab(x)}
            key={x}
          >
            {x}
          </button>
        ))}
      </div>
      {tab === "Overview" || tab === "Risk Profile" ? (
        <div className="grid patient-grid">
          <section className="card span2">
            <div className="card-head">
              <h2>AI population summary</h2>
              <Badge tone="violet">Requires care-team review</Badge>
            </div>
            <p>
              {p.name} is part of the <b>{p.cohorts.join(" and ")}</b> cohort
              {p.cohorts.length > 1 ? "s" : ""}.{" "}
              {p.gaps.filter((g) => g.status === "Open").length} unresolved care
              gap(s) and {p.edVisits} emergency encounter(s) are visible in the
              demo record.
            </p>
            <div className="signals">
              {p.signals.map((s) => (
                <div key={s.title}>
                  <span className="signal-icon">
                    <Brain size={16} />
                  </span>
                  <div>
                    <b>{s.title}</b>
                    <p>{s.evidence}</p>
                    <small>
                      <Database size={13} />
                      {s.source} · {s.date}
                    </small>
                  </div>
                </div>
              ))}
            </div>
            <footer className="disclaimer">
              <ShieldCheck size={15} /> Demo risk model. Not validated for
              clinical use. Human review required.
            </footer>
          </section>
          <section className="card">
            <h2>Current care gaps</h2>
            {p.gaps.map((g) => (
              <div className="gap" key={g.id}>
                <div>
                  <b>{g.type}</b>
                  <small>
                    {g.condition} · Due {g.due}
                  </small>
                </div>
                <Badge
                  tone={
                    g.status === "Completed"
                      ? "green"
                      : g.status === "Scheduled"
                        ? "blue"
                        : "gold"
                  }
                >
                  {g.status}
                </Badge>
                {g.status === "Open" && (
                  <button
                    className="text-link"
                    disabled={!can(role, "screening")}
                    onClick={() => {
                      updateGap(p.id, g.id, "Scheduled");
                      toast.success("Care gap scheduled");
                    }}
                  >
                    Schedule
                  </button>
                )}
              </div>
            ))}
          </section>
          <section className="card">
            <h2>Care-management status</h2>
            <div className="status-block">
              <span>
                <UserRound />
              </span>
              <div>
                <small>Assigned manager</small>
                <b>{p.manager}</b>
              </div>
            </div>
            <div className="status-block">
              <span>
                <BriefcaseMedical />
              </span>
              <div>
                <small>Management status</small>
                <b>{p.status}</b>
              </div>
            </div>
            {p.status === "Unmanaged" && (
              <button
                className="primary full"
                disabled={!can(role, "carePlan")}
                onClick={() => {
                  plan(p.id);
                  toast.success("Active management plan created");
                }}
              >
                Create care plan
              </button>
            )}
          </section>
        </div>
      ) : (
        <DetailTab p={p} tab={tab} />
      )}{" "}
      {modal && <OutreachModal patient={p} close={() => setModal(false)} />}
    </>
  );
}
function DetailTab({ p, tab }: { p: Patient; tab: string }) {
  const rows =
    tab === "Timeline"
      ? p.timeline
      : tab === "Care Gaps"
        ? p.gaps.map((g) => ({ date: g.due, type: g.type, detail: g.status }))
        : p.signals.map((s) => ({
            date: s.date,
            type: s.source,
            detail: s.evidence,
          }));
  return (
    <section className="card">
      <div className="card-head">
        <div>
          <h2>{tab}</h2>
          <p>Connected synthetic patient context and source traceability</p>
        </div>
      </div>
      <div className="timeline">
        {rows.map((x: any, i) => (
          <div key={i}>
            <i />
            <time>{x.date}</time>
            <span>
              <b>{x.type}</b>
              <p>{x.detail}</p>
            </span>
          </div>
        ))}
      </div>
    </section>
  );
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
  return (
    <div
      className="overlay"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
    >
      <div
        ref={dialogRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="out-title"
      >
        <button className="modal-x" onClick={close}>
          <X />
        </button>
        <span className="modal-icon">
          <MessageSquareMore />
        </span>
        <h2 id="out-title">Create patient outreach</h2>
        <p>Plan a simulated contact action for {patient.name}.</p>
        <label>
          Reason
          <input
            value={patient.gaps[0]?.type || "Care-management follow-up"}
            readOnly
          />
        </label>
        <div className="form-row">
          <label>
            Channel
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
            >
              <option>Phone</option>
              <option>SMS</option>
              <option>Email</option>
              <option>Patient Portal</option>
              <option>Letter</option>
            </select>
          </label>
          <label>
            Assigned to
            <select value={owner} onChange={(e) => setOwner(e.target.value)}>
              <option>Olivia Bennett</option>
              <option>Sofia Malik</option>
              <option>Noah Williams</option>
            </select>
          </label>
        </div>
        <label>
          Follow-up date
          <input type="date" defaultValue="2026-08-18" />
        </label>
        <div className="modal-actions">
          <button className="secondary" onClick={close}>
            Cancel
          </button>
          <button
            className="primary"
            onClick={() => {
              create({
                patientId: patient.id,
                reason: patient.gaps[0]?.type || "Care follow-up",
                channel,
                owner,
                status: "Planned",
                followUp: "2026-08-18",
              });
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
      <Registry
        filter={(p) => p.risk === "High" || p.risk === "Priority Review"}
      />
    </>
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
  const c = config[type],
    ps = useAppStore((s) => s.patients),
    nav = useNavigate();
  const rows = ps.filter((p) => p.cohorts.includes(c.cohort));
  return (
    <>
      <PageHead
        title={c.title}
        sub={c.sub}
        action={
          <button className="primary" onClick={() => nav("/cohorts")}>
            <Waypoints size={16} /> Open cohort builder
          </button>
        }
      />
      <div className="stats-grid compact">
        {c.metrics.map((x, i) => (
          <Stat
            key={x[0]}
            label={x[0]}
            value={x[1]}
            tone={i === 1 ? "rose" : i === 2 ? "gold" : "blue"}
          />
        ))}
      </div>
      <div className="grid two">
        <section className="card span2">
          <div className="card-head">
            <div>
              <h2>{c.cohort}</h2>
              <p>Representative detailed records within the aggregate cohort</p>
            </div>
            <Badge>{rows.length} sample patients</Badge>
          </div>
          <PatientTable rows={rows} onOpen={(p) => nav(`/patients/${p.id}`)} />
        </section>
        <InsightCard />
      </div>
    </>
  );
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
                  <td>{p.conditions[0]} therapy</td>
                  <td>
                    <Badge tone="gold">Potential gap</Badge>
                  </td>
                  <td>Requires confirmation</td>
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
  const ps = useAppStore((s) => s.patients),
    nav = useNavigate(),
    saved = useAppStore((s) => s.savedCohorts),
    saveCohort = useAppStore((s) => s.saveCohort),
    role = useAppStore((s) => s.role);
  const [condition, setCondition] = useState("Diabetes"),
    [risk, setRisk] = useState("High"),
    [gap, setGap] = useState("Overdue"),
    [contact, setContact] = useState(">30 days");
  const result = ps.filter(
    (p) =>
      p.conditions.includes(condition) &&
      (risk === "Any" || p.risk === risk) &&
      (!gap || p.gaps.some((g) => g.status === "Open")),
  );
  return (
    <>
      <PageHead
        title="Cohorts"
        sub="Build and save transparent population segments for coordinated operational action."
      />
      <div className="grid cohort-layout">
        <section className="card builder">
          <div className="card-head">
            <div>
              <h2>Cohort Builder</h2>
              <p>All rules must match (AND)</p>
            </div>
            <Badge tone="violet">Deterministic demo logic</Badge>
          </div>
          {[
            [
              "Condition",
              condition,
              setCondition,
              ["Diabetes", "Cardiovascular", "Hypertension", "COPD"],
            ],
            [
              "Risk tier",
              risk,
              setRisk,
              ["High", "Priority Review", "Moderate", "Any"],
            ],
            ["Care gap", gap, setGap, ["Overdue", "Any"]],
            ["Last contact", contact, setContact, [">30 days", "Any"]],
          ].map((r: any, i) => (
            <div className="rule" key={r[0]}>
              <span>{i + 1}</span>
              <label>
                {r[0]}
                <select value={r[1]} onChange={(e) => r[2](e.target.value)}>
                  {r[3].map((x: string) => (
                    <option key={x}>{x}</option>
                  ))}
                </select>
              </label>
              <Badge tone="blue">{i ? "AND" : "WHERE"}</Badge>
            </div>
          ))}
          <div className="cohort-result">
            <div>
              <small>ESTIMATED POPULATION</small>
              <b>
                {condition === "Diabetes" &&
                risk === "High" &&
                gap === "Overdue" &&
                contact === ">30 days"
                  ? "742"
                  : fmt(result.length * 127)}
              </b>
              <span>patients match this dynamic segment</span>
            </div>
            <button
              className="primary"
              disabled={!can(role, "cohorts")}
              onClick={() => {
                saveCohort({
                  name: `${condition} ${risk} — ${gap}`,
                  description: `${risk} ${condition} patients with ${gap.toLowerCase()} care requirements and ${contact.toLowerCase()} last contact`,
                  owner: "Dr. Eleanor Hayes",
                  refreshBehavior: "Dynamic",
                  rules: [
                    { field: "Condition", value: condition },
                    { field: "Risk", value: risk },
                    { field: "Care gap", value: gap },
                    { field: "Last contact", value: contact },
                  ],
                });
                toast.success("Cohort saved");
              }}
            >
              Save cohort
            </button>
          </div>
        </section>
        <section className="card">
          <h2>Saved cohorts</h2>
          {saved.map((x, i) => (
            <button
              className="saved-cohort"
              key={x.id}
              onClick={() =>
                nav(
                  i === 1
                    ? "/cardiovascular"
                    : i === 2
                      ? "/readmission"
                      : "/diabetes",
                )
              }
            >
              <span>
                <Waypoints />
              </span>
              <div>
                <b>{x.name}</b>
                <small>
                  {i === 0 ? "742" : i === 1 ? "6,019" : "1,203"} patients ·
                  {x.id} · {x.refreshBehavior} · {x.owner}
                </small>
              </div>
              <ChevronRight />
            </button>
          ))}
        </section>
      </div>
    </>
  );
}
function CareGaps() {
  const ps = useAppStore((s) => s.patients),
    update = useAppStore((s) => s.updateGap),
    override = useAppStore((s) => s.overrideGap),
    role = useAppStore((s) => s.role);
  const gaps = ps.flatMap((p) => p.gaps.map((g) => ({ p, g })));
  return (
    <>
      <PageHead
        title="Care Gaps"
        sub="Track each gap from detection through outreach, scheduling and completion."
      />
      <section className="card table-card">
        <div className="toolbar">
          <Badge tone="gold">
            {gaps.filter((x) => x.g.status === "Open").length} open sample gaps
          </Badge>
          <span className="muted">Aggregate open gaps: 9,184</span>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>Patient</th>
                <th>Gap</th>
                <th>Due date</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Action</th>
                <th>Human review</th>
              </tr>
            </thead>
            <tbody>
              {gaps.map(({ p, g }) => (
                <tr key={g.id}>
                  <td>
                    <NavLink to={`/patients/${p.id}`} className="text-link">
                      {p.name}
                      <small>{p.id}</small>
                    </NavLink>
                  </td>
                  <td>
                    <b>{g.type}</b>
                    <small>{g.condition}</small>
                  </td>
                  <td>{g.due}</td>
                  <td>
                    <Badge tone={g.priority === "High" ? "rose" : "gold"}>
                      {g.priority}
                    </Badge>
                  </td>
                  <td>
                    <CareGapBadge status={g.status} />
                  </td>
                  <td>
                    <select
                      aria-label={`Update ${g.type}`}
                      value={g.status}
                      disabled={g.status === "Completed"}
                      onChange={(e) => {
                        update(p.id, g.id, e.target.value as GapStatus);
                        toast.success(`Care gap marked ${e.target.value}`);
                      }}
                    >
                      {[
                        "Open",
                        "Outreach Planned",
                        "Contacted",
                        "Scheduled",
                        "In Progress",
                        "Completed",
                        "Unable to Reach",
                        "Deferred",
                      ].map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <button
                      className="secondary"
                      disabled={
                        g.status === "Completed" || !can(role, "carePlan")
                      }
                      onClick={() => {
                        const reason = window.prompt(
                          "Reason for human override (for example: completed externally)",
                        );
                        if (reason?.trim()) {
                          override(p.id, g.id, reason);
                          toast.success("Gap resolved with external evidence");
                        }
                      }}
                    >
                      Resolve with evidence
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </>
  );
}
function Outreach() {
  const os = useAppStore((s) => s.outreach),
    ps = useAppStore((s) => s.patients),
    update = useAppStore((s) => s.updateOutreach),
    campaigns = useAppStore((s) => s.campaigns),
    launch = useAppStore((s) => s.launchCampaign),
    simulate = useAppStore((s) => s.simulateCampaign),
    closeCampaign = useAppStore((s) => s.closeCampaign),
    role = useAppStore((s) => s.role);
  const [campaignBuilder, setCampaignBuilder] = useState(false);
  return (
    <>
      <PageHead
        title="Outreach"
        sub="Coordinate patient work queues and controlled synthetic campaigns."
        action={
          <button
            className="primary"
            disabled={!can(role, "outreach")}
            onClick={() => setCampaignBuilder(true)}
          >
            <Plus /> Create campaign
          </button>
        }
      />
      <div className="stats-grid compact">
        <Stat
          label="Planned outreach"
          value={fmt(186 + os.filter((x) => x.status === "Planned").length)}
          tone="gold"
        />
        <Stat label="Contacted this week" value="134" tone="green" />
        <Stat label="Awaiting response" value="52" />
        <Stat
          label="Appointments scheduled"
          value={fmt(41 + campaigns.reduce((a, c) => a + c.scheduled, 0))}
          tone="green"
        />
      </div>
      <div className="grid two">
        <section className="card span2">
          <div className="card-head">
            <h2>Patient outreach queue</h2>
            <Badge>{os.length} demo actions</Badge>
          </div>
          {os.length ? (
            <div className="table-wrap">
              <table>
                <thead>
                  <tr>
                    <th>Patient</th>
                    <th>Reason</th>
                    <th>Channel</th>
                    <th>Owner</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {os.map((o) => (
                    <tr key={o.id}>
                      <td>
                        {ps.find((p) => p.id === o.patientId)?.name}
                        <small>{o.patientId}</small>
                      </td>
                      <td>{o.reason}</td>
                      <td>{o.channel}</td>
                      <td>{o.owner}</td>
                      <td>
                        <Badge>{o.status}</Badge>
                      </td>
                      <td>
                        <button
                          className="secondary"
                          disabled={
                            o.status === "Contacted" || !can(role, "outreach")
                          }
                          onClick={() => {
                            update(o.id, "Contacted");
                            toast.success("Patient marked contacted");
                          }}
                        >
                          Mark contacted
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty">
              <MessageSquareMore />
              <h3>No patient outreach created yet</h3>
              <p>
                Open a patient record to create the first simulated outreach
                action.
              </p>
            </div>
          )}
        </section>
        <section className="card">
          <div className="card-head">
            <div>
              <h2>Campaigns</h2>
              <p>Preventive outreach performance</p>
            </div>
          </div>
          {campaigns.map((c) => (
            <div className="campaign" key={c.id}>
              <div>
                <Badge tone={c.status === "Active" ? "green" : "gold"}>
                  {c.status}
                </Badge>
                <small>{c.id}</small>
              </div>
              <h3>{c.name}</h3>
              <p>
                {c.cohort} · {c.targeted} targeted
              </p>
              <CampaignPerformance
                targeted={c.targeted}
                delivered={c.delivered}
                responses={c.responses}
                scheduled={c.scheduled}
              />
              <div className="campaign-actions">
                {c.status === "Draft" && (
                  <button
                    className="primary"
                    disabled={!can(role, "outreach")}
                    onClick={() => {
                      launch(c.id);
                      toast.success("Demo campaign launched");
                    }}
                  >
                    Launch demo
                  </button>
                )}
                {c.status === "Active" && (
                  <>
                    <button
                      className="primary"
                      disabled={!can(role, "outreach")}
                      onClick={() => {
                        simulate(c.id);
                        toast.success("Campaign responses simulated");
                      }}
                    >
                      Simulate responses
                    </button>
                    <button
                      className="secondary"
                      disabled={!can(role, "outreach")}
                      onClick={() => {
                        closeCampaign(c.id);
                        toast.success("Campaign closed");
                      }}
                    >
                      Close campaign
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </section>
        <section className="card">
          <h2>Campaign response mix</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={[
                  { n: "Interested", v: 42 },
                  { n: "No response", v: 48 },
                  { n: "Declined", v: 6 },
                  { n: "Completed externally", v: 4 },
                ]}
                dataKey="v"
                nameKey="n"
                innerRadius={60}
                outerRadius={88}
              >
                {["#2E8A72", "#DDD8E3", "#B85867", "#4E79A7"].map((c) => (
                  <Cell key={c} fill={c} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </section>
      </div>
      {campaignBuilder && (
        <CampaignBuilder close={() => setCampaignBuilder(false)} />
      )}
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
    <div
      className="overlay"
      onMouseDown={(e) => e.target === e.currentTarget && close()}
      onKeyDown={(e) => e.key === "Escape" && close()}
    >
      <div
        ref={dialogRef}
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="campaign-title"
      >
        <button
          className="modal-x"
          onClick={close}
          aria-label="Close campaign builder"
        >
          <X />
        </button>
        <span className="modal-icon">
          <MessageSquareMore />
        </span>
        <h2 id="campaign-title">Create outreach campaign</h2>
        <p>
          Build a controlled synthetic campaign, preview its eligible
          population, then save it as a launchable draft.
        </p>
        <label>
          Campaign name
          <input value={name} onChange={(e) => setName(e.target.value)} />
        </label>
        <label>
          Target cohort
          <select value={cohort} onChange={(e) => setCohort(e.target.value)}>
            <option>Cardiovascular Screening Gap</option>
            <option>High Diabetes Risk</option>
            <option>High Readmission Risk</option>
            <option>Uncontrolled Hypertension</option>
          </select>
        </label>
        <div className="form-row">
          <label>
            Channel
            <select
              value={channel}
              onChange={(e) => setChannel(e.target.value)}
            >
              <option>Patient Portal</option>
              <option>SMS</option>
              <option>Email</option>
              <option>Phone</option>
              <option>Letter</option>
            </select>
          </label>
          <label>
            Audience
            <input
              type="number"
              min="1"
              max="500"
              value={audience}
              onChange={(e) => setAudience(Number(e.target.value))}
            />
          </label>
        </div>
        <div className="cohort-result">
          <div>
            <small>ELIGIBLE DEMO POPULATION</small>
            <b>{audience > 0 ? fmt(audience) : "0"}</b>
            <span>
              {cohort} via {channel}
            </span>
          </div>
        </div>
        {audience <= 0 && (
          <p role="alert" className="error-text">
            Campaign contains no eligible patients.
          </p>
        )}
        <div className="modal-actions">
          <button className="secondary" onClick={close}>
            Cancel
          </button>
          <button
            className="primary"
            disabled={!name.trim() || audience <= 0}
            onClick={() => {
              create(name, cohort, audience);
              toast.success("Campaign draft created");
              close();
            }}
          >
            Create draft
          </button>
        </div>
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
  const ps = useAppStore((s) => s.patients),
    plan = useAppStore((s) => s.createCarePlan);
  return (
    <>
      <PageHead
        title="Care Plans"
        sub="Human-owned goals, monitoring and follow-up for active management."
      />
      <section className="card">
        <div className="card-head">
          <h2>Patient management plans</h2>
          <Badge tone="green">
            {ps.filter((p) => p.status === "Active Management").length} active
            sample plans
          </Badge>
        </div>
        {ps.map((p) => (
          <div className="plan-row" key={p.id}>
            <span className="condition-icon">
              <BriefcaseMedical />
            </span>
            <div>
              <b>
                {p.name} — {p.conditions[0]} Follow-up Plan
              </b>
              <small>
                {p.id} · Owner: {p.manager}
              </small>
            </div>
            <Badge tone={p.status === "Active Management" ? "green" : "gold"}>
              {p.status}
            </Badge>
            {p.status === "Unmanaged" && (
              <button
                className="secondary"
                onClick={() => {
                  plan(p.id);
                  toast.success("Care plan created");
                }}
              >
                Create plan
              </button>
            )}
          </div>
        ))}
      </section>
    </>
  );
}
function Tasks() {
  const tasks = useAppStore((s) => s.tasks),
    complete = useAppStore((s) => s.completeTask),
    create = useAppStore((s) => s.createTask),
    ps = useAppStore((s) => s.patients);
  return (
    <>
      <PageHead
        title="Follow-up Tasks"
        sub="Assigned operational work with clear ownership and due dates."
        action={
          <button
            className="primary"
            onClick={() => {
              create({
                patientId: ps[0].id,
                action: "Book diabetes review",
                owner: "Olivia Bennett",
                due: "2026-08-18",
                priority: "High",
                status: "Open",
              });
              toast.success("Follow-up task created");
            }}
          >
            <Plus /> Add demo task
          </button>
        }
      />
      <section className="card">
        <div className="card-head">
          <h2>Today’s priority actions</h2>
          <Badge tone="violet">AI-assisted ordering</Badge>
        </div>
        {tasks.length ? (
          tasks.map((t) => (
            <div className="plan-row" key={t.id}>
              <span className="condition-icon">
                <ClipboardCheck />
              </span>
              <div>
                <b>{t.action}</b>
                <small>
                  {ps.find((p) => p.id === t.patientId)?.name} · Due {t.due} ·{" "}
                  {t.owner}
                </small>
              </div>
              <Badge tone={t.status === "Completed" ? "green" : "rose"}>
                {t.status}
              </Badge>
              <button
                disabled={t.status === "Completed"}
                className="secondary"
                onClick={() => complete(t.id)}
              >
                Complete
              </button>
            </div>
          ))
        ) : (
          <div className="empty">
            <ClipboardCheck />
            <h3>No follow-up tasks</h3>
            <p>Create a demo task to add it to the connected work queue.</p>
          </div>
        )}
      </section>
    </>
  );
}
function Screening() {
  const ps = useAppStore((s) => s.patients),
    update = useAppStore((s) => s.updateGap);
  const rows = ps.flatMap((p) =>
    p.gaps.filter((g) => g.type.includes("Review")).map((g) => ({ p, g })),
  );
  return (
    <>
      <PageHead
        title="Preventive Screening"
        sub="Move screening gaps from detection to outreach, scheduling and completion."
      />
      <div className="stats-grid compact">
        <Stat label="Overdue" value="6,019" tone="gold" />
        <Stat label="Scheduled" value="1,284" />
        <Stat label="Completed this quarter" value="3,746" tone="green" />
        <Stat label="Completion rate" value="72.4%" tone="green" />
      </div>
      <section className="card">
        {rows.map(({ p, g }) => (
          <div className="plan-row" key={g.id}>
            <span className="condition-icon">
              <CalendarCheck />
            </span>
            <div>
              <b>
                {p.name} — {g.type}
              </b>
              <small>
                Due {g.due} · {p.id}
              </small>
            </div>
            <Badge
              tone={
                g.status === "Completed"
                  ? "green"
                  : g.status === "Scheduled"
                    ? "blue"
                    : "gold"
              }
            >
              {g.status}
            </Badge>
            {g.status !== "Completed" && (
              <button
                className="secondary"
                onClick={() => {
                  update(
                    p.id,
                    g.id,
                    g.status === "Scheduled" ? "Completed" : "Scheduled",
                  );
                  toast.success(
                    g.status === "Scheduled"
                      ? "Screening completed"
                      : "Screening scheduled",
                  );
                }}
              >
                {g.status === "Scheduled" ? "Complete" : "Schedule"}
              </button>
            )}
          </div>
        ))}
      </section>
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
  return (
    <>
      <PageHead
        title="Population Trends"
        sub="Longitudinal demo analytics for risk, care-gap closure and outreach activity."
      />
      <div className="grid two">
        <section className="card">
          <h2>Unresolved care gaps</h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area
                dataKey="gaps"
                stroke="#B85867"
                fill="#F7E9EC"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </section>
        <section className="card">
          <h2>Care gaps closed</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={trend}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="closed" fill="#2E8A72" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </section>
      </div>
    </>
  );
}
function Outcomes() {
  return (
    <>
      <PageHead
        title="Outcome Analytics"
        sub="Observed changes during simulated care-management activity without causal claims."
      />
      <div className="stats-grid compact">
        <Stat
          label="Care gaps closed"
          value="1,738"
          trend="During demo period"
          tone="green"
        />
        <Stat label="Screenings scheduled" value="1,284" tone="green" />
        <Stat label="Patients contacted" value="2,106" />
        <Stat label="Outreach response" value="42.1%" />
      </div>
      <section className="card notice">
        <ShieldCheck />
        <div>
          <h2>Responsible interpretation</h2>
          <p>
            During the demo period, unresolved care gaps decreased alongside
            simulated outreach activity. This product does not claim that AI
            caused clinical outcomes.
          </p>
        </div>
      </section>
    </>
  );
}
function DataSources() {
  const [mode, setMode] = useState<"ready" | "loading" | "error">("ready");
  const sources = [
    ["EHR", "Demo Connected", "8 minutes ago", "99.2%"],
    ["Laboratory", "Demo Connected", "12 minutes ago", "98.7%"],
    ["Pharmacy", "Attention Required", "22 minutes ago", "94.1%"],
    ["Appointments", "Demo Connected", "6 minutes ago", "99.6%"],
    ["Encounters", "Syncing", "18 minutes ago", "97.9%"],
    ["Screening", "Simulated", "35 minutes ago", "96.4%"],
  ];
  return (
    <>
      <PageHead
        title="Population Data Sources"
        sub="Transparent synthetic source coverage, freshness and data-quality context."
        action={
          <div className="page-actions">
            <button
              className="secondary"
              onClick={() => {
                setMode("loading");
                window.setTimeout(() => {
                  setMode("ready");
                  toast.success("Synthetic sources refreshed");
                }, 600);
              }}
            >
              <RefreshCw /> Refresh all
            </button>
            <button className="secondary" onClick={() => setMode("error")}>
              <AlertTriangle /> Simulate source issue
            </button>
          </div>
        }
      />
      {mode === "loading" && (
        <section className="card state-panel" role="status">
          <RefreshCw className="spin" />
          <div>
            <h2>Calculating population view…</h2>
            <p>
              Reviewing care gaps and refreshing synthetic source freshness.
            </p>
          </div>
        </section>
      )}
      {mode === "error" && (
        <section className="card state-panel error" role="alert">
          <AlertTriangle />
          <div>
            <h2>Data source unavailable</h2>
            <p>
              The simulated pharmacy source could not be refreshed. Existing
              population signals remain visible with a freshness warning.
            </p>
            <button className="secondary" onClick={() => setMode("ready")}>
              Retry connection
            </button>
          </div>
        </section>
      )}
      <div className="source-grid">
        {sources.map((x) => (
          <section className="card source" key={x[0]}>
            <span className="condition-icon">
              <Database />
            </span>
            <div>
              <h3>{x[0]}</h3>
              <Badge
                tone={
                  x[1] === "Demo Connected"
                    ? "green"
                    : x[1] === "Attention Required"
                      ? "gold"
                      : "blue"
                }
              >
                {x[1]}
              </Badge>
            </div>
            <dl>
              <div>
                <dt>Last simulated refresh</dt>
                <dd>{x[2]}</dd>
              </div>
              <div>
                <dt>Record completeness</dt>
                <dd>{x[3]}</dd>
              </div>
            </dl>
          </section>
        ))}
      </div>
      <section className="card notice">
        <AlertTriangle />
        <div>
          <h2>Data quality insight</h2>
          <p>
            1,842 synthetic records have incomplete recent-care information.
            Population risk summaries for these records should be reviewed
            cautiously.
          </p>
        </div>
      </section>
    </>
  );
}
function Integrations() {
  return (
    <>
      <PageHead
        title="Integrations"
        sub="Conceptual frontend-only connections; no live clinical systems are connected."
      />
      <div className="source-grid">
        {[
          "FHIR / EHR Gateway",
          "Laboratory Feed",
          "Pharmacy History",
          "Appointment Service",
          "Encounter Feed",
          "Screening Registry",
        ].map((x) => (
          <section className="card source" key={x}>
            <span className="condition-icon">
              <Waypoints />
            </span>
            <div>
              <h3>{x}</h3>
              <Badge tone="blue">Simulated</Badge>
            </div>
            <p>No real data exchange. Demonstration interface only.</p>
          </section>
        ))}
      </div>
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
            onClick={() => {
              if (confirm("Reset all persisted demo activity?")) {
                reset();
                toast.success("Demo data reset");
              }
            }}
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
    </>
  );
}
export default function App() {
  return <Shell />;
}
