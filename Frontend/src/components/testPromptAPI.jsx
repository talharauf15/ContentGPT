//access it on this route:http://localhost:5173/test-prompt
import { useState } from "react";
import { createPrompt } from "../api/promptAPI";

const TestPromptAPI = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await createPrompt(prompt);
      setResponse(result);
      setPrompt("");
    } catch (error) {
      console.error("❌ Error:", error);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Create a Prompt</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter your prompt"
          style={{ width: "300px", marginRight: "10px" }}
        />
        <button type="submit">Submit</button>
      </form>

      {response && (
        <div style={{ marginTop: "20px" }}>
          <h4>✅ Prompt Saved:</h4>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  );
};

export default TestPromptAPI;