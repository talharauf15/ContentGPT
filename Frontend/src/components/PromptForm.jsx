// import { useEffect, useState } from "react";
// import { createPromptLog } from "../api/promptLogAPI";
// import { getAllPrompts } from "../api/promptAPI";
// import { useUser } from "@clerk/clerk-react";
// import "./PromptForm.css"

// const PromptForm = () => {
//   const [prompt, setPrompt] = useState("");
//   const [response, setResponse] = useState("");
//   const [prompts, setPrompts] = useState([]);
//   const [error, setError] = useState("");
//   const [manualMode, setManualMode] = useState(true); // 🔁 Toggle state

//   const { user } = useUser(); // 🔑 Get Clerk user

//   useEffect(() => {
//     const fetchPrompts = async () => {
//       try {
//         const data = await getAllPrompts();
//         setPrompts(data);
//       } catch (err) {
//         console.error("❌ Failed to fetch prompts:", err);
//         setError("Failed to load prompts.");
//       }
//     };

//     fetchPrompts();
//   }, []);

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     if (!user) {
//       setError("User not authenticated.");
//       return;
//     }

//     try {
//       const result = await createPromptLog({
//         prompt,
//         response,
//         userId: user.id,
//         userName: user.username,
//       });

//       setResponse(result.response);
//     } catch (error) {
//       console.error("❌ Error submitting prompt:", error);
//       setResponse("Failed to save prompt log.");
//     }
//   };

//   // 🟢 When user clicks a saved prompt in 'closed' mode
//   const handleSavedPromptClick = async (selectedPrompt) => {
//     if (!user) {
//       setError("User not authenticated.");
//       return;
//     }

//     setPrompt(selectedPrompt); // Just for UI clarity
//     try {
//       const result = await createPromptLog({
//         prompt: selectedPrompt,
//         response,
//         userId: user.id,
//         userName: user.username,
//       });

//       setResponse(result.response);
//     } catch (error) {
//       console.error("❌ Error submitting saved prompt:", error);
//       setResponse("Failed to save prompt log.");
//     }
//   };

//   return (
//     <div>
//       <h2>📝 Prompt Submission</h2>

//       <button onClick={() => setManualMode(!manualMode)}>
//         {manualMode ? "🔄 Switch to Saved Prompt Mode" : "🖊️ Switch to Manual Prompt Mode"}
//       </button>

//       <hr />

//       {/* Manual Prompt Mode */}
//       {manualMode ? (
//         <form onSubmit={handleSubmit}>
//           <textarea
//             value={prompt}
//             onChange={(e) => setPrompt(e.target.value)}
//             placeholder="Write your prompt..."
//             rows={4}
//             style={{ width: "100%", marginBottom: "10px" }}
//           />
//           <button type="submit">Submit Prompt</button>
//         </form>
//       ) : (
//         <>
//           <h3>📚 Choose from Saved Prompts</h3>
//           {error && <p style={{ color: "red" }}>{error}</p>}

//           {prompts.length === 0 ? (
//             <p>No saved prompts yet.</p>
//           ) : (
//             <ul>
//               {prompts.map((item) => (
//                 <li
//                   key={item._id}
//                   onClick={() => handleSavedPromptClick(item.prompt)}
//                   style={{
//                     cursor: "pointer",
//                     marginBottom: "5px",
//                     backgroundColor: "#f2f2f2",
//                     padding: "5px",
//                     borderRadius: "5px",
//                   }}
//                 >
//                   {item.prompt}
//                   <br />
//                   <small>{new Date(item.createdAt).toLocaleString()}</small>
//                 </li>
//               ))}
//             </ul>
//           )}
//         </>
//       )}

//       {response && (
//         <p style={{ marginTop: "20px" }}>
//           <strong>✅ LLM Response:</strong> {response}
//         </p>
//       )}
//     </div>
//   );
// };

// export default PromptForm;







import { useEffect, useState } from "react";
import { Send, ToggleLeft, ToggleRight, MessageSquare, Clock, User, Sparkles, AlertCircle } from "lucide-react";
import "./PromptForm.css";
import { useUser } from "@clerk/clerk-react";

// Real API imports
import { createPromptLog } from "../api/promptLogAPI";
import { getAllPrompts } from "../api/promptAPI";

// // Mock API functions - replace with your actual API
// const createPromptLog = async (data) => {
//   // Simulate API call
//   await new Promise(resolve => setTimeout(resolve, 1000));
//   return { response: "This is a simulated LLM response to your prompt: " + data.prompt };
// };

// const getAllPrompts = async () => {
//   // Simulate API call
//   await new Promise(resolve => setTimeout(resolve, 500));
//   return [
//     { _id: "1", prompt: "Explain quantum computing in simple terms", createdAt: new Date().toISOString() },
//     { _id: "2", prompt: "Write a creative story about time travel", createdAt: new Date(Date.now() - 86400000).toISOString() },
//     { _id: "3", prompt: "Generate ideas for a mobile app", createdAt: new Date(Date.now() - 172800000).toISOString() },
//   ];
// };

// // Mock user object - replace with your Clerk user
// const mockUser = {
//   id: "user_123",
//   username: "john_doe"
// };

const PromptForm = () => {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [prompts, setPrompts] = useState([]);
  const [error, setError] = useState("");
  const [manualMode, setManualMode] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPromptId, setSelectedPromptId] = useState(null);

  const { user } = useUser(); // Clerk user

  useEffect(() => {
    const fetchPrompts = async () => {
      try {
        const data = await getAllPrompts();
        setPrompts(data);
      } catch (err) {
        console.error("❌ Failed to fetch prompts:", err);
        setError("Failed to load prompts.");
      }
    };

    fetchPrompts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setError("User not authenticated.");
      return;
    }

    if (!prompt.trim()) {
      setError("Please enter a prompt.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const result = await createPromptLog({
        prompt,
        response,
        userId: user.id,
        userName: user.username,
      });

      setResponse(result.response);
    } catch (error) {
      console.error("❌ Error submitting prompt:", error);
      setResponse("Failed to save prompt log.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavedPromptClick = async (selectedPrompt, promptId) => {
    if (!user) {
      setError("User not authenticated.");
      return;
    }

    setSelectedPromptId(promptId);
    setPrompt(selectedPrompt);
    setIsLoading(true);
    setError("");

    try {
      const result = await createPromptLog({
        prompt: selectedPrompt,
        response,
        userId: user.id,
        userName: user.username,
      });

      setResponse(result.response);
    } catch (error) {
      console.error("❌ Error submitting saved prompt:", error);
      setResponse("Failed to save prompt log.");
    } finally {
      setIsLoading(false);
      setSelectedPromptId(null);
    }
  };

  return (
    <div className="prompt-form-container">
      <div className="prompt-form-card">
        {/* Header */}
        <div className="form-header">
          <div className="header-content">
            <div className="header-icon">
              <Sparkles className="icon-sparkles" />
            </div>
            <div>
              <h2 className="form-title">AI Prompt Assistant</h2>
              <p className="form-subtitle">Create and manage your AI conversations</p>
            </div>
          </div>
          
          {/* Mode Toggle */}
          <div className="mode-toggle">
            <div className="toggle-container">
              <span className={`toggle-label ${manualMode ? 'active' : ''}`}>
                <MessageSquare className="icon-small" />
                Manual
              </span>
              <button
                onClick={() => setManualMode(!manualMode)}
                className="toggle-button"
                aria-label="Toggle input mode"
              >
                {manualMode ? (
                  <ToggleLeft className="icon-toggle" />
                ) : (
                  <ToggleRight className="icon-toggle" />
                )}
              </button>
              <span className={`toggle-label ${!manualMode ? 'active' : ''}`}>
                <Clock className="icon-small" />
                Saved
              </span>
            </div>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle className="icon-small" />
            <span>{error}</span>
          </div>
        )}

        {/* Content Area */}
        <div className="form-content">
          {manualMode ? (
            <div className="manual-mode">
              <form onSubmit={handleSubmit} className="prompt-form">
                <div className="textarea-container">
                  <textarea
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    placeholder="Enter your prompt here... Be creative and specific!"
                    rows={6}
                    className="prompt-textarea"
                    disabled={isLoading}
                  />
                  <div className="character-count">
                    {prompt.length}/1000
                  </div>
                </div>
                
                <button 
                  type="submit" 
                  className="submit-button"
                  disabled={isLoading || !prompt.trim()}
                >
                  {isLoading ? (
                    <div className="loading-spinner" />
                  ) : (
                    <Send className="icon-small" />
                  )}
                  {isLoading ? "Processing..." : "Send Prompt"}
                </button>
              </form>
            </div>
          ) : (
            <div className="saved-mode">
              <h3 className="saved-title">
                <Clock className="icon-medium" />
                Choose from Saved Prompts
              </h3>
              
              {prompts.length === 0 ? (
                <div className="empty-state">
                  <MessageSquare className="icon-large" />
                  <p>No saved prompts yet.</p>
                  <p className="text-sm">Switch to manual mode to create your first prompt!</p>
                </div>
              ) : (
                <div className="prompts-grid">
                  {prompts.map((item) => (
                    <div
                      key={item._id}
                      onClick={() => handleSavedPromptClick(item.prompt, item._id)}
                      className={`prompt-card ${selectedPromptId === item._id ? 'loading' : ''}`}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          handleSavedPromptClick(item.prompt, item._id);
                        }
                      }}
                    >
                      {selectedPromptId === item._id && (
                        <div className="card-loading">
                          <div className="loading-spinner small" />
                        </div>
                      )}
                      
                      <div className="prompt-content">
                        <p className="prompt-text">{item.prompt}</p>
                        <div className="prompt-meta">
                          <User className="icon-tiny" />
                          <span className="prompt-date">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Response Section */}
        {response && (
          <div className="response-section">
            <h4 className="response-title">
              <Sparkles className="icon-medium" />
              AI Response
            </h4>
            <div className="response-content">
              <p>{response}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptForm;