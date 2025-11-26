import PromptLogList from "../components/PromptLogList";
import "./Logs.css";
import { FileText, Clock, RefreshCcw } from "lucide-react";

const insights = [
  { label: "Total Prompts", value: "1,248", sub: "All-time generated" },
  { label: "Avg. Response Time", value: "2.4s", sub: "Across providers" },
  { label: "This Week", value: "+182", sub: "New interactions" },
];

const Logs = () => (
  <section className="logs-page">
    <header className="logs-hero">
      <div>
        <p className="hero-eyebrow">Workspace history</p>
        <h1>Trace every conversation with audit-ready detail.</h1>
        <p className="hero-subtext">
          Search, filter, and export prompt logs so teams can reuse winning prompts and monitor agent output.
        </p>
      </div>
      <div className="hero-actions">
        <button className="outline-btn">
          <Clock size={16} />
          Last 30 days
        </button>
        <button className="primary-btn">
          <RefreshCcw size={16} />
          Refresh logs
        </button>
      </div>
    </header>

    <section className="logs-insights">
      {insights.map(({ label, value, sub }) => (
        <article key={label} className="insight-card">
          <p className="insight-label">{label}</p>
          <div className="insight-value">{value}</div>
          <span className="insight-sub">{sub}</span>
        </article>
      ))}
    </section>

    <section className="logs-table-shell">
      <div className="logs-table-header">
        <div className="table-title">
          <FileText size={18} />
          <div>
            <h2>Prompt history</h2>
            <p>Newest events first. Click any row for the full conversation context.</p>
          </div>
        </div>
      </div>
      <div className="logs-table-body">
        <PromptLogList />
      </div>
    </section>
  </section>
);

export default Logs;
