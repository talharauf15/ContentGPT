import express from "express";
import JSZip from "jszip";
import { generatePdfBuffer, generateSimplePdfBuffer } from "../services/pdfService.js";

const router = express.Router();

/**
 * Sanitizes a filename by removing or replacing unsafe characters
 * Returns 'document' for empty/non-string inputs, strips path separators
 * and unsafe chars (allows only alphanumeric, dash and underscore),
 * removes leading dots, truncates to maxLength, and falls back to 'document' if empty.
 */
function sanitizeFilename(name, maxLength = 200) {
  if (!name || typeof name !== 'string') {
    return 'document';
  }
  // Strip path separators and unsafe chars, keep only alphanumeric, dash, underscore
  let sanitized = name
    .replace(/[^a-zA-Z0-9_-]/g, '')
    .replace(/^\.+/, '') // Remove leading dots
    .substring(0, maxLength);
  
  return sanitized || 'document';
}

// POST /api/generate-pdf
router.post("/generate-pdf", async (req, res) => {
  const startedAt = Date.now();
  try {
    const {
      source = "inline",
      text,
      title = "document",
      fetchUrl,
      css,
      coverImageBase64,
      download = true,
      // Optional future extension: returnUrl, s3Key, etc.
    } = req.body || {};

    if (!["inline", "fetch"].includes(source)) {
      return res.status(400).json({ error: "Invalid source. Must be 'inline' or 'fetch'." });
    }

    if (source === "inline" && !text) {
      return res.status(400).json({ error: "Field 'text' is required when source is 'inline'." });
    }

    if (source === "fetch" && !fetchUrl) {
      return res.status(400).json({ error: "Field 'fetchUrl' is required when source is 'fetch'." });
    }

    // Validate input sizes to prevent memory exhaustion
    const MAX_TEXT_SIZE = 10 * 1024 * 1024; // 10MB
    const MAX_TITLE_SIZE = 500;
    if (text && text.length > MAX_TEXT_SIZE) {
      return res.status(400).json({ error: `Text exceeds maximum size of ${MAX_TEXT_SIZE} bytes.` });
    }
    if (title && title.length > MAX_TITLE_SIZE) {
      return res.status(400).json({ error: `Title exceeds maximum size of ${MAX_TITLE_SIZE} characters.` });
    }

    const pdfBuffer = await generatePdfBuffer({
      source,
      text,
      title,
      fetchUrl,
      coverImageBase64,
      css,
    });

    // const filename = `${title || "document"}.pdf`.replace(/[^\w.-]+/g, "_");
    const filename = `${sanitizeFilename(title)}.pdf`;

    // Optional: wrap PDF in a ZIP archive if requested
    const wantsZip = req.query.zip === "true" || req.body?.zip === true;

    if (wantsZip) {
      const zip = new JSZip();
      zip.file(filename, pdfBuffer);
      const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });
      const zipName = `${sanitizeFilename(title)}.zip`;

      res.setHeader("Content-Type", "application/zip");
      res.setHeader(
        "Content-Disposition",
        `${download ? "attachment" : "inline"}; filename="${zipName.replace(/"/g, '\\"')}"`
      );
      res.status(200).end(zipBuffer);
    } else {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader(
        "Content-Disposition",
        `${download ? "attachment" : "inline"}; filename="${filename.replace(/"/g, '\\"')}"`
      );
      // Stream for long PDFs
      res.status(200).end(pdfBuffer);
    }

    console.log(
      `✅ PDF generated (${filename}) in ${Date.now() - startedAt}ms, size=${pdfBuffer.length} bytes`
    );
  } catch (err) {
  console.error("❌ Error generating PDF:", err);
  if (err.message && err.message.includes("Failed to fetch content")) {
    return res.status(502).json({ error: err.message });
  }
  // If Puppeteer fails (e.g., cannot launch), return hint to try simple endpoint
  if (err.message && err.message.toLowerCase().includes("puppeteer")) {
    return res.status(500).json({
      error: "Puppeteer failed to generate PDF. Try /api/generate-pdf-simple as fallback.",
      details: err.message,
    });
  }
  res.status(500).json({ error: "Failed to generate PDF", details: err.message });
}
});

// Fallback basic PDF: POST /api/generate-pdf-simple
router.post("/generate-pdf-simple", async (req, res) => {
  const startedAt = Date.now();
  try {
    const { text, title } = req.body || {};
    
    if (!text) {
      return res.status(400).json({ error: "Field 'text' is required." });
    }

    const MAX_TEXT_SIZE = 10 * 1024 * 1024; // 10MB
    if (text.length > MAX_TEXT_SIZE) {
      return res.status(400).json({ error: `Text exceeds maximum size of ${MAX_TEXT_SIZE} bytes.` });
    }

    const pdfBuffer = await generateSimplePdfBuffer({ text, title });

    const filename = `${sanitizeFilename(title)}.pdf`;

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", `attachment; filename="${filename.replace(/"/g, '\\"')}"`);
    res.setHeader("Content-Disposition", `attachment; filename="${filename.replace(/"/g, '\\"')}"`);
    res.status(200).end(pdfBuffer);

    console.log(
      `✅ Simple PDF generated (${filename}) in ${Date.now() - startedAt}ms, size=${pdfBuffer.length} bytes`
    );
  } catch (err) {
  console.error("❌ Error generating simple PDF:", err);
  res.status(500).json({ error: "Failed to generate simple PDF", details: err.message });
}
});

export default router;


