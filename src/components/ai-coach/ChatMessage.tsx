import React from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  type?: "user" | "ai";
  message?: string;
  timestamp?: string;
  avatar?: string;
  name?: string;
}

const ChatMessage = ({
  type = "user",
  message = "This is a sample message",
  timestamp = new Date().toLocaleTimeString(),
  avatar = "https://dummyimage.com/200/cccccc/666666&text=U",
  name = "User",
}: ChatMessageProps) => {
  const isAI = type === "ai";

  return (
    <div className={`flex gap-4 p-4 ${isAI ? "bg-muted/50" : "bg-background"}`}>
      <Avatar className="h-8 w-8">
        {isAI ? (
          <Bot className="h-5 w-5 text-primary" />
        ) : (
          <AvatarImage src={avatar} alt={name} />
        )}
        <AvatarFallback>
          {isAI ? <Bot className="h-5 w-5" /> : <User className="h-5 w-5" />}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 space-y-1">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">
            {isAI ? "AI Coach" : name}
          </span>
          <span className="text-xs text-muted-foreground">{timestamp}</span>
        </div>
        <p className="text-sm text-foreground/90">{message}</p>
      </div>
    </div>
  );
};

export default ChatMessage;
