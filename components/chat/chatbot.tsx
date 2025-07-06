"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Send, Bot, User, Sparkles } from "lucide-react"
import { useRef, useEffect, useState } from "react"

interface Message {
  id: string;
  role: "user" | "assistant"; // Keep these for your UI logic
  content: string;
}

export function Chatbot() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    if (isLoading) {
      setIsTyping(true);
    } else {
      setTimeout(() => setIsTyping(false), 500);
    }
  }, [isLoading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      console.log("🚀 Starting API request...");
      console.log("🌐 Current URL:", window.location.origin);
      console.log("📤 Request payload:", {
        messages: [...messages, userMessage].map(msg => ({
          role: msg.role === "user" ? "user" : "assistant", // Send correct roles to your API
          content: msg.content,
        })),
      });

      // --- CHANGE THIS LINE ---
      const apiUrl = "/api/chat"; // Your new API route for Gemini
      // --- END CHANGE ---

      console.log("📍 API URL:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role === "user" ? "user" : "assistant",
            content: msg.content,
          })),
        }),
      });

      console.log("📊 Response received:");
      console.log("  - Status:", response.status);
      console.log("  - Status Text:", response.statusText);
      console.log("  - OK:", response.ok);
      console.log("  - Headers:", Object.fromEntries(response.headers.entries()));

      if (!response.ok) {
        let errorText;
        try {
          errorText = await response.text();
          console.error("❌ Error response body:", errorText);
        } catch (e) {
          console.error("❌ Could not read error response body:", e);
          errorText = `HTTP ${response.status} ${response.statusText}`;
        }
        throw new Error(`API request failed: ${response.status} - ${errorText}`);
      }

      let data;
      try {
        data = await response.json();
        console.log("✅ API Response data:", data);
      } catch (e) {
        console.error("❌ Could not parse JSON response:", e);
        throw new Error("Invalid JSON response from API");
      }
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant", // Keep 'assistant' for your UI
        content: data.reply || "Sorry, I couldn't generate a response, young star gazer.",
      };

      setMessages(prev => [...prev, assistantMessage]);
      console.log("✅ Message added successfully");
    } catch (error) {
      console.error("💥 Full error details:");
      console.error("  - Error object:", error);
      console.error("  - Error name:", error instanceof Error ? error.name : 'Unknown');
      console.error("  - Error message:", error instanceof Error ? error.message : 'Unknown error');
      console.error("  - Error stack:", error instanceof Error ? error.stack : 'No stack trace');
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: `❌ Error, young star gazer: ${error instanceof Error ? error.message : 'An unknown cosmic anomaly occurred'}`,
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInput(e.target.value);
  };

  return (
    <motion.div whileHover={{ scale: 1.01 }} transition={{ duration: 0.2 }}>
      <Card className="bg-gradient-to-br from-gray-800/60 to-gray-900/60 border-gray-700/50 backdrop-blur-xl shadow-2xl h-[650px] flex flex-col relative overflow-hidden">
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5 animate-pulse"></div>

        <div className="relative z-10 p-6 border-b border-gray-700/50">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-4"
          >
            <motion.div
              animate={{ rotate: isTyping ? 360 : 0 }}
              transition={{ duration: 2, repeat: isTyping ? Number.POSITIVE_INFINITY : 0, ease: "linear" }}
              className="p-3 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl backdrop-blur-sm border border-blue-500/20"
            >
              <Bot className="w-6 h-6 text-blue-400" />
            </motion.div>
            <div>
              <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                Astero, the Space Wizard
              </h2>
              <motion.p
                animate={{ opacity: isTyping ? [0.5, 1, 0.5] : 1 }}
                transition={{ duration: 1.5, repeat: isTyping ? Number.POSITIVE_INFINITY : 0 }}
                className="text-sm text-gray-400 flex items-center gap-1"
              >
                {isTyping ? (
                  <>
                    <Sparkles className="w-3 h-3" />
                    Channelling cosmic energies...
                  </>
                ) : (
                  "Ready to unveil cosmic secrets!"
                )}
              </motion.p>
            </div>
          </motion.div>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 relative z-10">
          <AnimatePresence>
            {messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="text-center text-gray-400 mt-32"
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  className="mb-6"
                >
                  <Bot className="w-16 h-16 mx-auto text-gray-500" />
                </motion.div>
                <h3 className="text-xl font-semibold mb-2 text-gray-300">Greetings, Seeker of Knowledge!</h3>
                <p>I am Astero, a space wizard. Ask me of the cosmos!</p>
              </motion.div>
            )}

            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 30, scale: 0.9 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  ease: "easeOut",
                }}
                className={`flex gap-4 ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                {message.role === "assistant" && (
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl h-fit border border-blue-500/20"
                  >
                    <Bot className="w-5 h-5 text-blue-400" />
                  </motion.div>
                )}

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className={`max-w-[80%] p-4 rounded-2xl backdrop-blur-sm border ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-blue-600/80 to-purple-600/80 text-white border-blue-500/30 shadow-lg shadow-blue-500/20"
                      : "bg-gray-700/60 text-gray-100 border-gray-600/30 shadow-lg shadow-gray-900/20"
                  }`}
                >
                  <div className="whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </div>
                </motion.div>

                {message.role === "user" && (
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: -5 }}
                    className="p-2 bg-gradient-to-r from-gray-600/50 to-gray-700/50 rounded-xl h-fit border border-gray-500/30"
                  >
                    <User className="w-5 h-5 text-gray-300" />
                  </motion.div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4">
              <div className="p-2 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl h-fit border border-blue-500/20">
                <Bot className="w-5 h-5 text-blue-400" />
              </div>
              <div className="bg-gray-700/60 p-4 rounded-2xl border border-gray-600/30">
                <div className="flex space-x-2">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ y: [0, -8, 0] }}
                      transition={{
                        duration: 0.6,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: i * 0.2,
                        ease: "easeInOut",
                      }}
                      className="w-2 h-2 bg-blue-400 rounded-full"
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-6 border-t border-gray-700/50 relative z-10">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <motion.div whileFocus={{ scale: 1.02 }} className="flex-1">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder="Ask Astero about the cosmos..."
                className="bg-gray-700/50 border-gray-600/50 text-white placeholder-gray-400 focus:border-blue-500/50 focus:ring-2 focus:ring-blue-500/20 rounded-xl h-12 backdrop-blur-sm"
                disabled={isLoading}
              />
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button
                type="submit"
                disabled={isLoading || !input.trim()}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 h-12 rounded-xl shadow-lg shadow-blue-500/25 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Send className="w-5 h-5" />
              </Button>
            </motion.div>
          </form>
        </div>
      </Card>
    </motion.div>
  );
}