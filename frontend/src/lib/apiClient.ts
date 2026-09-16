// API Client helper to communicate with the Java 17 Spring Boot Backend API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";
const AUTH_BASE_URL = process.env.NEXT_PUBLIC_AUTH_URL || "http://localhost:8080/api/auth";

export async function fetchFromBackend<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const base = endpoint.startsWith("/auth") ? "http://localhost:8080/api" : API_BASE_URL;
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${base}${cleanEndpoint}`;

  const defaultHeaders: Record<string, string> = {
    "Content-Type": "application/json",
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
    // Don't cache by default for dynamic basketball data
    cache: "no-store",
  });

  if (!response.ok) {
    let errorMessage = `API Error (${response.status}): ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.error) errorMessage = errorData.error;
      if (errorData.message) errorMessage = errorData.message;
    } catch {
      // JSON parsing failed, use default status text
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

// Helper methods for clubs, offers and players
export async function getClubsFromBackend() {
  return fetchFromBackend<any[]>("/clubs");
}

export async function getOffresFromBackend(params?: { poste?: string; niveau?: string; ville?: string }) {
  const query = new URLSearchParams();
  if (params?.poste && params.poste !== "Tous") query.append("poste", params.poste);
  if (params?.niveau && params.niveau !== "Tous") query.append("niveau", params.niveau);
  if (params?.ville && params.ville !== "Toutes") query.append("ville", params.ville);

  const queryString = query.toString() ? `?${query.toString()}` : "";
  return fetchFromBackend<any[]>(`/offres${queryString}`);
}

export async function getJoueursFromBackend(params?: { poste?: string; niveau?: string; club?: string }) {
  const query = new URLSearchParams();
  if (params?.poste) query.append("poste", params.poste);
  if (params?.niveau) query.append("niveau", params.niveau);
  if (params?.club) query.append("club", params.club);

  const queryString = query.toString() ? `?${query.toString()}` : "";
  return fetchFromBackend<any[]>(`/joueurs${queryString}`);
}

// Admin helpers
export async function getAdminStats() {
  return fetchFromBackend<any>("/admin/stats");
}

export async function getClubById(id: string) {
  return fetchFromBackend<any>(`/clubs/${id}`);
}

export async function getEvenementsValides() {
  return fetchFromBackend<any[]>("/evenements");
}

export async function getLicencesEnAttente() {
  return fetchFromBackend<any[]>("/admin/licences/en-attente");
}

