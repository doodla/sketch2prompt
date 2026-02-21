import { describe, it, expect } from 'vitest'
import { sanitizeAIContent, sanitizeUserInput } from './sanitize'

describe('sanitizeAIContent', () => {
  it('returns empty string for undefined', () => {
    expect(sanitizeAIContent(undefined)).toBe('')
  })

  it('returns empty string for empty string', () => {
    expect(sanitizeAIContent('')).toBe('')
  })

  it('passes through plain text unchanged', () => {
    expect(sanitizeAIContent('Hello world')).toBe('Hello world')
  })

  it('strips <script> blocks', () => {
    expect(sanitizeAIContent('<script>alert(1)</script>')).toBe('')
    expect(sanitizeAIContent('before<script>evil()</script>after')).toBe('beforeafter')
  })

  it('strips multiline <script> blocks', () => {
    const input = '<script>\nconst x = 1\nalert(x)\n</script>text'
    expect(sanitizeAIContent(input)).toBe('text')
  })

  it('strips quoted event handlers', () => {
    expect(sanitizeAIContent('foo onclick="alert(1)" bar')).toBe('foo  bar')
    expect(sanitizeAIContent("foo onerror='xss()' bar")).toBe('foo  bar')
  })

  it('strips unquoted event handlers', () => {
    expect(sanitizeAIContent('foo onclick=alert(1) bar')).toBe('foo  bar')
    expect(sanitizeAIContent('img onload=steal()')).toBe('img')
  })

  it('strips javascript: protocol', () => {
    expect(sanitizeAIContent('javascript:alert(1)')).toBe('alert(1)')
  })

  it('strips javascript: with internal whitespace', () => {
    // Whitespace inside "java script:" should also be stripped
    expect(sanitizeAIContent('java\tscript:alert(1)')).toBe('alert(1)')
  })

  it('strips data:text/html protocol', () => {
    expect(sanitizeAIContent('data:text/html,<h1>xss</h1>')).toBe(',<h1>xss</h1>')
  })

  it('does NOT HTML-entity-encode angle brackets (React handles escaping)', () => {
    // If we encoded < to &lt;, React would double-escape to &amp;lt;
    expect(sanitizeAIContent('a < b')).toBe('a < b')
    expect(sanitizeAIContent('1 > 0')).toBe('1 > 0')
  })

  it('preserves meaningful content after stripping', () => {
    const input = 'Use <b>bold</b> text and onclick=action()'
    const result = sanitizeAIContent(input)
    expect(result).toContain('bold')
    expect(result).not.toContain('onclick')
  })

  it('truncates content exceeding max length', () => {
    const longContent = 'a'.repeat(3000)
    const result = sanitizeAIContent(longContent)
    expect(result.length).toBeLessThanOrEqual(2000)
  })

  it('handles case-insensitive script tags', () => {
    expect(sanitizeAIContent('<SCRIPT>alert(1)</SCRIPT>')).toBe('')
    expect(sanitizeAIContent('<Script>evil()</Script>')).toBe('')
  })
})

describe('sanitizeUserInput', () => {
  it('applies the same dangerous-pattern stripping', () => {
    expect(sanitizeUserInput('<script>xss()</script>hello')).toBe('hello')
  })

  it('truncates to default max length of 500', () => {
    const input = 'x'.repeat(600)
    expect(sanitizeUserInput(input).length).toBeLessThanOrEqual(500)
  })

  it('respects a custom max length', () => {
    const input = 'hello world'
    expect(sanitizeUserInput(input, 5)).toBe('hello')
  })

  it('returns empty string for undefined', () => {
    expect(sanitizeUserInput(undefined)).toBe('')
  })
})
