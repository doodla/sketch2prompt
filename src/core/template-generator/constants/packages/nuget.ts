/**
 * NuGet Registry Packages (.NET)
 *
 * All known packages from NuGet.
 * Versions verified as of 2025-12-22.
 *
 * Registry URL: https://www.nuget.org/packages/{name}
 */

import type { PackageCollection } from './types'

export const NUGET_PACKAGES: PackageCollection = {
  // ============================================================================
  // LANGUAGES
  // ============================================================================
  'C# / .NET': [
    {
      name: 'dotnet',
      version: '>=10.0',
      purpose: '.NET runtime',
      docs: 'https://learn.microsoft.com/dotnet',
      registry: 'nuget',
    },
  ],

  // ============================================================================
  // BACKEND FRAMEWORKS
  // ============================================================================
  'ASP.NET Core': [
    {
      name: 'Microsoft.AspNetCore.App.Ref',
      version: '10.0.1',
      purpose: 'ASP.NET Core runtime',
      docs: 'https://learn.microsoft.com/aspnet/core',
      registry: 'nuget',
    },
  ],
}
