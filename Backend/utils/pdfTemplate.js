// Utility to safely escape HTML entities to avoid injection issues
export function escapeHtml(str = "") {
  if (typeof str !== "string") return "";
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Validates and sanitizes base64 image data to prevent injection attacks
// Returns object with validated base64 string and MIME type, or null if validation fails
// Accepts optional imageMime parameter to override detection
function validateBase64Image(base64String, imageMime = null) {
  if (!base64String || typeof base64String !== "string") {
    return null;
  }

  // Allowed image MIME types
  const ALLOWED_MIME_TYPES = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/gif",
    "image/webp",
    "image/bmp",
  ];
  // Extract MIME type from data URI if present (data:[mime];base64,...)
  let detectedMimeFromUri = null;
  let base64Data = base64String.trim();
  
  const dataUriMatch = base64Data.match(/^data:([^;]+);base64,(.+)$/i);
  if (dataUriMatch) {
    detectedMimeFromUri = dataUriMatch[1].toLowerCase();
    base64Data = dataUriMatch[2];
  }

  // Determine MIME type priority: provided > data URI > detect from magic bytes > default
  let finalMimeType = null;
  
  if (imageMime) {
    const normalizedMime = imageMime.toLowerCase().trim();
    if (ALLOWED_MIME_TYPES.includes(normalizedMime)) {
      finalMimeType = normalizedMime;
    } else {
      // Reject unsupported MIME types
      return null;
    }
  } else if (detectedMimeFromUri) {
    if (ALLOWED_MIME_TYPES.includes(detectedMimeFromUri)) {
      finalMimeType = detectedMimeFromUri;
    } else {
      // Reject unsupported MIME types from data URI
      return null;
    }
  }

  // (1) Verify it matches strict base64 regex for data payload characters
  // Base64: A-Z, a-z, 0-9, +, /, = (padding)
  // Remove whitespace that might be present
  const cleaned = base64Data.replace(/\s/g, "");
  const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
  
  if (!base64Regex.test(cleaned)) {
    return null;
  }

  try {
    // (2) Attempt to decode and check decoded size bounds
    const decoded = Buffer.from(cleaned, "base64");
    
    // Reasonable size bounds: min 10 bytes (smallest valid image), max 10MB
    const MIN_SIZE = 10;
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    
    if (decoded.length < MIN_SIZE || decoded.length > MAX_SIZE) {
      return null;
    }

    // (3) If MIME type not yet determined, detect from magic bytes
    if (!finalMimeType) {
      const magicBytes = decoded.slice(0, 12);
      
      // PNG: 89 50 4E 47 0D 0A 1A 0A
      const isPNG = magicBytes[0] === 0x89 && 
                    magicBytes[1] === 0x50 && 
                    magicBytes[2] === 0x4E && 
                    magicBytes[3] === 0x47;
      
      // JPEG: FF D8 FF
      const isJPEG = magicBytes[0] === 0xFF && 
                     magicBytes[1] === 0xD8 && 
                     magicBytes[2] === 0xFF;
      
      // GIF: 47 49 46 38 (GIF8)
      const isGIF = magicBytes[0] === 0x47 && 
                    magicBytes[1] === 0x49 && 
                    magicBytes[2] === 0x46 && 
                    magicBytes[3] === 0x38;
      
      // WebP: RIFF...WEBP (check for RIFF at start and WEBP at offset 8)
      const isWebP = magicBytes[0] === 0x52 && 
                     magicBytes[1] === 0x49 && 
                     magicBytes[2] === 0x46 && 
                     magicBytes[3] === 0x46 &&
                     decoded.length >= 12 &&
                     magicBytes[8] === 0x57 && 
                     magicBytes[9] === 0x45 && 
                     magicBytes[10] === 0x42 && 
                     magicBytes[11] === 0x50;

      if (isPNG) {
        finalMimeType = "image/png";
      } else if (isJPEG) {
        finalMimeType = "image/jpeg";
      } else if (isGIF) {
        finalMimeType = "image/gif";
      } else if (isWebP) {
        finalMimeType = "image/webp";
      } else {
        // Fall back to image/png as sensible default if detection fails
        finalMimeType = "image/png";
      }
    }

    // Return the cleaned, validated base64 string with determined MIME type
    return {
      base64: cleaned,
      mimeType: finalMimeType
    };
  } catch (error) {
    // If decoding fails, return null
    return null;
  }
}

// Builds the HTML used for PDF generation.
// Supports optional base64 cover image and optional custom CSS override/extension.
// Accepts optional imageMime or imageType parameter to specify the image MIME type.
export function buildPdfHtml({
  title = "Document",
  text = "",
  coverImageBase64,
  imageMime,
  imageType, // Alias for imageMime for convenience
  customCss = "",
}) {
  const safeTitle = escapeHtml(title);
  const safeText = escapeHtml(text);

  // Base CSS for readable A4 layout
  const baseCss = `
    body {
      padding: 24px;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      font-size: 16px;
      line-height: 1.5;
      color: #111827;
    }
    .cover-image {
      width: 100%;
      max-height: 300px;
      object-fit: contain;
      margin-bottom: 24px;
    }
    .title {
      font-size: 24px;
      font-weight: 700;
      margin-bottom: 16px;
      color: #111827;
    }
    .content {
      white-space: pre-wrap;
      margin-top: 8px;
    }
  `;

  // (4) Validate coverImageBase64 before rendering - never trust unvalidated input
  // Use imageMime or imageType (if provided) to override detection
  const providedMimeType = imageMime || imageType;
  const validatedImage = validateBase64Image(coverImageBase64, providedMimeType);
  const coverImageHtml = validatedImage 
    ? `<img class="cover-image" src="data:${validatedImage.mimeType};base64,${validatedImage.base64}" alt="Cover" />`
    : "";

  return `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>${safeTitle}</title>
        <style>
          ${baseCss}
          ${customCss || ""}
        </style>
      </head>
      <body>
        ${coverImageHtml}
        <h1 class="title">${safeTitle}</h1>
        <div class="content">${safeText}</div>
      </body>
    </html>
  `;
}


