/**
 * Resolves a file path/URL to an accessible URL.
 * Handles:
 * - Full URLs (http://, https://, data:, blob:)
 * - Relative upload paths (/uploads/...)
 * - Fallback to API URL origin if configured
 */
export const getFileUrl = (path) => {
  if (!path) return '';
  if (
    path.startsWith('http://') ||
    path.startsWith('https://') ||
    path.startsWith('data:') ||
    path.startsWith('blob:')
  ) {
    return path;
  }

  const cleanPath = path.startsWith('/') ? path : `/${path}`;

  const apiUrl = import.meta.env.VITE_API_URL || '';
  if (apiUrl.startsWith('http://') || apiUrl.startsWith('https://')) {
    try {
      const urlObj = new URL(apiUrl);
      return `${urlObj.origin}${cleanPath}`;
    } catch {
      // fallback
    }
  }

  return cleanPath;
};

export default getFileUrl;

