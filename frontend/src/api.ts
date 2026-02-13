import type { HealthResponse, RulesResponse } from "./types";

async function request<T>(path: string): Promise<T> {
  const response = await fetch(path);
  if (!response.ok) {
    throw new Error(`Request failed: ${response.status}`);
  }
  return (await response.json()) as T;
}

export const getHealth = () => request<HealthResponse>("/api/health");
export const getRules = () => request<RulesResponse>("/api/rules");
