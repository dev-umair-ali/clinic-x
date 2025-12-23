"use client";

import { useState, useRef, useEffect } from "react";
import { X, Send, Bot, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ChatBotProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ChatBot({ isOpen, onClose }: ChatBotProps) {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: "Hi there 👋 What can I help you with today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ]);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!message.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      text: message,
      sender: "user",
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setMessage("");
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = getBotResponse(message);
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: botResponse,
        sender: "bot",
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMessage]);
      setIsTyping(false);
    }, 1000 + Math.random() * 1000);
  };

  const getBotResponse = (userInput: string): string => {
    const input = userInput.toLowerCase();

    if (input.includes("appointment") || input.includes("schedule")) {
      return "I can help you schedule an appointment! Your next available slot is July 30th at 4:00 PM with Dr. Smith. Would you like me to book this for you?";
    }

    if (input.includes("bill") || input.includes("payment") || input.includes("invoice")) {
      return "I see you have $245.00 in pending bills. You can pay online through your patient portal or I can help you set up a payment plan. What would you prefer?";
    }

    if (input.includes("prescription") || input.includes("medication") || input.includes("refill")) {
      return "Your Lisinopril prescription is due for refill. I can send the refill request to your pharmacy right now. Which pharmacy would you like me to use?";
    }

    if (input.includes("doctor") || input.includes("physician")) {
      return "Your primary care physician is Dr. Sarah Smith. She specializes in Internal Medicine. Would you like me to help you contact her office or schedule an appointment?";
    }

    if (input.includes("hello") || input.includes("hi") || input.includes("hey")) {
      return "Hello! I'm your medical assistant. I can help you with appointments, billing questions, prescription refills, and general health inquiries. What can I assist you with today?";
    }

    if (input.includes("help")) {
      return "I can assist you with:\n• Scheduling appointments\n• Billing and payment questions\n• Prescription refills\n• Contacting your healthcare team\n• General health information\n\nWhat would you like help with?";
    }

    return "I understand you're asking about that. Let me connect you with the right information. For specific medical questions, I recommend speaking with your healthcare provider. Is there anything else I can help you with regarding appointments, billing, or prescriptions?";
  };

  const handleQuickAction = (action: string) => {
    setMessage(action);
    handleSendMessage();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed bottom-16 right-2 sm:bottom-20 sm:right-4 lg:bottom-24 lg:right-6 w-[calc(100vw-1rem)] max-w-sm sm:w-80 bg-[hsl(var(--background))] dark:bg-[hsl(var(--card))] rounded-lg shadow-xl border border-[hsl(var(--border))] dark:border-[hsl(var(--border))] z-50">
      <div className="flex items-center justify-between p-3 sm:p-4 bg-[hsl(var(--color-brand-teal))] dark:bg-[hsl(var(--color-brand-teal))] rounded-t-lg">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 sm:w-8 sm:h-8 bg-white/20 rounded-full flex items-center justify-center">
            <User className="h-3 w-3 sm:h-4 sm:w-4 text-white" />
          </div>
          <div>
            <h3 className="font-medium text-white text-xs sm:text-sm">Medical Assistant</h3>
            <p className="text-xs text-white/80">Online Now</p>
          </div>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="h-6 w-6 sm:h-8 sm:w-8 p-0 hover:bg-white/10 text-white"
        >
          <X className="h-3 w-3 sm:h-4 sm:w-4" />
        </Button>
      </div>

      <div className="flex flex-col h-80 sm:h-96">
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 bg-[hsl(var(--muted))] dark:bg-[hsl(var(--muted))] space-y-3">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[80%] rounded-lg p-2 sm:p-3 ${
                  msg.sender === "user"
                    ? "bg-[hsl(var(--color-brand-teal))] text-white"
                    : "bg-[hsl(var(--background))] dark:bg-[hsl(var(--card))] border border-[hsl(var(--border))] dark:border-[hsl(var(--border))]"
                }`}
              >
                <div className="flex items-start gap-2">
                  {msg.sender === "bot" && (
                    <User className="h-3 w-3 sm:h-4 sm:w-4 text-[hsl(var(--color-brand-teal))] dark:text-[hsl(var(--color-brand-teal))] mt-0.5 flex-shrink-0" />
                  )}
                  {msg.sender === "user" && <User className="h-3 w-3 sm:h-4 sm:w-4 text-white mt-0.5 flex-shrink-0" />}
                  <div className="flex-1">
                    <p
                      className={`text-xs sm:text-sm whitespace-pre-line ${
                        msg.sender === "user" ? "text-white" : "text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))]"
                      }`}
                    >
                      {msg.text}
                    </p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.sender === "user" ? "text-white/70" : "text-[hsl(var(--muted-foreground))] dark:text-[hsl(var(--muted-foreground))]"
                      }`}
                    >
                      {msg.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {isTyping && (
            <div className="flex justify-start">
              <div className="bg-[hsl(var(--background))] dark:bg-[hsl(var(--card))] border border-[hsl(var(--border))] dark:border-[hsl(var(--border))] rounded-lg p-2 sm:p-3">
                <div className="flex items-center gap-2">
                  <User className="h-3 w-3 sm:h-4 sm:w-4 text-[hsl(var(--color-brand-teal))] dark:text-[hsl(var(--color-brand-teal))]" />
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-[hsl(var(--muted-foreground))] rounded-full animate-bounce"></div>
                    <div
                      className="w-1.5 h-1.5 bg-[hsl(var(--muted-foreground))] rounded-full animate-bounce"
                      style={{ animationDelay: "0.1s" }}
                    ></div>
                    <div
                      className="w-1.5 h-1.5 bg-[hsl(var(--muted-foreground))] rounded-full animate-bounce"
                      style={{ animationDelay: "0.2s" }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="p-2 sm:p-3 bg-[hsl(var(--background))] dark:bg-[hsl(var(--card))] border-t border-[hsl(var(--border))] dark:border-[hsl(var(--border))]">
          <div className="flex flex-wrap gap-1 sm:gap-2 mb-2 sm:mb-3">
            <Button
              size="sm"
              onClick={() => handleQuickAction("I need to schedule an appointment")}
              className="bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-white text-xs px-2 py-1 h-6 sm:h-7 flex-1 sm:flex-none"
            >
              Appointments
            </Button>
            <Button
              size="sm"
              onClick={() => handleQuickAction("I have a question about my bill")}
              className="bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-white text-xs px-2 py-1 h-6 sm:h-7 flex-1 sm:flex-none"
            >
              Billing
            </Button>
            <Button
              size="sm"
              onClick={() => handleQuickAction("I need a prescription refill")}
              className="bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-white text-xs px-2 py-1 h-6 sm:h-7 flex-1 sm:flex-none"
            >
              Prescriptions
            </Button>
          </div>
        </div>

        <div className="p-2 sm:p-3 bg-[hsl(var(--background))] dark:bg-[hsl(var(--card))] rounded-b-lg border-t border-[hsl(var(--border))] dark:border-[hsl(var(--border))]">
          <div className="flex gap-2">
            <Input
              placeholder="Type your message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="flex-1 text-xs sm:text-sm bg-[hsl(var(--muted))] dark:bg-[hsl(var(--muted))] border-[hsl(var(--border))] dark:border-[hsl(var(--border))] text-[hsl(var(--foreground))] dark:text-[hsl(var(--foreground))] placeholder:text-[hsl(var(--muted-foreground))] dark:placeholder:text-[hsl(var(--muted-foreground))] focus:ring-[hsl(var(--color-brand-teal))] dark:focus:ring-[hsl(var(--color-brand-teal))]"
              onKeyPress={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSendMessage();
                }
              }}
              disabled={isTyping}
            />
            <Button
              size="sm"
              onClick={handleSendMessage}
              disabled={!message.trim() || isTyping}
              className="bg-[hsl(var(--color-brand-teal))] hover:bg-[hsl(var(--color-brand-teal-dark))] text-white px-2 sm:px-3 shadow-sm disabled:opacity-50"
            >
              <Send className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}