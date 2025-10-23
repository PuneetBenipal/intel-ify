import { useState } from "react";
import { Send, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  role: "user" | "assistant";
  content: string;
}

export const AITutor = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content: "Hi! I'm your AI tutor. Ask me anything about your studies, and I'll help you understand complex concepts step by step!",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    
    // Simulate AI response
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "This is a demo response. In the full version, this would connect to an AI service to provide real-time explanations and help with your studies.",
        },
      ]);
    }, 1000);
    
    setInput("");
  };

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
      <ScrollArea className="flex-1 py-6">
        <div className="space-y-4 pb-4">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <Card
                className={`max-w-[80%] p-4 ${
                  msg.role === "user"
                    ? "bg-gradient-primary text-primary-foreground"
                    : "bg-card"
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.content}</p>
              </Card>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Suggestions */}
      <div className="py-3 border-t border-border">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {["Explain Newton's 3rd Law", "Help with Calculus", "Quiz me on Chemistry"].map(
            (suggestion) => (
              <Button
                key={suggestion}
                variant="outline"
                size="sm"
                className="whitespace-nowrap"
                onClick={() => setInput(suggestion)}
              >
                {suggestion}
              </Button>
            )
          )}
        </div>
      </div>

      {/* Input */}
      <div className="py-4 border-t border-border">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === "Enter" && handleSend()}
            placeholder="Ask your question..."
            className="flex-1"
          />
          <Button onClick={handleSend} size="icon" className="bg-gradient-primary">
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};
