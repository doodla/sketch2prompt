/**
 * Package Registry Types
 *
 * Shared type definitions for package data across all registries.
 * Split by registry to enable programmatic version updates via official APIs.
 */

/** Supported package registries */
export type PackageRegistry = 'npm' | 'pypi' | 'nuget' | 'maven' | 'cargo' | 'go'

/** Package information for a known dependency */
export interface KnownPackage {
  /** Package name as used by the registry */
  name: string
  /** Version constraint (e.g., "^5.9.0", ">=0.125.0") */
  version: string
  /** Human-readable purpose description */
  purpose: string
  /** Official documentation URL */
  docs: string
  /** Which registry this package belongs to */
  registry: PackageRegistry
  /** True if this is a required companion (e.g., uvicorn for fastapi) */
  isCompanion?: boolean
}

/** Registry-specific package collection */
export type PackageCollection = Record<string, KnownPackage[]>
