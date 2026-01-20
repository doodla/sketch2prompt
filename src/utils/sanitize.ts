/**
 * Sanitizes user/AI-generated text to prevent XSS attacks
 * Escapes HTML special characters
 */
export function sanitizeText(text: string): string {
  if (!text) return ''

  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;')
    .replace(/\//g, '&#x2F;')
}

/**
 * Sanitizes AI-generated content for safe rendering
 * Use this for all AI-generated labels, descriptions, and user input
 *
 * @example
 * ```tsx
 * <div>{sanitizeAIContent(aiGeneratedLabel)}</div>
 * ```
 */
export function sanitizeAIContent(content: string | undefined): string {
  if (!content) return ''

  // Remove any script tags and event handlers
  let sanitized = content
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/on\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/javascript:/gi, '')

  // Escape HTML
  sanitized = sanitizeText(sanitized)

  return sanitized
}
