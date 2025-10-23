import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Send, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { queryClient, apiRequest } from "@/lib/queryClient";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

export const AITutor = () => {
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  const { data: messages = [], isLoading } = useQuery<Message[]>({
    queryKey: ["/api/messages"],
  });

  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      return apiRequest("/api/messages", {
        method: "POST",
        body: JSON.stringify({ content }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
      setInput("");
    },
  });

  const handleSend = () => {
    if (!input.trim() || sendMessageMutation.isPending) return;
    sendMessageMutation.mutate(input);
  };

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const suggestions = [
    "Explain Newton's 3rd Law",
    "Help me with Calculus",
    "Quiz me on Chemistry",
    "What's the Pythagorean theorem?",
  ];

  return (
    <div className="flex flex-col h-[calc(100vh-8rem)] md:h-[calc(100vh-4rem)] px-4">
      {/* Header */}
      <div className="py-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="p-3 bg-gradient-primary rounded-2xl">
            <Sparkles className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-xl font-bold">AI Tutor</h2>
            <p className="text-sm text-muted-foreground">Ask me anything!</p>
          </div>
        </div>
      </div>

      {/* Messages */}
      <ScrollArea className="flex-1 py-6" ref={scrollRef}>
        <div className="space-y-4 pb-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
            </div>
          ) : messages.length === 0 ? (
            <Card className="p-8 text-center">
              <Sparkles className="w-12 h-12 mx-auto mb-4 text-primary" />
              <h3 className="text-lg font-bold mb-2">Welcome to AI Tutor!</h3>
              <p className="text-muted-foreground mb-4">
                I'm here to help you learn and understand any topic. Ask me anything!
              </p>
            </Card>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <Card
                  className={`max-w-[85%] p-4 ${
                    msg.role === "user"
                      ? "bg-gradient-primary text-primary-foreground"
                      : "bg-card border-border/50"
                  }`}
                  data-testid={`message-${msg.role}`}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.content}</p>
                </Card>
              </div>
            ))
          )}
          {sendMessageMutation.isPending && (
            <div className="flex justify-start">
              <Card className="p-4 bg-card">
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm text-muted-foreground">AI is thinking...</span>
                </div>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Suggestions */}
      {messages.length <= 1 && !sendMessageMutation.isPending && (
        <div className="py-3 border-t border-border">
          <div className="flex gap-2 overflow-x-auto pb-2">
            {suggestions.map((suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                className="whitespace-nowrap"
                onClick={() => setInput(suggestion)}
                data-testid={`button-suggestion-${suggestion.toLowerCase().replace(/\s+/g, '-')}`}
              >
                {suggestion}
              </Button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="py-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && !e.shiftKey && handleSend()}
            placeholder="Ask your question..."
            className="flex-1"
            disabled={sendMessageMutation.isPending}
            data-testid="input-message"
          />
          <Button
            onClick={handleSend}
            size="icon"
            className="bg-gradient-primary"
            disabled={!input.trim() || sendMessageMutation.isPending}
            data-testid="button-send"
          >
            {sendMessageMutation.isPending ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Send className="w-4 h-4" />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};
