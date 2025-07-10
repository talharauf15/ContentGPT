// import { useEffect, useState } from "react";
// import { Send, ToggleLeft, ToggleRight, MessageSquare, Clock, User, Sparkles, AlertCircle } from "lucide-react";
// import "./PromptForm.css";
// import { useUser } from "@clerk/clerk-react";
// import { createPromptLog } from "../api/promptLogAPI";
// import { getAllPrompts } from "../api/promptAPI";
// import LLMSelector from "./LLMSelector";

// const PromptForm = () => {
//   const [prompt, setPrompt] = useState("");
//   const [response, setResponse] = useState("");
//   const [prompts, setPrompts] = useState([]);
//   const [error, setError] = useState("");
//   const [manualMode, setManualMode] = useState(true);
//   const [isLoading, setIsLoading] = useState(false);
//   const [selectedPromptId, setSelectedPromptId] = useState(null);
//   const [LlmProvider, setLlmProvider] = useState("openai"); 

//   const { user } = useUser(); 

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

//     if (!user) return setError("User not authenticated.");
//     if (!prompt.trim()) return setError("Please enter a prompt.");

//     setIsLoading(true);
//     setError("");

//     try {
//       const result = await createPromptLog({
//         prompt,
//         response,
//         userId: user.id,
//         userName: user.username,
//         model: LlmProvider,
//       });
//       setResponse(result.response);
//     } catch (error) {
//       console.error("❌ Error submitting prompt:", error);
//       setResponse("Failed to save prompt log.");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   const handleSavedPromptClick = async (selectedPrompt, promptId) => {
//     if (!user) return setError("User not authenticated.");

//     setSelectedPromptId(promptId);
//     setPrompt(selectedPrompt);
//     setIsLoading(true);
//     setError("");

//     try {
//       const result = await createPromptLog({
//         prompt: selectedPrompt,
//         response,
//         userId: user.id,
//         userName: user.username,
//         model: LlmProvider,
//       });
//       setResponse(result.response);
//     } catch (error) {
//       console.error("❌ Error submitting saved prompt:", error);
//       setResponse("Failed to save prompt log.");
//     } finally {
//       setIsLoading(false);
//       setSelectedPromptId(null);
//     }
//   };

//   return (
//     <div className="prompt-form-container">
//       <div className="prompt-form-card">

//         <div className="form-header">
//           <div className="header-content">
//             <div className="header-icon">
//               <Sparkles className="icon-sparkles" />
//             </div>
//             <div>
//               <h2 className="form-title">AI Prompt Assistant</h2>
//               <p className="form-subtitle">Create and manage your AI conversations</p>
//             </div>
//           </div>
          
//           <div className="mode-toggle">
//             <div className="toggle-container">
//               <span className={`toggle-label ${manualMode ? 'active' : ''}`}>
//                 <MessageSquare className="icon-small" />
//                 Manual
//               </span>
//               <button
//                 onClick={() => setManualMode(!manualMode)}
//                 className="toggle-button"
//                 aria-label="Toggle input mode"
//               >
//                 {manualMode ? (
//                   <ToggleLeft className="icon-toggle" />
//                 ) : (
//                   <ToggleRight className="icon-toggle" />
//                 )}
//               </button>
//               <span className={`toggle-label ${!manualMode ? 'active' : ''}`}>
//                 <Clock className="icon-small" />
//                 Saved
//               </span>
//             </div>
//           </div>
//         </div>

//         {error && (
//           <div className="error-message">
//             <AlertCircle className="icon-small" />
//             <span>{error}</span>
//           </div>
//         )}

//         <div className="form-content">
//           <LLMSelector selectedProvider={LlmProvider} onChange={setLlmProvider} />

//           {manualMode ? (
//             <div className="manual-mode">
//               <form onSubmit={handleSubmit} className="prompt-form">
//                 <div className="textarea-container">
//                   <textarea
//                     value={prompt}
//                     onChange={(e) => setPrompt(e.target.value)}
//                     placeholder="Enter your prompt here... Be creative and specific!"
//                     rows={6}
//                     className="prompt-textarea"
//                     disabled={isLoading}
//                   />
//                   <div className="character-count">
//                     {prompt.length}/1000
//                   </div>
//                 </div>
                
//                 <button 
//                   type="submit" 
//                   className="submit-button"
//                   disabled={isLoading || !prompt.trim()}
//                 >
//                   {isLoading ? (
//                     <div className="loading-spinner" />
//                   ) : (
//                     <Send className="icon-small" />
//                   )}
//                   {isLoading ? "Processing..." : "Send Prompt"}
//                 </button>
//               </form>
//             </div>
//           ) : (
//             <div className="saved-mode">
//               <h3 className="saved-title">
//                 <Clock className="icon-medium" />
//                 Choose from Saved Prompts
//               </h3>
              
