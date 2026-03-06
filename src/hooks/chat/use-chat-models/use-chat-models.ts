import { useQuery } from "@tanstack/react-query";

import chatRoutes from "@/lib/apis/routes/chat-routes";

export const CHAT_MODELS_QUERY_KEY = ["chat", "models"] as const;

/**
 * Fetches the list of available Ollama models from /chat/models.
 * Results are cached for 5 minutes — model list rarely changes mid-session.
 */
export function useChatModels() {
  return useQuery({
    queryKey: CHAT_MODELS_QUERY_KEY,
    queryFn: function fetchChatModels() {
      return chatRoutes.getModels();
    },
    staleTime: 5 * 60_000,
    retry: 1,
  });
}
