const API_URL = "http://localhost:8080";

export async function get(path: string) {
  const res = await fetch(`${API_URL}${path}`);
  if (!res.ok) {
    throw new Error(`Error en GET ${path}: ${res.statusText}`);
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
    throw new Error(`Error en POST ${path}: ${res.statusText}`);
  }
  return res.json();
}