//               {prompts.length === 0 ? (
//                 <div className="empty-state">
//                   <MessageSquare className="icon-large" />
//                   <p>No saved prompts yet.</p>
//                   <p className="text-sm">Switch to manual mode to create your first prompt!</p>
//                 </div>
//               ) : (
//                 <div className="prompts-grid">
//                   {prompts.map((item) => (
//                     <div
//                       key={item._id}
//                       onClick={() => handleSavedPromptClick(item.prompt, item._id)}
//                       className={`prompt-card ${selectedPromptId === item._id ? 'loading' : ''}`}
//                       role="button"
//                       tabIndex={0}
//                       onKeyDown={(e) => {
//                         if (e.key === 'Enter' || e.key === ' ') {
//                           handleSavedPromptClick(item.prompt, item._id);
//                         }
//                       }}
//                     >
//                       {selectedPromptId === item._id && (
//                         <div className="card-loading">
//                           <div className="loading-spinner small" />
//                         </div>
//                       )}
                      
//                       <div className="prompt-content">
//                         <p className="prompt-text">{item.prompt}</p>
//                         <div className="prompt-meta">
//                           <User className="icon-tiny" />
//                           <span className="prompt-date">
//                             {new Date(item.createdAt).toLocaleDateString()}
//                           </span>
//                         </div>
//                       </div>
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>
//           )}
//         </div>

//         {response && (
//           <div className="response-section">
//             <h4 className="response-title">
//               <Sparkles className="icon-medium" />
//               AI Response
//             </h4>
//             <div className="response-content">
//               <p>{response}</p>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PromptForm;







// import { useState } from "react";
// import { Send, LoaderCircle } from "lucide-react";
// import "./PromptForm.css";
// import { generateBrandStrategy } from "../api/brandingAPI";

// const PromptForm = () => {
//   const [companyName, setCompanyName] = useState("");
//   const [targetAudience, setTargetAudience] = useState("");
//   const [businessPurpose, setBusinessPurpose] = useState("");
//   const [goal, setGoal] = useState("");
//   const [customTags, setCustomTags] = useState("");

//   const [response, setResponse] = useState("");
//   const [error, setError] = useState("");
//   const [isLoading, setIsLoading] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError("");
//     setResponse("");

//     try {
//       const result = await generateBrandStrategy({
//         companyName,
//         targetAudience,
//         businessPurpose,
//         goal,
//         customTags,
//       });

//       setResponse(result.response || "No response received.");
//     } catch (err) {
//       setError("❌ Something went wrong. Please try again.");
//       console.error(err);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="prompt-form-container">
//       <div className="prompt-form-card">
//         <h2 className="form-title">📊 Brand Strategy Generator</h2>
//         <p className="form-subtitle">Generate a complete brand identity using AI</p>

//         <form onSubmit={handleSubmit} className="prompt-form">
//           <input
//             type="text"
//             placeholder="Company Name"
//             value={companyName}
//             onChange={(e) => setCompanyName(e.target.value)}
//             className="prompt-textarea"
//             required
//           />

//           <input
//             type="text"
//             placeholder="Target Audience"
//             value={targetAudience}
//             onChange={(e) => setTargetAudience(e.target.value)}
//             className="prompt-textarea"
//             required
//           />

//           <select
//             value={businessPurpose}
//             onChange={(e) => setBusinessPurpose(e.target.value)}
//             className="prompt-textarea"
//             required
//           >
//             <option value="">Select Business Purpose</option>
//             <option value="1">Company Profile</option>
//             <option value="2">Social Media Content</option>
//             <option value="3">Viral Launch Post</option>
//             <option value="4">Full SEO Website Copy</option>
//           </select>

//           <input
//             type="text"
//             placeholder="Main Goal / CTA (e.g., Get Leads)"
//             value={goal}
//             onChange={(e) => setGoal(e.target.value)}
//             className="prompt-textarea"
//             required
//           />

//           <textarea
//             rows={4}
//             placeholder="Instructions, tags, cultural context, or keywords (Optional)"
//             value={customTags}
//             onChange={(e) => setCustomTags(e.target.value)}
//             className="prompt-textarea"
//           />

//           <button type="submit" className="submit-button" disabled={isLoading}>
//             {isLoading ? (
//               <>
//                 <LoaderCircle className="loading-spinner" />
//                 Generating...
//               </>
//             ) : (
//               <>
//                 <Send className="icon-small" />
//                 Generate Strategy
//               </>
//             )}
//           </button>
//         </form>

