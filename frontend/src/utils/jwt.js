export const decodeToken = (token) => {
  if (!token) {
    return null;
  }

  try {
    const payload = token.split('.')[1];
    const base64 = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '='));
    return JSON.parse(decoded);
  } catch (error) {
    return null;
  }
};

export const isTokenExpired = (token) => {
  const payload = decodeToken(token);
  if (!payload || !payload.exp) {
    return true;
  }

  return Date.now() >= payload.exp * 1000;
};

export const roleHomePath = (role) => {
  if (role === 'teacher') return '/teacher';
  if (role === 'admin') return '/admin';
  return '/student';
};
