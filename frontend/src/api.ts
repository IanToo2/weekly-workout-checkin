import type {
  ApiErrorResponse,
  CreateCheckinRequest,
  CreateCheckinResponse,
  HealthResponse,
  RulesResponse,
  WeeklyStatusResponse,
} from "./types";

type RequestOptions = {
  method?: "GET" | "POST";
  body?: unknown;
};

export class ApiRequestError extends Error {
  status: number;
  code?: string;

  constructor(status: number, message: string, code?: string) {
    super(message);
    this.name = "ApiRequestError";
    this.status = status;
    this.code = code;
  }
}

async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const response = await fetch(path, {
    method: options.method ?? "GET",
    headers: {
      "Content-Type": "application/json",
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const isJson = response.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? ((await response.json()) as unknown) : null;

  if (!response.ok) {
    const apiError = payload as ApiErrorResponse | null;
    const message = apiError?.message ?? `Request failed: ${response.status}`;
    throw new ApiRequestError(response.status, message, apiError?.code);
  }

  return payload as T;
}

export const getHealth = () => request<HealthResponse>("/api/health");
export const getRules = () => request<RulesResponse>("/api/rules");

export const createCheckin = (input: CreateCheckinRequest) =>
  request<CreateCheckinResponse>("/api/checkins", {
    method: "POST",
    body: input,
  });

export const getWeeklyStatus = (groupId: number, memberId: number, date?: string) => {
  const params = new URLSearchParams({
    groupId: String(groupId),
    memberId: String(memberId),
  });
  if (date) {
    params.set("date", date);
  }

  return request<WeeklyStatusResponse>(`/api/weekly-status?${params.toString()}`);
};
