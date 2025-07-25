// import React, { useState } from "react";
// import {
//   Sparkles,
//   LoaderCircle,
//   Send,
//   AlertCircle,
// } from "lucide-react"; // ensure lucide-react is installed
// import api from "../api/axios"; // adjust path if needed
// import ReactMarkdown from "react-markdown";
// // import "../styles/LandingPageForm.css"; // if you're using custom styles
// import { generateLandingPage } from "../api/landingPageAPI";

// const LandingPageForm = () => {
//   const [companyName, setCompanyName] = useState("");
//   const [targetAudience, setTargetAudience] = useState("");
//   const [businessPurpose, setBusinessPurpose] = useState("");
//   const [goal, setGoal] = useState("");
//   const [customTags, setCustomTags] = useState("");
//   const [response, setResponse] = useState(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState(null);

//   const handleLandingSubmit = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError(null);
//     setResponse(null);

//     try {
//       const res = await api.post("/landing/generate-content", {
//         companyName,
//         targetAudience,
//         businessPurpose,
//         goal,
//         customTags,
//         model: "openai",
//         agent: "landing-page",
//         userId: "user-123", // Replace with real user ID if available
//         userName: "Talha Rauf", // Replace with real username
//       });

//       setResponse(res.data?.content || "No content returned.");
//     } catch (err) {
//       console.error("Error generating landing page content:", err);
//       setError(err?.response?.data?.message || "Something went wrong.");
//     } finally {
//       setIsLoading(false);
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
//               <h2 className="form-title">Landing Page Generator</h2>
//               <p className="form-subtitle">Craft your business landing page using AI</p>
//             </div>
//           </div>
//         </div>

//         {error && (
//           <div className="error-message">
//             <AlertCircle className="icon-small" />
//             <span>{error}</span>
//           </div>
//         )}

//         <form onSubmit={handleLandingSubmit} className="prompt-form">
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
//           <input
//             type="text"
//             placeholder="Business Purpose"
//             value={businessPurpose}
//             onChange={(e) => setBusinessPurpose(e.target.value)}
//             className="prompt-textarea"
//             required
//           />
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
//                 Generate Landing Page
//               </>
//             )}
//           </button>
//         </form>

//         {response && (
//           <div className="response-section">
//             <h4 className="response-title">
//               <Sparkles className="icon-medium" />
//               AI Response
//             </h4>
//             <div className="response-content">
//               <ReactMarkdown>{response}</ReactMarkdown>
//             </div>
//           </div>
//         )}
//       </div>
//     </div>
//   );
// };

// export default LandingPageForm;


import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { generateLandingPage } from "../api/landingPageAPI";
import LLMSelector from "../components/LLMSelector";
import { useUser } from "@clerk/clerk-react";
// Icons
import { Send, LoaderCircle, AlertCircle, Sparkles } from "lucide-react";

const LandingPageAgent = ({ userId, userName }) => {
  const [companyName, setCompanyName] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [businessPurpose, setBusinessPurpose] = useState("");
  const [goal, setGoal] = useState("High-conversion engagement & lead generation");
  const [colorScheme, setColorScheme] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [socialLinks, setSocialLinks] = useState("");
  const [model, setModel] = useState("openai");
  const [agent, setAgent] = useState("");
  const { user } = useUser();

  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResponse(null);

    const payload = {
      companyName,
      targetAudience,
      businessPurpose,
      goal,
      colorScheme: colorScheme || null,
      email,
      phone,
      socialLinks: socialLinks
        .split(",")
        .map((link) => link.trim())
        .filter(Boolean),
      model,
      agent,
      userId: user.id,
      userName: user.username,
    };

    try {
      const result = await generateLandingPage(payload);
      setResponse(result);
    } catch (err) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
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
              <h2 className="form-title">Landing Page Generator</h2>
              <p className="form-subtitle">Generate landing pages with high conversion potential</p>
            </div>
          </div>
        </div>

        {error && (
          <div className="error-message">
            <AlertCircle className="icon-small" />
            <span>{error}</span>
          </div>
        )}

        <LLMSelector selectedProvider={model} onChange={setModel} />

        <form onSubmit={handleSubmit} className="prompt-form">
          <input
            type="text"
            placeholder="Company Name"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
            required
            className="prompt-textarea"
          />
          <input
            type="text"
            placeholder="Target Audience"
            value={targetAudience}
            onChange={(e) => setTargetAudience(e.target.value)}
            required
            className="prompt-textarea"
          />
          <textarea
            placeholder="Business Purpose"
            value={businessPurpose}
            onChange={(e) => setBusinessPurpose(e.target.value)}
            required
            className="prompt-textarea"
          />
          <input
            type="text"
            placeholder="Goal"
            value={goal}
            onChange={(e) => setGoal(e.target.value)}
            className="prompt-textarea"
          />
          <input
            type="text"
            placeholder="Color Scheme (optional)"
            value={colorScheme}
            onChange={(e) => setColorScheme(e.target.value)}
            className="prompt-textarea"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="prompt-textarea"
          />
          <input
            type="text"
            placeholder="Phone (optional)"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="prompt-textarea"
          />
          <input
            type="text"
            placeholder="Social Links (comma-separated)"
            value={socialLinks}
            onChange={(e) => setSocialLinks(e.target.value)}
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
                Generate Landing Page
              </>
            )}
          </button>
        </form>

        {response && (
          <div className="response-section">
            <h4 className="response-title">
              <Sparkles className="icon-medium" />
              Generated Landing Page
            </h4>
            <div className="response-content">
              <ReactMarkdown>{response?.result || ""}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LandingPageAgent;
