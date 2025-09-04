export const setAuth = (role: string, token?: string) => {
  localStorage.setItem("role", role);
  if (token) localStorage.setItem("token", token);
};

export const getRole = (): string | null => {
  return localStorage.getItem("role");
};

export const getToken = (): string | null => {
  return localStorage.getItem("token");
};

export const logout = () => {
  localStorage.removeItem("role");
  localStorage.removeItem("token");
};
