"use client";

import { useState } from "react";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Card } from "@/components/ui/Primitives";
import { useToast } from "@/providers/ToastProvider";

interface ChatResult {
  reply: string;
  suggestions: string[];
  chat?: { _id: string };
}

export default function CareerChatPage() {
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [chatId, setChatId] = useState<string>();
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Array<{ role: "user" | "assistant"; content: string }>>([]);
  const [suggestions, setSuggestions] = useState<string[]>([]);

  const send = async (text: string) => {
    if (!text.trim()) return;
    setLoading(true);
    setMessages((prev) => [...prev, { role: "user", content: text }]);
    setMessage("");
    try {
      const res = await api.post<ChatResult>("/api/ai/chat", { message: text, chatId });
      setChatId(res.data.chat?._id);
      setMessages((prev) => [...prev, { role: "assistant", content: res.data.reply }]);
      setSuggestions(res.data.suggestions || []);
    } catch (error) {
      toast({
        type: "error",
        title: "Chat failed",
        description: error instanceof Error ? error.message : "Try again",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-4">
      <h2 className="text-2xl font-semibold">AI Career Assistant</h2>
      <Card className="min-h-[520px] flex flex-col">
        <div className="flex-1 space-y-3 overflow-y-auto">
          {!messages.length ? (
            <p className="text-sm text-muted">
              Ask about resume strategy, salary ranges, interview prep, or how to navigate HireGenius.
            </p>
          ) : null}
          {messages.map((item, index) => (
            <div
              key={`${item.role}-${index}`}
              className={`max-w-[85%] rounded-[16px] px-4 py-3 text-sm ${
                item.role === "user"
                  ? "ml-auto bg-primary text-white"
                  : "bg-background text-muted"
              }`}
            >
              {item.content}
            </div>
          ))}
          {loading ? <p className="text-sm text-muted">Thinking…</p> : null}
        </div>
        {suggestions.length ? (
          <div className="mt-4 flex flex-wrap gap-2">
            {suggestions.map((item) => (
              <Button key={item} size="sm" variant="outline" onClick={() => send(item)}>
                {item}
              </Button>
            ))}
          </div>
        ) : null}
        <form
          className="mt-4 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            void send(message);
          }}
        >
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Ask your career coach…"
            aria-label="Chat message"
          />
          <Button type="submit" loading={loading}>
            Send
          </Button>
        </form>
      </Card>
    </div>
  );
}
