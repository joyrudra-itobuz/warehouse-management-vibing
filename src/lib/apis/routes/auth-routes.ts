import type {
  ApiErrorShape,
  LoginDto,
  SignupDto,
} from "@/lib/apis/swagger/auth-types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://localhost:3001";

const getApiUrl = (path: string) => {
  if (!API_BASE_URL) {
    return path;
  }

  return `${API_BASE_URL}${path}`;
};

const getErrorMessage = (errorBody: ApiErrorShape | null) => {
  if (!errorBody?.message) {
    return "Request failed. Please try again.";
  }

  if (Array.isArray(errorBody.message)) {
    return errorBody.message.join(", ");
  }

  return errorBody.message;
};

const post = async <TPayload extends object, TResponse>(
  path: string,
  payload: TPayload,
): Promise<TResponse> => {
  const response = await fetch(getApiUrl(path), {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    let parsedErrorBody: ApiErrorShape | null = null;

    try {
      parsedErrorBody = (await response.json()) as ApiErrorShape;
    } catch {
      parsedErrorBody = null;
    }

    throw new Error(getErrorMessage(parsedErrorBody));
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

const authRoutes = {
  signup: async (payload: SignupDto) => {
    return post<SignupDto, unknown>("/user/auth/signup", payload);
  },
  login: async (payload: LoginDto) => {
    return post<LoginDto, unknown>("/user/auth/login", payload);
  },
};

export default authRoutes;
