import { useCallback, useRef } from "react";

import chatRoutes from "@/lib/apis/routes/chat-routes";
import { useChatStore } from "@/stores/chat";
import type { ChatMessageDto } from "@/types/apis/chat/chat-types/chat-types";

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

        // Capture session id from header
        const returnedSessionId = response.headers.get("X-Session-Id");
        if (returnedSessionId) {
          setActiveSession(returnedSessionId);
        }

        if (!response.body) {
          throw new Error("No response body from stream endpoint");
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { value, done } = await reader.read();

          if (done) {
            break;
          }

          const chunk = decoder.decode(value, { stream: true });
          appendStreamingChunk(chunk);
        }

        finalizeStreaming();
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
    ],
  );

  const cancelStream = useCallback(function cancelStream() {
    abortControllerRef.current?.abort();
  }, []);

  return { streamMessage, cancelStream };
}
