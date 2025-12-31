/**
 * Cargo Registry Packages (Rust)
 *
 * All known packages from crates.io.
 * Versions verified as of 2025-12-22.
 *
 * Registry URL: https://crates.io/crates/{name}
 */

import type { PackageCollection } from './types'

export const CARGO_PACKAGES: PackageCollection = {
  // ============================================================================
  // LANGUAGES
  // ============================================================================
  Rust: [
    {
      name: 'rust',
      version: '>=1.83',
      purpose: 'Rust toolchain',
      docs: 'https://doc.rust-lang.org/',
      registry: 'cargo',
    },
  ],

  // ============================================================================
  // BACKEND FRAMEWORKS
  // ============================================================================
  'Actix Web': [
    {
      name: 'actix-web',
      version: '>=4.11.0',
      purpose: 'High-performance Rust web framework',
      docs: 'https://actix.rs/docs',
      registry: 'cargo',
    },
    {
      name: 'tokio',
      version: '>=1.48.0',
      purpose: 'Async runtime for Rust',
      docs: 'https://tokio.rs',
      registry: 'cargo',
      isCompanion: true,
    },
  ],
}
