import { apiOrigin } from '../api/axiosConfig';

export function resolveImageUrl(path) {
  if (!path) {
    return null;
  }

  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  return `${apiOrigin}${path.startsWith('/') ? path : `/${path}`}`;
}
