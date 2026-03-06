type RequestMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

type RequestOptions<TPayload> = {
  path: string;
  method?: RequestMethod;
  payload?: TPayload;
  headers?: HeadersInit;
};

type ErrorWithMessage = {
  message?: string | string[];
};

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://192.168.68.134:3001";

const getApiUrl = (path: string) => {
  if (!API_BASE_URL) {
    return path;
  }

  return `${API_BASE_URL}${path}`;
};

const getAccessToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("access_token");
};

const parseErrorMessage = (errorBody: unknown) => {
  if (!errorBody || typeof errorBody !== "object") {
    return "Request failed. Please try again.";
  }

  const message = (errorBody as ErrorWithMessage).message;

  if (Array.isArray(message)) {
    return message.join(", ");
  }

  if (typeof message === "string" && message.trim()) {
    return message;
  }

  return "Request failed. Please try again.";
};

const request = async <TResponse, TPayload = unknown>({
  path,
  method = "GET",
  payload,
  headers,
}: RequestOptions<TPayload>): Promise<TResponse> => {
  const accessToken = getAccessToken();

  const response = await fetch(getApiUrl(path), {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
      ...headers,
    },
    body: payload === undefined ? undefined : JSON.stringify(payload),
  });

  if (!response.ok) {
    let parsedErrorBody: unknown;

    try {
      parsedErrorBody = await response.json();
    } catch {
      parsedErrorBody = null;
    }

    throw new Error(parseErrorMessage(parsedErrorBody));
  }

  if (response.status === 204) {
    return {} as TResponse;
  }

  try {
    return (await response.json()) as TResponse;
  } catch {
    return {} as TResponse;
  }
};

export default request;
