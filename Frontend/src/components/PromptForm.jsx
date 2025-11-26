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
  Download,
} from "lucide-react";
import "./PromptForm.css";
import { useUser } from "@clerk/clerk-react";
import { getAllPrompts } from "../api/promptAPI";
import { createPromptLog } from "../api/promptLogAPI";
import { generateBrandStrategy } from "../api/brandingAPI";
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import LLMSelector from "./LLMSelector";
import ReactMarkdown from "react-markdown";

const PromptForm = () => {
  const [manualMode, setManualMode] = useState(true);
  const [prompts, setPrompts] = useState([]);
  const [selectedPromptId, setSelectedPromptId] = useState(null);
  const [response, setResponse] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [LlmProvider, setLlmProvider] = useState("openai");
  const [companyName, setCompanyName] = useState("");
  const [targetAudience, setTargetAudience] = useState("");
  const [businessPurposes, setBusinessPurposes] = useState([]);
  const [goal, setGoal] = useState("");
  const [customTags, setCustomTags] = useState("");
  const { user } = useUser();

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
    if (businessPurposes.length === 0) {
      setError("Please select at least one business purpose.");
      return;
    }
    setIsLoading(true);
    setError("");
    setResponse("");

    try {
      const result = await generateBrandStrategy({
        companyName,
        targetAudience,
        businessPurpose: businessPurposes,
        goal,
        customTags,
        model: LlmProvider,
        agent: 'brand-strategy',
        userId: user.id,
        userName: user.username,
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
          agent: 'brand-strategy',
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
        agent: 'brand-strategy',
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

  const handleDownloadPdf = async () => {
    if (!response) return;

    try {
      const doc = new jsPDF({ unit: "pt", format: "a4" });
      const element = document.querySelector(".response-content");

      if (!element) {
        setError("Could not find content to export.");
        return;
      }

      // Set margins for better layout
      const margin = 50;
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const contentWidth = pageWidth - (margin * 2);

      // Temporarily style the element for better PDF rendering
      const originalWidth = element.style.width;
      const originalPadding = element.style.padding;
      const originalBoxSizing = element.style.boxSizing;

      // Set optimal width for PDF (full width with margins)
      element.style.width = `${contentWidth}px`;
      element.style.padding = "20px";
      element.style.boxSizing = "border-box";

      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        width: contentWidth + 40, // Include padding
      });

      // Restore original styles
      element.style.width = originalWidth;
      element.style.padding = originalPadding;
      element.style.boxSizing = "";
      element.style.boxSizing = originalBoxSizing;

      const imgData = canvas.toDataURL("image/png");
      const imgProps = doc.getImageProperties(imgData);

      // Calculate dimensions maintaining aspect ratio
      const imgWidth = contentWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      // Add title if company name exists
      let startY = margin;
      if (companyName) {
        doc.setFont("helvetica", "bold");
        doc.setFontSize(18);
        const title = `Brand Strategy for ${companyName}`;
        const titleWidth = doc.getTextWidth(title);
        doc.text(title, (pageWidth - titleWidth) / 2, margin);
        startY = margin + 30;
      }

      // Calculate available height per page
      const availableHeight = pageHeight - startY - margin;

      // Split image across pages properly
      let yPosition = startY;
      let sourceY = 0;
      let remainingHeight = imgHeight;
      let pageNumber = 0;

      while (remainingHeight > 0) {
        if (pageNumber > 0) {
          doc.addPage();
          yPosition = margin;
        }

        const heightForThisPage = Math.min(remainingHeight, availableHeight);
        const sourceHeight = (heightForThisPage / imgHeight) * imgProps.height;

        // Create a canvas for this page slice
        const pageCanvas = document.createElement("canvas");
        pageCanvas.width = imgProps.width;
        pageCanvas.height = sourceHeight;
        const ctx = pageCanvas.getContext("2d");

        // Draw the slice of the original canvas
        ctx.drawImage(
          canvas,
          0, sourceY, imgProps.width, sourceHeight,
          0, 0, imgProps.width, sourceHeight
        );

        const pageImgData = pageCanvas.toDataURL("image/png");
        doc.addImage(pageImgData, "PNG", margin, yPosition, imgWidth, heightForThisPage);

        remainingHeight -= heightForThisPage;
        sourceY += sourceHeight;
        pageNumber++;
      }

      const fileName = companyName
        ? `brand-strategy-${companyName}.pdf`
        : "brand-strategy-output.pdf";

      doc.save(fileName.replace(/\s+/g, "-").toLowerCase());
    } catch (error) {
      console.error("Failed to generate PDF:", error);
      setError("Failed to generate PDF. Please try again.");
    }
  };

  const businessPurposeOptions = [{ value: "1", label: "Company Profile" },
  { value: "2", label: "Social Media Content" },
  { value: "3", label: "Viral Launch Post" },
  { value: "4", label: "Full SEO Website Copy" },
  ];

  const handleBusinessPurposeChange = (value) => {
    setBusinessPurposes((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value]
    );
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
          <div className="llm-strip">
            <div className="llm-selector-wrap">
              <LLMSelector selectedProvider={LlmProvider} onChange={setLlmProvider} />
            </div>
            <div className="llm-highlight">
              <Sparkles className="icon-small" />
              <div>
                <p>Adaptive creativity</p>
                <span>Switch engines any time to match tone and rigor.</span>
              </div>
            </div>
          </div>

          {manualMode ? (
            <form onSubmit={handleManualSubmit} className="prompt-form">
              <div className="input-grid">
                <label className="field-group">
                  <span className="field-label">Company Name</span>
                  <input
                    type="text"
                    placeholder="ex. Atlas BioLabs"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="prompt-input"
                    required
                  />
                </label>
                <label className="field-group">
                  <span className="field-label">Target Audience</span>
                  <input
                    type="text"
                    placeholder="ex. Growth oriented biotech CMOs"
                    value={targetAudience}
                    onChange={(e) => setTargetAudience(e.target.value)}
                    className="prompt-input"
                    required
                  />
                </label>
              </div>

              <div className="field-group">
                <span className="field-label">Business Purpose</span>
                <div className="checkbox-group">
                  {businessPurposeOptions.map((option) => (
                    <label key={option.value} className="checkbox-item">
                      <input
                        type="checkbox"
                        value={option.value}
                        checked={businessPurposes.includes(option.value)}
                        onChange={() => handleBusinessPurposeChange(option.value)}
                      />
                      <span>{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <label className="field-group">
                <span className="field-label">Main Goal / CTA</span>
                <input
                  type="text"
                  placeholder="ex. Drive 50 demo signups"
                  value={goal}
                  onChange={(e) => setGoal(e.target.value)}
                  className="prompt-input"
                  required
                />
              </label>

              <label className="field-group">
                <span className="field-label">Context & Tags (Optional)</span>
                <textarea
                  rows={4}
                  placeholder="Tone, cultural cues, campaign hooks, existing slogans..."
                  value={customTags}
                  onChange={(e) => setCustomTags(e.target.value)}
                  className="prompt-input textarea"
                />
              </label>

              <p className="helper-note">
                Give the agent vivid details—events, product launches, or constraints—to keep messaging
                uniquely yours.
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
                    Generate Strategy
                  </>
                )}
              </button>
            </form>
          ) : (
            <div className="saved-mode">
              <div className="saved-title">
                <div className="saved-label">
                  <Clock className="icon-medium" />
                  <div>
                    <h3>Saved Prompt Library</h3>
                    <p>Reuse high-performing strategies from your workspace history.</p>
                  </div>
                </div>
                <span className="saved-count">{prompts.length} prompts</span>
              </div>

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
            <div className="response-header-row">
              <h4 className="response-title">
                <Sparkles className="icon-medium" />
                AI Response
              </h4>
              <button
                type="button"
                className="download-button"
                onClick={handleDownloadPdf}
              >
                <Download className="icon-small" />
                Download PDF
              </button>
            </div>
            <div className="response-content">
              <ReactMarkdown>{response}</ReactMarkdown>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PromptForm;