//         {error && <div className="error-message"><p>{error}</p></div>}

//         {response && (
//           <div className="response-section">
//             <h4 className="response-title">🎯 Brand Strategy Output</h4>
//             <div className="response-content">
//               <pre>{response}</pre>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default PromptForm;







import { useState, useEffect } from "react";
import {
  Send,
  ToggleLeft,
  ToggleRight,
  MessageSquare,
  Clock,
  User,
  Sparkles,
  AlertCircle,
  LoaderCircle,
} from "lucide-react";
import "./PromptForm.css";
import { useUser } from "@clerk/clerk-react";
import { getAllPrompts } from "../api/promptAPI";
import { createPromptLog } from "../api/promptLogAPI";
import { generateBrandStrategy } from "../api/brandingAPI";
import LLMSelector from "./LLMSelector";

const PromptForm = () => {
  const [manualMode, setManualMode] = useState(true);
  const [prompts, setPrompts] = useState([]);
  const [selectedPromptId, setSelectedPromptId] = useState(null);
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [LlmProvider, setLlmProvider] = useState("openai");
  const { user } = useUser();

  // Brand Strategy Form Inputs
  const [companyName, setCompanyName] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [businessPurpose, setBusinessPurpose] = useState("");
  const [goal, setGoal] = useState("");
  const [customTags, setCustomTags] = useState("");

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

  const handleManualSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setResponse("");

    try {
      const result = await generateBrandStrategy({
        companyName,
        targetAudience,
        businessPurpose,
        goal,
        customTags,
        model: LlmProvider,
      });

      const finalResponse = result.response || "No response received.";
      setResponse(finalResponse);

      if (user) {
        await createPromptLog({
          prompt: `Brand strategy for ${companyName}`,
          response: finalResponse,
          userId: user.id,
          userName: user.username,
          model: LlmProvider,
        });
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
      console.error("❌ Error generating strategy:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSavedPromptClick = async (selectedPrompt, promptId) => {
    if (!user) return setError("User not authenticated.");
    setSelectedPromptId(promptId);
    setIsLoading(true);
    setError("");
    setResponse("");

    try {
      const result = await createPromptLog({
        prompt: selectedPrompt,
        response,
        userId: user.id,
        userName: user.username,
        model: LlmProvider,
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

          <div className="mode-toggle">
            <div className="toggle-container">
              <span className={`toggle-label ${manualMode ? "active" : ""}`}>
                <MessageSquare className="icon-small" />
                Manual
              </span>
              <button
                onClick={() => setManualMode(!manualMode)}
                className="toggle-button"
              >
                {manualMode ? <ToggleLeft className="icon-toggle" /> : <ToggleRight className="icon-toggle" />}
              </button>
              <span className={`toggle-label ${!manualMode ? "active" : ""}`}>
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

        <div className="form-content">
          <LLMSelector selectedProvider={LlmProvider} onChange={setLlmProvider} />

          {manualMode ? (
            <form onSubmit={handleManualSubmit} className="prompt-form">
              <input
                type="text"
                placeholder="Company Name"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="prompt-textarea"
                required
              />
              <input
                type="text"
                placeholder="Target Audience"
                value={targetAudience}
                onChange={(e) => setTargetAudience(e.target.value)}
                className="prompt-textarea"
                required
              />
              <select
                value={businessPurpose}
                onChange={(e) => setBusinessPurpose(e.target.value)}
                className="prompt-textarea"
                required
              >
                <option value="">Select Business Purpose</option>
                <option value="1">Company Profile</option>
                <option value="2">Social Media Content</option>
                <option value="3">Viral Launch Post</option>
                <option value="4">Full SEO Website Copy</option>
              </select>
              <input
                type="text"
                placeholder="Main Goal / CTA (e.g., Get Leads)"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                className="prompt-textarea"
                required
              />
              <textarea
                rows={4}
                placeholder="Instructions, tags, cultural context, or keywords (Optional)"
                value={customTags}
                onChange={(e) => setCustomTags(e.target.value)}
                className="prompt-textarea"
              />
              <button type="submit" className="submit-button" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <LoaderCircle className="loading-spinner" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Send className="icon-small" />
                    Generate Strategy
                  </>
                )}
              </button>
            </form>
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
                      className={`prompt-card ${selectedPromptId === item._id ? "loading" : ""}`}
                      role="button"
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
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
                          <span className="prompt-date">{new Date(item.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {response && (
          <div className="response-section">
            <h4 className="response-title">
              <Sparkles className="icon-medium" />
              AI Response
            </h4>
            <div className="response-content">
              <pre>{response}</pre>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptForm;
