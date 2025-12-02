import puppeteer from "puppeteer";
import { PDFDocument, StandardFonts } from "pdf-lib";
import { buildPdfHtml } from "../utils/pdfTemplate.js";

// Helper to launch Puppeteer with safe defaults
async function launchBrowser() {
  const args = [];
  if (process.env.PUPPETEER_DISABLE_SANDBOX === 'true') {
    args.push('--no-sandbox', '--disable-setuid-sandbox');
  }

  return puppeteer.launch({
    headless: "new",
    args,
  });
// } headless: "new",
//   // args: ["--no-sandbox", "--disable-setuid-sandbox"],
//   args,
//   });
}

// Main Puppeteer-based HTML → PDF generator
export async function generatePdfBuffer({
  source = "inline",
  text,
  title = "document",
  fetchUrl,
  coverImageBase64,
  css,
}) {
  let contentText = text || "";

  if (source === "fetch") {
    if (!fetchUrl) {
      throw new Error("fetchUrl is required when source is 'fetch'");
    }

    const controller = new AbortController();
    const timeoutMs = 10_000;
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

    let response;
    try {
      response = await fetch(fetchUrl, { signal: controller.signal });
    } catch (err) {
      // Translate aborts into a clearer timeout error, preserve others
      if (err && (err.name === "AbortError" || err.code === "ABORT_ERR")) {
        throw new Error(`Fetch to ${fetchUrl} timed out`);
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
    }

    if (!response.ok) {
      throw new Error(`Failed to fetch content from ${fetchUrl}: ${response.status}`);
    }
    contentText = await response.text();
  }

  // Sanitize title for use in HTML (40-char limit and escaping)
  const sanitizedTitle = (title ? String(title).slice(0, 40) : "Document")
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');

  // Generate HTML using buildPdfHtml with sanitized title
  const html = buildPdfHtml({
    title: sanitizedTitle,
    text: contentText,
    coverImageBase64,
    customCss: css,
  });

  const browser = await launchBrowser();
  try {
    const page = await browser.newPage();
    await page.setContent(html, {
      waitUntil: "networkidle0",
      timeout: 30000 // 30 second timeout
    });

    const pdfBuffer = await page.pdf({
      format: "A4",
      printBackground: true,
      timeout: 30000, // 30 second timeout
      margin: {
        top: "20mm",
        bottom: "20mm",
        left: "20mm",
        right: "20mm",
      },
      displayHeaderFooter: true,
      headerTemplate: `
        <style>
          .header {
            font-size: 10px;
            color: #9CA3AF;
            width: 100%;
            padding: 0 24px;
          }
        </style>
        <div class="header"></div>
      `,
      footerTemplate: `
        <style>
          .footer {
            font-size: 10px;
            color: #6B7280;
            width: 100%;
            padding: 0 24px;
            display: flex;
            justify-content: space-between;
          }
        </style>
        <div class="footer">
          <span>${sanitizedTitle}</span>
          <span class="pageNumber"></span>/<span class="totalPages"></span>
        </div>
      `,
    });

    return pdfBuffer;
  } finally {
    await browser.close();
  }
}

// Fallback simple PDF generator using pdf-lib
export async function generateSimplePdfBuffer({ text = "", title = "document" }) {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const fontSize = 12;
  const pageMargin = 50;
  const lineHeight = 16;

  const lines = String(text || "").split(/\r?\n/);

  let page = pdfDoc.addPage();
  let { width, height } = page.getSize();
  let y = height - pageMargin;

  const drawLine = (line) => {
    page.drawText(line, {
      x: pageMargin,
      y,
      size: fontSize,
      font,
    });
  };

  // Optional title
  if (title) {
    const titleText = String(title);
    page.drawText(titleText, {
      x: pageMargin,
      y,
      size: 18,
      font,
    });
    y -= lineHeight * 2;
  }

  for (const rawLine of lines) {
    let line = rawLine;
    // Basic word wrapping
    while (line.length > 0) {
      const maxCharsPerLine = 90;
      let chunk = line.slice(0, maxCharsPerLine);
      const lastSpace = chunk.lastIndexOf(" ");
      if (lastSpace > 40 && lastSpace < chunk.length - 1) {
        chunk = chunk.slice(0, lastSpace);
      }

      if (y < pageMargin) {
        page = pdfDoc.addPage();
        ({ width, height } = page.getSize());
        y = height - pageMargin;
      }

      drawLine(chunk);
      y -= lineHeight;
      line = line.slice(chunk.length).trimStart();
    }

    // Extra line for original newline
    y -= lineHeight;
    if (y < pageMargin) {
      page = pdfDoc.addPage();
      ({ width, height } = page.getSize());
      y = height - pageMargin;
    }
  }

  const pdfBytes = await pdfDoc.save();
  return Buffer.from(pdfBytes);
}


