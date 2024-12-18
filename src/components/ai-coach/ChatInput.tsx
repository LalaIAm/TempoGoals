import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Send, Mic, PaperclipIcon } from "lucide-react";

interface ChatInputProps {
  onSendMessage?: (message: string) => Promise<void>;
  onStartRecording?: () => Promise<void>;
  onAttachFile?: (file: File) => Promise<void>;
  isLoading?: boolean;
  isRecording?: boolean;
  placeholder?: string;
}

const ChatInput = ({
  onSendMessage = async () => {},
  onStartRecording = async () => {},
  onAttachFile = async () => {},
  isLoading = false,
  isRecording = false,
  placeholder = "Type your message...",
}: ChatInputProps) => {
  const [message, setMessage] = useState("");

  const handleSend = async () => {
    if (!message.trim()) return;
    try {
      await onSendMessage(message);
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        await onAttachFile(file);
      } catch (error) {
        console.error("Error attaching file:", error);
      }
    }
  };

  return (
    <div className="w-[700px] h-[100px] p-4 border-t bg-background">
      <div className="flex items-end gap-2">
        <div className="flex-1">
          <Textarea
            placeholder={placeholder}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            className="min-h-[60px] resize-none"
            disabled={isLoading}
          />
        </div>
        <div className="flex flex-col gap-2">
          <input
            type="file"
            id="file-upload"
            className="hidden"
            onChange={handleFileChange}
            disabled={isLoading}
          />
          <Button
            size="icon"
            variant="ghost"
            onClick={() => document.getElementById("file-upload")?.click()}
            disabled={isLoading}
          >
            <PaperclipIcon className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={onStartRecording}
            disabled={isLoading}
            className={isRecording ? "text-red-500" : ""}
          >
            <Mic className="h-5 w-5" />
          </Button>
          <Button
            size="icon"
            onClick={handleSend}
            disabled={!message.trim() || isLoading}
          >
            <Send className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ChatInput;
