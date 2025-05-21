

export function getToken(): string | null {
  return localStorage.getItem("token") || sessionStorage.getItem("token");
}

export function removeToken() {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('token');
  }
}
