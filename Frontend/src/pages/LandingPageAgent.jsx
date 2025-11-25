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
import {
  Send,
  LoaderCircle,
  AlertCircle,
  Sparkles,
  LayoutDashboard,
  Rocket,
  PenTool,
  Globe,
} from "lucide-react";
import "./LandingPageAgent.css";

const dataHighlights = [
  { label: "Launch-ready sections", value: "8+", icon: LayoutDashboard },
  { label: "Avg. conversion lift", value: "+37%", icon: Rocket },
  { label: "Copy variants per brief", value: "3", icon: PenTool },
];

const LandingPageAgent = () => {
  const [companyName, setCompanyName] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [businessPurpose, setBusinessPurpose] = useState("");
  const [goal, setGoal] = useState("High-conversion engagement & lead generation");
  const [colorScheme, setColorScheme] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [socialLinks, setSocialLinks] = useState("");
  const [model, setModel] = useState("openai");
  const { user } = useUser();
  const [copied, setCopied] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const responseText = typeof response === "string" ? response : response?.result || "";

  const buildSocialLinks = () =>
    socialLinks
      .split(",")
      .map((link) => link.trim())
      .filter(Boolean);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setResponse(null);

    if (!user) {
      setError("Please sign in to generate landing page copy.");
      setIsLoading(false);
      return;
    }

    const payload = {
      companyName,
      targetAudience,
      businessPurpose,
      goal,
      colorScheme: colorScheme || null,
      email,
      phone,
      socialLinks: buildSocialLinks(),
      model,
      agent: "landing-page",
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

  const handleCopyResponse = async () => {
    if (!responseText) return;
    try {
      await navigator.clipboard.writeText(responseText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy content", err);
    }
  };

  return (
    <div className="landing-agent-page">
      <section className="landing-hero">
        <div className="hero-copy">
          <p className="eyebrow">Landing Page Agent</p>
          <h1>Ship polished, high-converting pages in a single brief.</h1>
          <p className="subtitle">
            Feed the agent your audience, offer, and CTA—then watch it assemble hero copy, product pillars,
            testimonials, and CTA stacks automatically.
          </p>
          <div className="hero-stats">
            {dataHighlights.map(({ label, value, icon: Icon }) => (
              <article key={label} className="stat-pill">
                <Icon size={22} />
                <div>
                  <span className="stat-value">{value}</span>
                  <p>{label}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
        <div className="hero-card">
          <div className="hero-card-header">
            <Sparkles className="hero-icon" />
            <div>
              <h3>What you get</h3>
              <p>Complete landing-ready sections with structured HTML-ready blocks.</p>
            </div>
          </div>
          <ul>
            <li>Hero, problem/solution, feature rows, testimonial prompts.</li>
            <li>CTA laddering tailored to the funnel stage you choose.</li>
            <li>Brand-consistent color hints and link embeds.</li>
          </ul>
        </div>
      </section>

      <section className="landing-body">
        <div className="landing-form-panel">
          <header className="panel-header">
            <div>
              <p className="panel-label">Creative Blueprint</p>
              <h2>Provide context once—reuse everywhere.</h2>
            </div>
            <Globe size={32} />
          </header>

          {error && (
            <div className="error-message">
              <AlertCircle className="icon-small" />
              <span>{error}</span>
            </div>
          )}

          <div className="llm-strip">
            <div className="llm-selector-wrap">
              <LLMSelector selectedProvider={model} onChange={setModel} />
            </div>
            <div className="llm-highlight">
              <Sparkles className="icon-small" />
              <div>
                <p>Multi-model ready</p>
                <span>Swap models based on tone or compliance needs.</span>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="landing-form">
            <div className="input-grid">
              <label className="field-group">
                <span className="field-label">Company / Product</span>
                <input
                  type="text"
                  placeholder="ex. NovaScale Analytics"
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  required
                />
              </label>
              <label className="field-group">
                <span className="field-label">Audience</span>
                <input
                  type="text"
                  placeholder="ex. SaaS Growth Leads"
                  value={targetAudience}
                  onChange={(e) => setTargetAudience(e.target.value)}
                  required
                />
              </label>
            </div>

            <label className="field-group">
              <span className="field-label">Business Purpose</span>
              <textarea
                rows={3}
                placeholder="Explain what this landing page should accomplish..."
                value={businessPurpose}
                onChange={(e) => setBusinessPurpose(e.target.value)}
                required
              />
            </label>

            <label className="field-group">
              <span className="field-label">Primary Goal / CTA</span>
              <input
                type="text"
                placeholder="ex. Book 30 discovery calls per week"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
              />
            </label>

            <div className="input-grid">
              <label className="field-group">
                <span className="field-label">Preferred Color System</span>
                <input
                  type="text"
                  placeholder="ex. Navy, blush, and crisp white"
                  value={colorScheme}
                  onChange={(e) => setColorScheme(e.target.value)}
                />
              </label>
              <label className="field-group">
                <span className="field-label">Contact Email</span>
                <input
                  type="email"
                  placeholder="hello@novascale.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
            </div>

            <div className="input-grid">
              <label className="field-group">
                <span className="field-label">Phone (optional)</span>
                <input
                  type="text"
                  placeholder="+1 (555) 234-7788"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </label>
              <label className="field-group">
                <span className="field-label">Social Links</span>
                <input
                  type="text"
                  placeholder="Comma-separated URLs"
                  value={socialLinks}
                  onChange={(e) => setSocialLinks(e.target.value)}
                />
              </label>
            </div>

            <p className="helper-note">
              Tip: Mention campaign stage, proof points, or quotes so sections feel unique to your brand.
            </p>

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
        </div>

        <section className="landing-preview">
          <div className="preview-header">
            <div className="preview-heading">
              <Sparkles className="icon-medium" />
              <div>
                <p>Live Preview</p>
                <span>Instant draft structured for markup.</span>
              </div>
            </div>
            {responseText && (
              <button
                type="button"
                className="copy-button"
                onClick={handleCopyResponse}
              >
                {copied ? "Copied!" : "Copy Code"}
              </button>
            )}
          </div>

          {responseText ? (
            <div className="response-content">
              <ReactMarkdown>{responseText}</ReactMarkdown>
            </div>
          ) : (
            <div className="preview-empty">
              <p>Fill out the brief to see the AI landing page blueprint.</p>
            </div>
          )}
        </section>
      </section>
    </div>
  );
};

export default LandingPageAgent;
