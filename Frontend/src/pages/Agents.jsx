import { useNavigate } from "react-router-dom";
import "./Agents.css";

const agents = [
  {
    id: "brand-strategy",
    name: "Brand Strategy Agent",
    description: "Helps create strategies for companies.",
    icon: "✨"
  },
  {
    id: "landing-page",
    name: "Landing Page Agent",
    description: "Generates high-conversion, responsive landing pages for your business.",
    icon: "🖥️"
  }
];

const Agents = () => {
  const navigate = useNavigate();

  const handleNavigate = id => navigate(`/agents/${id}`);

  return (
    <div className="agents-page">
      <header className="agents-hero">
        <p className="hero-tag">AI-POWERED TEAM</p>
        <h1>Choose the right agent for your workflow</h1>
        <p className="hero-subtitle">
          Jump into specialized assistants that accelerate brand strategy, landing pages,
          and more—built for teams who move fast.
        </p>
      </header>

      <section className="agents-grid">
        {agents.map(agent => (
          <article
            key={agent.id}
            className="agent-card"
            onClick={() => handleNavigate(agent.id)}
            onKeyDown={e => (e.key === "Enter" || e.key === " ") && handleNavigate(agent.id)}
            tabIndex={0}
            role="button"
            aria-label={`Open ${agent.name}`}
          >
            <div className="agent-icon">{agent.icon}</div>
            <div className="agent-content">
              <h2>{agent.name}</h2>
              <p>{agent.description}</p>
            </div>
            <span className="agent-cta">Open agent →</span>
          </article>
        ))}
      </section>
    </div>
  );
};

export default Agents; 