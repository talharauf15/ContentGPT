import { useState, useEffect, useRef, useCallback } from "react";
import { LoaderCircle, FileDown } from "lucide-react";
import api from "../api/axios";

/**
 * PdfDownloadButton
 *
 * Props:
 * - text?: string          – Inline text to convert to PDF
 * - fetchUrl?: string      – Backend URL that returns the text/content
 * - title?: string         – Optional title used for PDF filename and header
 * - autoDownload?: boolean – Automatically download when text is available
 * - zip?: boolean          – Download as ZIP file
 */
const PdfDownloadButton = ({ text, fetchUrl, title = "document", autoDownload = false, zip = false }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const hasAutoDownloaded = useRef(false);
  const previousTextRef = useRef("");

  const handleDownload = useCallback(async () => {
    setIsLoading(true);
    setError("");

    try {
      const payload =
        text != null && text !== ""
          ? { source: "inline", text, title, zip }
          : fetchUrl
          ? { source: "fetch", fetchUrl, title, zip }
          : { source: "fetch", fetchUrl: "/api/content", title, zip };

      const response = await api.post("/generate-pdf", payload, {
        responseType: "blob",
        headers: {
          "Content-Type": "application/json",
          Accept: zip ? "application/zip" : "application/pdf",
        },
      });

      // response.data is already a Blob when responseType is "blob"
      const contentType = zip ? "application/zip" : "application/pdf";
      const blob = response.data instanceof Blob 
        ? response.data 
        : new Blob([response.data], { type: contentType });
      
      // Try to extract filename from Content-Disposition header
      let filename = zip ? `${title || "document"}.zip` : `${title || "document"}.pdf`;
      const contentDisposition = response.headers["content-disposition"];
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, "");
        }
      }
      
      const url = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.style.display = "none";
      document.body.appendChild(link);
      link.click();
      
      // Clean up after a short delay to ensure download starts
      setTimeout(() => {
        document.body.removeChild(link);
        window.URL.revokeObjectURL(url);
      }, 100);
    } catch (err) {
      console.error("Failed to download PDF:", err);
      setError("Failed to generate PDF. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }, [text, fetchUrl, title, zip]);

  // Auto-download when text is available and autoDownload is enabled
  useEffect(() => {
    // Only trigger if text has actually changed (new response)
    const textChanged = text !== previousTextRef.current;
    if (textChanged && text) {
      previousTextRef.current = text;
      hasAutoDownloaded.current = false;
    }

    if (autoDownload && text && !hasAutoDownloaded.current && !isLoading && textChanged) {
      hasAutoDownloaded.current = true;
      handleDownload();
    }
  }, [text, autoDownload, isLoading, handleDownload]);

  return (
    <div style={{ display: "inline-flex", flexDirection: "column", gap: 4 }}>
      <button
        type="button"
        onClick={handleDownload}
        disabled={isLoading}
        className="submit-button"
        style={{ display: "inline-flex", alignItems: "center", gap: 8 }}
      >
        {isLoading ? (
          <>
            <LoaderCircle className="loading-spinner" />
            Generating PDF...
          </>
        ) : (
          <>
            <FileDown size={18} />
            {zip ? "Download as ZIP" : "Download as PDF"}
          </>
        )}
      </button>
      {error && (
        <span style={{ color: "#b91c1c", fontSize: 12 }}>
          {error}
        </span>
      )}
    </div>
  );
};

export default PdfDownloadButton;


