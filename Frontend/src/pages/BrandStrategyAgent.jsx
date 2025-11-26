import PromptForm from "../components/PromptForm";
import { Sparkles, Target, Users, BarChart3 } from "lucide-react";
import "./BrandStrategyAgent.css";

const highlights = [
  {
    title: "Strategic Precision",
    description: "Blend human context with AI insights to produce company-specific messaging.",
    icon: Sparkles,
  },
  {
    title: "Audience Deep Dive",
    description: "Clarify personas, motivations, and emotional hooks in seconds.",
    icon: Users,
  },
  {
    title: "Outcome Focused",
    description: "Every prompt is optimized around measurable goals and clear CTAs.",
    icon: Target,
  },
  {
    title: "Executive Ready",
    description: "Generate polished briefs and launch plans that teams can trust.",
    icon: BarChart3,
  },
];

const BrandStrategyAgent = () => (
  <div className="brand-agent-page">
    <section className="brand-hero">
      <div className="hero-content">
        <p className="hero-eyebrow">Brand Strategy Workspace</p>
        <h1>Design bold narratives in minutes, not weeks.</h1>
        <p className="hero-description">
          Feed your company context once and let the agent craft positioning, messaging, and launch copy
          tailored to every campaign moment.
        </p>

        <div className="hero-stats">
          <div className="stat-card">
            <span className="stat-value">3x</span>
            <span className="stat-label">Faster campaign approvals</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">92%</span>
            <span className="stat-label">Consistency across assets</span>
          </div>
          <div className="stat-card">
            <span className="stat-value">∞</span>
            <span className="stat-label">Reusable brand recipes</span>
          </div>
        </div>
      </div>

      <div className="hero-panel">
        <div className="panel-header">
          <Sparkles className="panel-icon" />
          <div>
            <h3>What this agent unlocks</h3>
            <p>From investor decks to launch microsites—stay on brief effortlessly.</p>
          </div>
        </div>
        <ul className="panel-list">
          <li>Live model switching for OpenAI, Anthropic, and more.</li>
          <li>Guided prompts so teams supply the perfect context.</li>
          <li>Instant history logs for compliance and learning.</li>
        </ul>
      </div>
    </section>

    <section className="feature-grid">
      {highlights.map(({ title, description, icon }) => {
        const Icon = icon;
        return (
          <article key={title} className="feature-card">
            <div className="feature-icon">
              <Icon size={22} />
            </div>
            <h4>{title}</h4>
            <p>{description}</p>
          </article>
        );
      })}
    </section>

    <section className="brand-form-shell">
      <PromptForm />
    </section>
  </div>
);

export default BrandStrategyAgent;