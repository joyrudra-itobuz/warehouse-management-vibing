import { useCallback, useRef } from "react";

import chatRoutes from "@/lib/apis/routes/chat-routes";
import { parseMarkdownResponse } from "@/lib/utils/common/parse-markdown-response/parse-markdown-response";
import { useChatStore } from "@/stores/chat";
import type { ChatMessageDto } from "@/types/apis/chat/chat-types/chat-types";

/**
 * Try to extract a sessionId from a single SSE line.
 * Handles both raw JSON objects and `data: {...}` prefixed SSE events.
 * Returns the session ID string or null.
 */
function extractSessionIdFromLine(line: string): string | null {
  const trimmed = line.trim();
  if (!trimmed) return null;

  // Strip optional SSE prefix
  const jsonStr = trimmed.startsWith("data:")
    ? trimmed.slice(5).trim()
    : trimmed;

  if (!jsonStr.startsWith("{")) return null;

  try {
    const obj = JSON.parse(jsonStr) as Record<string, unknown>;
    if (typeof obj.sessionId === "string" && obj.sessionId) {
      return obj.sessionId;
    }
  } catch {
    // not valid JSON — that's fine, most chunks are plain text
  }

  return null;
}

export function useChatStream() {
  const abortControllerRef = useRef<AbortController | null>(null);

  const pushMessage = useChatStore((state) => state.pushMessage);
  const setIsStreaming = useChatStore((state) => state.setIsStreaming);
  const appendStreamingChunk = useChatStore(
    (state) => state.appendStreamingChunk,
  );
  const finalizeStreaming = useChatStore((state) => state.finalizeStreaming);
  const setStreamingContent = useChatStore(
    (state) => state.setStreamingContent,
  );
  const setStreamingParsed = useChatStore((state) => state.setStreamingParsed);
  const setActiveSession = useChatStore((state) => state.setActiveSession);

  const streamMessage = useCallback(
    async function streamMessage(payload: ChatMessageDto) {
      // Cancel any previous in-flight stream
      abortControllerRef.current?.abort();
      const controller = new AbortController();
      abortControllerRef.current = controller;

      // Reset streaming state and seed an in-progress assistant bubble
      setStreamingContent("");
      setIsStreaming(true);

      pushMessage({
        id: `assistant-${Date.now()}`,
        role: "assistant",
        content: "",
        status: "streaming",
        createdAt: new Date().toISOString(),
      });

      try {
        const response = await chatRoutes.streamMessage(
          payload,
          controller.signal,
        );

        // Capture session id — first try the response header,
        // then fall back to the first SSE chunk that contains it
        // (needed when CORS blocks Access-Control-Expose-Headers).
        const headerSessionId = response.headers.get("X-Session-Id");
        if (headerSessionId) {
          setActiveSession(headerSessionId);
        }

        if (!response.body) {
          throw new Error("No response body from stream endpoint");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let accumulated = "";
        let sessionResolved = !!headerSessionId;

        while (true) {
          const { value, done } = await reader.read();

          if (done) {
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          accumulated += chunk;
          appendStreamingChunk(chunk);

          // Check all new lines in this chunk for an embedded session ID
          if (!sessionResolved) {
            for (const line of chunk.split("\n")) {
              const sid = extractSessionIdFromLine(line);
              if (sid) {
                setActiveSession(sid);
                sessionResolved = true;
                break;
              }
            }
          }

          // Progressive parse: format the bubble as data arrives
          // Only attempt when the accumulated text has a section heading
          if (accumulated.includes("# ")) {
            const progressParsed = parseMarkdownResponse(accumulated);
            if (progressParsed) {
              setStreamingParsed(progressParsed);
            }
          }
        }

        const parsed = parseMarkdownResponse(accumulated) ?? undefined;
        finalizeStreaming(parsed);
      } catch (err) {
        if ((err as Error).name === "AbortError") {
          finalizeStreaming();
          return;
        }

        finalizeStreaming();
        throw err;
      }
    },
    [
      appendStreamingChunk,
      finalizeStreaming,
      pushMessage,
      setActiveSession,
      setIsStreaming,
      setStreamingContent,
      setStreamingParsed,
    ],
  );

  const cancelStream = useCallback(function cancelStream() {
    abortControllerRef.current?.abort();
  }, []);

  return { streamMessage, cancelStream };
}
