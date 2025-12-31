/**
 * Maven Registry Packages (Java)
 *
 * All known packages from Maven Central.
 * Versions verified as of 2025-12-22.
 *
 * Registry URL: https://search.maven.org/artifact/{groupId}/{artifactId}
 */

import type { PackageCollection } from './types'

export const MAVEN_PACKAGES: PackageCollection = {
  // ============================================================================
  // LANGUAGES
  // ============================================================================
  Java: [
    {
      name: 'java',
      version: '>=21',
      purpose: 'Java runtime (LTS)',
      docs: 'https://docs.oracle.com/en/java/',
      registry: 'maven',
    },
  ],

  // ============================================================================
  // BACKEND FRAMEWORKS
  // ============================================================================
  'Spring Boot': [
    {
      name: 'org.springframework.boot:spring-boot-starter-webmvc',
      version: '4.0.1',
      purpose: 'Spring Boot web starter',
      docs: 'https://spring.io/projects/spring-boot',
      registry: 'maven',
    },
  ],
}
