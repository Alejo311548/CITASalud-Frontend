const API_URL = "http://localhost:8080";

export async function get(path: string) {
  const res = await fetch(`${API_URL}${path}`);
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

export async function post(path: string, data: any) {
  const res = await fetch(`${API_URL}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
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
    return { message: await res.text() }; // Devuelve objeto con mensaje
  }
}

