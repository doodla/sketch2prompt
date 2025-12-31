/**
 * Go Module Registry Packages
 *
 * All known Go modules.
 * Versions verified as of 2025-12-22.
 *
 * Registry URL: https://pkg.go.dev/{name}
 */

import type { PackageCollection } from './types'

export const GO_PACKAGES: PackageCollection = {
  // ============================================================================
  // LANGUAGES
  // ============================================================================
  Go: [
    {
      name: 'go',
      version: '>=1.23',
      purpose: 'Go runtime',
      docs: 'https://go.dev/doc/',
      registry: 'go',
    },
  ],

  // ============================================================================
  // BACKEND FRAMEWORKS
  // ============================================================================
  Gin: [
    {
      name: 'github.com/gin-gonic/gin',
      version: 'v1.11.0',
      purpose: 'Go HTTP framework',
      docs: 'https://gin-gonic.com',
      registry: 'go',
    },
  ],
}
