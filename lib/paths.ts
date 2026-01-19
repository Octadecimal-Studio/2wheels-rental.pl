// Helper do ścieżek obrazów - działa w dev i production
export function getAssetPath(relativePath: string): string {
  // Zapewnij, że relativePath zaczyna się od /
  const cleanPath = relativePath.startsWith('/') ? relativePath : `/${relativePath}`;
  return cleanPath;
}

// Alias dla kompatybilności
export const getImagePath = getAssetPath;
