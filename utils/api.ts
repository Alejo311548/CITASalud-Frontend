const API_URL = "https://citasalud-backend-1.onrender.com";

export async function get(path: string, options?: RequestInit) {
  const res = await fetch(`${API_URL}${path}`, options);
  if (!res.ok) {
    let errorMessage = `Error en GET ${path}: ${res.status} ${res.statusText}`;
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }
  return res.json();
}

export async function post(path: string, data: any, options?: RequestInit) {
  const token = localStorage.getItem("token");

  const defaultHeaders = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };

  const headers = {
    ...defaultHeaders,
    ...(options?.headers || {}),
  };

  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    ...options,
    headers,
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let errorMessage = `Error en POST ${path}: ${res.status} ${res.statusText}`;
    try {
      const errorData = await res.json();
      errorMessage = errorData.message || errorData.error || errorMessage;
    } catch {}
    throw new Error(errorMessage);
  }

  const contentType = res.headers.get("content-type");
  if (contentType?.includes("application/json")) {
    return res.json();
  } else {
    return { message: await res.text() };
  }
}
