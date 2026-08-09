"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Bot,
  X,
  Send,
  BookOpen,
  GraduationCap,
  Sparkles,
  Users,
  CreditCard,
} from "lucide-react";

const WHATSAPP_NUMBER = "923001234567";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

const quickQuestions = [
  {
    label: "What courses do you offer?",
    icon: BookOpen,
  },
  {
    label: "How can I enroll?",
    icon: GraduationCap,
  },
  {
    label: "Tell me about certificates",
    icon: Sparkles,
  },
  {
    label: "Who are the instructors?",
    icon: Users,
  },
  {
    label: "How can I contact PILD Academy?",
    icon: CreditCard,
  },
];

export function FloatingSupport() {
  const [assistantOpen, setAssistantOpen] = useState(false);
  const [input, setInput] = useState("");

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content:
        "Hi! 👋 I am the PILD Academy AI Assistant. Ask me anything about our courses, enrollment, instructors, certificates, or the academy.",
    },
  ]);

  const [isLoading, setIsLoading] = useState(false);

  const openWhatsApp = () => {
    const text = encodeURIComponent(
      "Hello PILD Academy, I would like to get more information."
    );

    window.open(
      `https://wa.me/${923018813795}?text=${text}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  const sendMessage = async (customMessage?: string) => {
    const userMessage = (customMessage ?? input).trim();

    if (!userMessage || isLoading) {
      return;
    }

    setInput("");

    setMessages((previous) => [
      ...previous,
      {
        role: "user",
        content: userMessage,
      },
    ]);

    setIsLoading(true);

    try {
      const response = await fetch("/api/ai-assistant", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          message: userMessage,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data?.error || "Unable to get AI response."
        );
      }

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            data?.answer ||
            "I am sorry, I could not generate an answer.",
        },
      ]);
    } catch (error) {
      console.error("Chatbot error:", error);

      setMessages((previous) => [
        ...previous,
        {
          role: "assistant",
          content:
            "Sorry, I am having trouble connecting right now. Please try again in a moment or contact us through WhatsApp.",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      {/* =====================================================
          AI CHAT WINDOW
      ====================================================== */}

      {assistantOpen && (
        <div
          className="
            fixed
            bottom-[155px]
            right-4
            z-[9999]
            flex
            w-[calc(100vw-2rem)]
            max-w-[390px]
            flex-col
            overflow-hidden
            rounded-2xl
            border
            border-gray-200
            bg-white
            shadow-2xl
            animate-in
            slide-in-from-bottom-5
            duration-300
            sm:right-6
            sm:bottom-[165px]
          "
        >
          {/* =================================================
              HEADER
          ================================================== */}

          <div className="relative overflow-hidden bg-gradient-to-r from-blue-700 via-blue-600 to-purple-600 px-5 py-4 text-white">
            <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10" />

            <div className="absolute -bottom-10 -left-6 h-24 w-24 rounded-full bg-white/10" />

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* AI IMAGE */}

                <div className="relative flex h-11 w-11 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white ring-2 ring-white/20">
                  <Image
                    src="/image.png"
                    alt="PILD AI Assistant"
                    width={44}
                    height={44}
                    priority
                    className="h-full w-full object-contain"
                  />

                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-blue-600 bg-green-400" />
                </div>

                <div>
                  <h3 className="font-bold">
                    PILD AI Assistant
                  </h3>

                  <p className="text-xs text-blue-100">
                    Ask me anything about PILD Academy
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setAssistantOpen(false)}
                className="rounded-full p-2 transition hover:bg-white/10"
                aria-label="Close AI assistant"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* =================================================
              CHAT MESSAGES
          ================================================== */}

          <div className="h-[330px] overflow-y-auto bg-gray-50 p-4">
            <div className="space-y-4">
              {messages.map((message, index) => (
                <div
                  key={`${message.role}-${index}`}
                  className={`flex ${
                    message.role === "user"
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="mr-2 mt-1 flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm">
                      <Image
                        src="/image.png"
                        alt="PILD AI"
                        width={32}
                        height={32}
                        className="h-full w-full object-contain"
                      />
                    </div>
                  )}

                  <div
                    className={`
                      max-w-[80%]
                      rounded-2xl
                      px-4
                      py-3
                      text-sm
                      leading-relaxed
                      ${
                        message.role === "user"
                          ? "rounded-br-md bg-blue-600 text-white"
                          : "rounded-tl-md bg-white text-gray-700 shadow-sm"
                      }
                    `}
                  >
                    {message.content}
                  </div>
                </div>
              ))}

              {/* =================================================
                  LOADING
              ================================================== */}

              {isLoading && (
                <div className="flex items-start">
                  <div className="mr-2 mt-1 flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-white shadow-sm">
                    <Image
                      src="/image.png"
                      alt="PILD AI"
                      width={32}
                      height={32}
                      className="h-full w-full object-contain"
                    />
                  </div>

                  <div className="rounded-2xl rounded-tl-md bg-white px-4 py-3 shadow-sm">
                    <div className="flex items-center gap-1">
                      <span className="h-2 w-2 animate-bounce rounded-full bg-blue-500" />

                      <span
                        className="h-2 w-2 animate-bounce rounded-full bg-blue-500"
                        style={{ animationDelay: "150ms" }}
                      />

                      <span
                        className="h-2 w-2 animate-bounce rounded-full bg-blue-500"
                        style={{ animationDelay: "300ms" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* =================================================
              QUICK QUESTIONS
          ================================================== */}

          <div className="border-t bg-white px-3 py-3">
            <p className="mb-2 px-1 text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Quick Questions
            </p>

            <div className="flex gap-2 overflow-x-auto pb-1">
              {quickQuestions.map((question) => {
                const Icon = question.icon;

                return (
                  <button
                    key={question.label}
                    type="button"
                    disabled={isLoading}
                    onClick={() =>
                      sendMessage(question.label)
                    }
                    className="
                      flex
                      shrink-0
                      items-center
                      gap-1.5
                      rounded-full
                      border
                      border-blue-100
                      bg-blue-50
                      px-3
                      py-1.5
                      text-xs
                      font-medium
                      text-blue-700
                      transition
                      hover:border-blue-300
                      hover:bg-blue-100
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    <Icon className="h-3.5 w-3.5" />

                    {question.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* =================================================
              INPUT
          ================================================== */}

          <div className="border-t bg-white p-3">
            <div
              className="
                flex
                items-center
                gap-2
                rounded-xl
                border
                border-gray-200
                bg-gray-50
                px-3
                py-1.5
                transition
                focus-within:border-blue-400
                focus-within:ring-2
                focus-within:ring-blue-100
              "
            >
              <input
                type="text"
                value={input}
                onChange={(event) =>
                  setInput(event.target.value)
                }
                onKeyDown={(event) => {
                  if (
                    event.key === "Enter" &&
                    !event.shiftKey
                  ) {
                    event.preventDefault();
                    sendMessage();
                  }
                }}
                placeholder="Ask about PILD Academy..."
                disabled={isLoading}
                className="
                  min-w-0
                  flex-1
                  bg-transparent
                  py-2
                  text-sm
                  text-gray-800
                  outline-none
                  placeholder:text-gray-400
                  disabled:opacity-50
                "
              />

              <button
                type="button"
                onClick={() => sendMessage()}
                disabled={!input.trim() || isLoading}
                className="
                  flex
                  h-9
                  w-9
                  shrink-0
                  items-center
                  justify-center
                  rounded-lg
                  bg-blue-600
                  text-white
                  transition
                  hover:bg-blue-700
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
                aria-label="Send message"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>

            <p className="mt-2 text-center text-[10px] text-gray-400">
              AI Assistant • PILD Academy
            </p>
          </div>
        </div>
      )}

      {/* =====================================================
          FLOATING BUTTONS
      ====================================================== */}

      <div
        className="
          fixed
          bottom-5
          right-4
          z-[9999]
          flex
          flex-col
          items-center
          gap-4
          sm:right-6
          sm:bottom-6
        "
      >
        {/* =================================================
            AI BUTTON
        ================================================== */}

        <div className="relative">
          {/* Rotating Ring */}

          <div
            className="
              pointer-events-none
              absolute
              -inset-2
              rounded-full
              border
              border-blue-400/30
              animate-[spin_8s_linear_infinite]
            "
          >
            <span className="absolute -top-1 left-1/2 h-2 w-2 -translate-x-1/2 rounded-full bg-blue-500 shadow-lg shadow-blue-500/70" />

            <span className="absolute bottom-2 -right-1 h-1.5 w-1.5 rounded-full bg-purple-500" />
          </div>

          {/* Glow */}

          <div className="absolute -inset-3 rounded-full bg-blue-500/10 blur-xl" />

          <button
            type="button"
            onClick={() =>
              setAssistantOpen(
                (previous) => !previous
              )
            }
            className="
              group
              relative
              flex
              h-14
              w-14
              items-center
              justify-center
              overflow-hidden
              rounded-full
              bg-gradient-to-br
              from-blue-600
              via-blue-600
              to-purple-600
              text-white
              shadow-xl
              shadow-blue-600/30
              transition-all
              duration-300
              hover:scale-110
              sm:h-16
              sm:w-16
            "
            aria-label="Open PILD AI Assistant"
          >
            <div className="absolute inset-1 rounded-full border border-white/20" />

            {assistantOpen ? (
              <X className="relative z-10 h-6 w-6 sm:h-7 sm:w-7" />
            ) : (
              <Image
                src="/image.png"
                alt="PILD AI Assistant"
                width={64}
                height={64}
                className="relative z-10 h-full w-full object-contain p-1"
              />
            )}

            {!assistantOpen && (
              <span
                className="
                  absolute
                  -right-1
                  -top-1
                  z-20
                  flex
                  h-5
                  min-w-5
                  items-center
                  justify-center
                  rounded-full
                  bg-purple-500
                  px-1
                  text-[8px]
                  font-bold
                  ring-2
                  ring-white
                "
              >
                AI
              </span>
            )}
          </button>
        </div>

        {/* =================================================
            WHATSAPP BUTTON
        ================================================== */}

        <div className="relative">
          {/* Pulsing Ring */}

          <span
            className="
              absolute
              -inset-1
              rounded-full
              border-2
              border-green-400/50
              animate-ping
            "
          />

          {/* Glow */}

          <div className="absolute -inset-3 rounded-full bg-green-500/10 blur-xl" />

          <button
            type="button"
            onClick={openWhatsApp}
            className="
              group
              relative
              flex
              h-14
              w-14
              items-center
              justify-center
              overflow-hidden
              rounded-full
              bg-[#033013]
              text-white
              shadow-xl
              shadow-green-500/30
              transition-all
              duration-300
              hover:scale-110
              sm:h-16
              sm:w-16
            "
            aria-label="Contact PILD Academy on WhatsApp"
          >
            <div className="absolute inset-1 z-20 rounded-full border border-white/20" />

            {/* WhatsApp Image */}

            <Image
              src="/image2.png"
              alt="WhatsApp PILD Academy"
              width={64}
              height={64}
              className="relative z-10 h-full w-full object-contain p-1"
            />

            {/* Desktop Tooltip */}

            <span
              className="
                pointer-events-none
                absolute
                right-full
                top-1/2
                z-30
                mr-3
                hidden
                -translate-y-1/2
                whitespace-nowrap
                rounded-lg
                bg-gray-900
                px-3
                py-1.5
                text-xs
                text-white
                opacity-0
                transition-opacity
                group-hover:opacity-100
                sm:block
              "
            >
              Chat on WhatsApp
            </span>
          </button>
        </div>
      </div>
    </>
  );
}