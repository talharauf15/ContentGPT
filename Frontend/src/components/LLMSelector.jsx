
import "./LLMSelector.css";

const LLMSelector = ({ selectedProvider, onChange }) => {
  const llmProviders = [
    { label: "OpenAI", value: "openai" },
    { label: "Gemini", value: "gemini" },
    { label: "Claude", value: "claude" },
  ];

  return (
    <div className="llm-selector">
      <label>Select LLM Provider</label>
      <select value={selectedProvider} onChange={(e) => onChange(e.target.value)}>
        {llmProviders.map((provider) => (
          <option key={provider.value} value={provider.value}>
            {provider.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LLMSelector;
