/**
 * Content sanitization utilities.
 *
 * React auto-escapes all JSX interpolations, so these functions strip
 * dangerous patterns rather than HTML-entity-encoding. Encoding here
 * would cause double-escaping and render `&lt;` as literal text.
 */

const MAX_AI_CONTENT_LENGTH = 2000
const MAX_USER_INPUT_LENGTH = 500

/**
 * Strip dangerous patterns from AI-generated text.
 * Intended for content that will be rendered via React (no dangerouslySetInnerHTML).
 */
export function sanitizeAIContent(content: string | undefined): string {
  if (!content) return ''

  // Truncate first to bound subsequent regex work
  const truncated = content.slice(0, MAX_AI_CONTENT_LENGTH)

  return truncated
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/\bon\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, '')
    .replace(/\bjava[\s\t]*script\s*:/gi, '')
    .replace(/\bdata\s*:\s*text\s*\/\s*html/gi, '')
    .trim()
}

/**
 * Strip dangerous patterns from direct user input (label, description fields).
 * Applies a tighter length cap than AI content.
 */
export function sanitizeUserInput(
  input: string | undefined,
  maxLength = MAX_USER_INPUT_LENGTH
): string {
  if (!input) return ''
  return sanitizeAIContent(input.slice(0, maxLength))
}
