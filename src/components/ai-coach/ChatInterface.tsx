import React, { useState } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import ChatMessage from "./ChatMessage";
import ChatInput from "./ChatInput";

interface Message {
  id: string;
  type: "user" | "ai";
  message: string;
  timestamp: string;
}

interface ChatInterfaceProps {
  messages?: Message[];
  onSendMessage?: (message: string) => Promise<void>;
  onStartRecording?: () => Promise<void>;
  onAttachFile?: (file: File) => Promise<void>;
  isLoading?: boolean;
  isRecording?: boolean;
  userAvatar?: string;
  userName?: string;
}

const ChatInterface = ({
  messages = [
    {
      id: "1",
      type: "ai",
      message: "Hello! I'm your AI Goal Coach. How can I help you today?",
      timestamp: new Date().toLocaleTimeString(),
    },
  ],
  onSendMessage = async () => {},
  onStartRecording = async () => {},
  onAttachFile = async () => {},
  isLoading = false,
  isRecording = false,
  userAvatar = "https://dummyimage.com/200/cccccc/666666&text=U",
  userName = "User",
}: ChatInterfaceProps) => {
  return (
    <Card className="w-[800px] h-[600px] flex flex-col bg-background">
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <ChatMessage
              key={message.id}
              type={message.type}
              message={message.message}
              timestamp={message.timestamp}
              avatar={userAvatar}
              name={userName}
            />
          ))}
          {isLoading && (
            <ChatMessage
              type="ai"
              message="Thinking..."
              timestamp={new Date().toLocaleTimeString()}
            />
          )}
        </div>
      </ScrollArea>

      <ChatInput
        onSendMessage={onSendMessage}
        onStartRecording={onStartRecording}
        onAttachFile={onAttachFile}
        isLoading={isLoading}
        isRecording={isRecording}
        placeholder="Ask me about your goals or type a message..."
      />
    </Card>
  );
};

export default ChatInterface;
