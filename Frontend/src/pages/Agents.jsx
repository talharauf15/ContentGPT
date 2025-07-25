import { useNavigate } from "react-router-dom";

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
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Available Agents</h1>
      <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', marginTop: '2rem' }}>
        {agents.map(agent => (
          <div
            key={agent.id}
            onClick={() => navigate(`/agents/${agent.id}`)}
            style={{
              cursor: 'pointer',
              border: '1px solid #ccc',
              borderRadius: '12px',
              padding: '2rem',
              minWidth: '220px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
              transition: 'box-shadow 0.2s',
              background: '#fff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
            tabIndex={0}
            onKeyDown={e => (e.key === 'Enter' || e.key === ' ') && navigate(`/agents/${agent.id}`)}
          >
            <div style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>{agent.icon}</div>
            <h2 style={{ margin: 0 }}>{agent.name}</h2>
            <p style={{ color: '#666', marginTop: '0.5rem', textAlign: 'center' }}>{agent.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Agents; 