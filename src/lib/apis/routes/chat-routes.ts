import request from "@/lib/apis/http/request/request";
import type {
  ChatApiResponse,
  ChatDeleteResponse,
  ChatMessageDto,
  ChatModelItem,
  ChatSessionDetailResponse,
  ChatSessionsResponse,
} from "@/types/apis/chat/chat-types/chat-types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE ?? "http://192.168.68.134:3001";

const getAccessToken = () => {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem("access_token");
};

/**
 * POST /chat/message — non-streaming. Returns full parsed response JSON.
 */
function sendMessage(payload: ChatMessageDto) {
  return request<ChatApiResponse, ChatMessageDto>({
    path: "/chat/message",
    method: "POST",
    payload,
  });
}

/**
 * POST /chat/stream — SSE streaming endpoint.
 * Returns a raw Response so the caller can:
 *   - read X-Session-Id header
 *   - pipe ReadableStream chunks
 */
async function streamMessage(
  payload: ChatMessageDto,
  signal?: AbortSignal,
): Promise<Response> {
  const accessToken = getAccessToken();

  const response = await fetch(`${API_BASE_URL}/chat/stream`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    body: JSON.stringify(payload),
    signal,
  });

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new Error(`Stream request failed: ${response.status} ${text}`);
  }

  return response;
}

/**
 * GET /chat/sessions — list all sessions for current user.
 */
function getSessions() {
  return request<ChatSessionsResponse>({
    path: "/chat/sessions",
    method: "GET",
  });
}

/**
 * GET /chat/sessions/:sessionId — full session history.
 */
function getSession(sessionId: string) {
  return request<ChatSessionDetailResponse>({
    path: `/chat/sessions/${sessionId}`,
    method: "GET",
  });
}

/**
 * DELETE /chat/sessions/:sessionId
 */
function deleteSession(sessionId: string) {
  return request<ChatDeleteResponse>({
    path: `/chat/sessions/${sessionId}`,
    method: "DELETE",
  });
}

/**
 * GET /chat/models — list available Ollama models.
 * Returns a raw array: [{id, name}, ...]
 */
function getModels() {
  return request<ChatModelItem[]>({
    path: "/chat/models",
    method: "GET",
  });
}

const chatRoutes = {
  sendMessage,
  streamMessage,
  getSessions,
  getSession,
  deleteSession,
  getModels,
};

export default chatRoutes;
