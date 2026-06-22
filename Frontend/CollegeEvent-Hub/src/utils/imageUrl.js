export function resolveImageUrl(path) {
  if (!path) {
    return null;
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  return `http://localhost:8080${path}`;
}
