"use client";

import React, { useState, useRef, useEffect, JSX } from "react";
import Cookies from "js-cookie"; // For accessing the token
import DashboardLayout from "@/components/DashboardLayout";

// Define message interface for chat history
interface ChatMessage {
  role: "user" | "model";
  text: string;
  timestamp?: string; // Optional timestamp from backend
}

// Interface for a conversation summary
interface ConversationSummary {
  _id: string;
  title: string;
  created_at: string;
}

// Interface for a full conversation (including messages)
interface FullConversation extends ConversationSummary {
  messages: ChatMessage[];
}

// Helper function to format AI responses with basic markdown
const formatAIResponse = (text: string): JSX.Element => {
  // Replace **bold** or *bold* with <strong>
  const formattedText = text.replace(
    /\*\*(.*?)\*\*|\*(.*?)\*/g,
    "<strong>$1$2</strong>"
  );

  // Handle list items (lines starting with * )
  const lines = formattedText.split("\n");
  let inList = false;
  const processedLines = lines.map((line) => {
    if (line.trim().startsWith("* ")) {
      if (!inList) {
        inList = true;
        return `<ul><li>${line.trim().substring(2)}</li>`;
      }
      return `<li>${line.trim().substring(2)}</li>`;
    } else {
      if (inList) {
        inList = false;
        return `</ul><p>${line.trim()}</p>`;
      }
      return `<p>${line.trim()}</p>`;
    }
  });
  if (inList) {
    processedLines.push("</ul>");
  }

  // Join lines and wrap in a div, then use dangerouslySetInnerHTML
  // This is generally safe for AI output as we control the markdown conversion.
  return <div dangerouslySetInnerHTML={{ __html: processedLines.join("") }} />;
};

export default function AskAIPage() {
  const [conversations, setConversations] = useState<ConversationSummary[]>([]);
  const [currentConversation, setCurrentConversation] =
    useState<FullConversation | null>(null);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [loadingResponse, setLoadingResponse] = useState(false);
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isChatSidebarOpen, setIsChatSidebarOpen] = useState(true); // State for left sidebar visibility
  const [showTopicsPopover, setShowTopicsPopover] = useState(false); // State for common topics popover

  const chatContainerRef = useRef<HTMLDivElement>(null);
  const topicsButtonRef = useRef<HTMLButtonElement>(null); // Ref for the button that triggers popover
  const topicsPopoverRef = useRef<HTMLDivElement>(null); // Ref for the popover itself

  const AI_AVATAR_URL =
    "https://lh3.googleusercontent.com/aida-public/AB6AXuD8BvTjUnJesyI3m41wmfHpnSz-nJb6EPOhcIMLcRcl-eWRikhUAe-fXlVo-3IJpjBhLcSL8kuzuz6wyYnATvqwOh8C9ujtP729x9B7t02zCt4KM1R7fcazoUSZSrLPR3TcvqDlZkuGKIXN8f0ipFRe_ySU4UwdmK0ZzE6BD4sxBTkgVlgGdIoI_5JqkHTUKLTezA-n_Lt_BuuNK5v9gZj78d21Q2BgxXpRUpNX-KZb5y_iSz1QPLzuI56XeFNm8tlMcDXij2mV5uG4";
  const USER_AVATAR_INITIAL = "U"; // Placeholder, ideally from user profile

  // Scroll to the bottom of the chat when messages update
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [currentConversation?.messages]); // Trigger scroll when current conversation's messages change

  // Fetch all conversations on initial load
  useEffect(() => {
    const fetchAllConversations = async () => {
      setLoadingConversations(true);
      setError(null);
      const token = Cookies.get("token");
      if (!token) {
        setError("User not authenticated. Please log in.");
        setLoadingConversations(false);
        return;
      }

      try {
        const res = await fetch("http://localhost:5000/api/ai/conversations", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const result = await res.json();
          setConversations(result.conversations);
          // If there are existing conversations, load the most recent one
          if (result.conversations.length > 0) {
            await loadConversation(result.conversations[0]._id);
          } else {
            // If no conversations, create a new one automatically
            await createNewConversation();
          }
        } else {
          const errorText = await res.text();
          setError(`Failed to fetch conversations: ${errorText}`);
        }
      } catch (err) {
        console.error("Error fetching conversations:", err);
        setError(
          "Network error or server unreachable while fetching conversations."
        );
      } finally {
        setLoadingConversations(false);
      }
    };

    fetchAllConversations();
  }, []); // Run only once on mount

  // Handle clicks outside the topics popover
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        topicsPopoverRef.current &&
        !topicsPopoverRef.current.contains(event.target as Node) &&
        topicsButtonRef.current &&
        !topicsButtonRef.current.contains(event.target as Node)
      ) {
        setShowTopicsPopover(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Function to create a new conversation
  const createNewConversation = async () => {
    setLoadingResponse(true);
    setError(null);
    const token = Cookies.get("token");
    if (!token) {
      setError("User not authenticated. Please log in.");
      setLoadingResponse(false);
      return;
    }

    try {
      const res = await fetch("http://localhost:5000/api/ai/conversations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({}), // Can send a title here if desired
      });

      if (res.ok) {
        const result = await res.json();
        const newConvSummary: ConversationSummary = {
          _id: result.conversation_id,
          title: result.title,
          created_at: result.created_at,
        };
        setConversations((prev) => [newConvSummary, ...prev]); // Add new conversation to the top
        await loadConversation(result.conversation_id); // Load the newly created conversation
      } else {
        const errorText = await res.text();
        setError(`Failed to create new conversation: ${errorText}`);
      }
    } catch (err) {
      console.error("Error creating new conversation:", err);
      setError(
        "Network error or server unreachable while creating conversation."
      );
    } finally {
      setLoadingResponse(false);
    }
  };

  // Function to load a specific conversation by ID
  const loadConversation = async (conversationId: string) => {
    setLoadingResponse(true);
    setError(null);
    const token = Cookies.get("token");
    if (!token) {
      setError("User not authenticated. Please log in.");
      setLoadingResponse(false);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/ai/conversations/${conversationId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        const result = await res.json();
        setCurrentConversation(result.conversation);
      } else {
        const errorText = await res.text();
        setError(`Failed to load conversation: ${errorText}`);
        setCurrentConversation(null);
      }
    } catch (err) {
      console.error("Error loading conversation:", err);
      setError(
        "Network error or server unreachable while loading conversation."
      );
    } finally {
      setLoadingResponse(false);
    }
  };

  // Function to send a message and get AI response
  const sendMessage = async (prompt: string) => {
    if (!prompt.trim() || !currentConversation?._id) return;

    // Add user message to local state immediately for responsiveness
    const newUserMessage: ChatMessage = {
      role: "user",
      text: prompt,
      timestamp: new Date().toISOString(),
    };
    setCurrentConversation((prev) =>
      prev ? { ...prev, messages: [...prev.messages, newUserMessage] } : null
    );
    setInputMessage(""); // Clear input field
    setLoadingResponse(true);
    setError(null);

    const token = Cookies.get("token");
    if (!token) {
      setError("User not authenticated. Please log in.");
      setLoadingResponse(false);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/ai/conversations/${currentConversation._id}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ text: prompt }),
        }
      );

      if (res.ok) {
        const result = await res.json();
        setCurrentConversation(result.conversation); // Update with the full conversation from backend
      } else {
        const errorData = await res.json();
        setError(
          `Failed to get AI response: ${errorData.error || "Unknown error"}`
        );
        // Remove the last user message if AI response failed to avoid confusion
        setCurrentConversation((prev) =>
          prev ? { ...prev, messages: prev.messages.slice(0, -1) } : null
        );
      }
    } catch (err: any) {
      console.error("Error communicating with backend/Gemini API:", err);
      setError(
        `An error occurred: ${
          err.message || "Unknown error"
        }. Please try again.`
      );
      // Remove the last user message if API call failed
      setCurrentConversation((prev) =>
        prev ? { ...prev, messages: prev.messages.slice(0, -1) } : null
      );
    } finally {
      setLoadingResponse(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setInputMessage(e.target.value);
  };

  const handleSendMessageClick = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(inputMessage);
  };

  const handleTopicClick = (topic: string) => {
    setInputMessage(topic); // Pre-fill the input with the topic
    setShowTopicsPopover(false); // Close popover after selecting topic
  };

  const handleDeleteConversation = async (conversationId: string) => {
    if (!window.confirm("Are you sure you want to delete this conversation?")) {
      return;
    }

    setLoadingConversations(true);
    setError(null);
    const token = Cookies.get("token");
    if (!token) {
      setError("User not authenticated. Please log in.");
      setLoadingConversations(false);
      return;
    }

    try {
      const res = await fetch(
        `http://localhost:5000/api/ai/conversations/${conversationId}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (res.ok) {
        setConversations((prev) =>
          prev.filter((conv) => conv._id !== conversationId)
        );
        // If the deleted conversation was the current one, load the latest or create new
        if (currentConversation?._id === conversationId) {
          setCurrentConversation(null);
          if (conversations.length > 0) {
            // If there are other conversations left
            await loadConversation(conversations[0]._id); // Load the new first conversation
          } else {
            // No conversations left
            await createNewConversation();
          }
        }
      } else {
        const errorText = await res.text();
        setError(`Failed to delete conversation: ${errorText}`);
      }
    } catch (err) {
      console.error("Error deleting conversation:", err);
      setError("Network error or server unreachable during deletion.");
    } finally {
      setLoadingConversations(false);
    }
  };

  return (
    <DashboardLayout>
      <div
        className="relative flex size-full min-h-screen flex-col bg-white group/design-root overflow-x-hidden"
        style={{ fontFamily: 'Manrope, "Noto Sans", sans-serif' }}
      >
        <div className="gap-1 px-6 flex flex-1 justify-center py-5">
          {/* Left Sidebar for Conversations */}
          <div
            className={`layout-content-container flex flex-col w-[300px] border-r border-[#f1f4f0] pr-4 transition-all duration-300 ease-in-out ${
              isChatSidebarOpen ? "block" : "hidden"
            }`}
          >
            <h2 className="text-[#131811] text-[22px] font-bold leading-tight tracking-[-0.015em] px-4 pb-3 pt-5">
              My Chats
            </h2>
            <button
              onClick={createNewConversation}
              className="flex items-center justify-center p-3 mb-4 rounded-xl bg-green-500 text-white font-semibold hover:bg-green-600 transition-colors"
              disabled={loadingResponse || loadingConversations}
            >
              + New Chat
            </button>
            <div className="flex-grow overflow-y-auto space-y-2">
              {loadingConversations ? (
                <p className="text-gray-600 text-center">Loading chats...</p>
              ) : conversations.length === 0 ? (
                <p className="text-gray-600 text-center">
                  No chats yet. Click &apos;New Chat&apos; to begin!
                </p>
              ) : (
                conversations.map((conv) => (
                  <div
                    key={conv._id}
                    className={`flex items-center justify-between p-3 rounded-lg cursor-pointer transition-colors ${
                      currentConversation?._id === conv._id
                        ? "bg-green-100 text-green-800 font-medium"
                        : "bg-gray-50 hover:bg-gray-100"
                    }`}
                    onClick={() => loadConversation(conv._id)}
                  >
                    <span className="truncate flex-1">{conv.title}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDeleteConversation(conv._id);
                      }}
                      className="ml-2 p-1 rounded-full text-red-500 hover:bg-red-100 transition-colors"
                      title="Delete Conversation"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="16"
                        height="16"
                        fill="currentColor"
                        viewBox="0 0 256 256"
                      >
                        <path d="M216,48H176V40a24,24,0,0,0-24-24H104A24,24,0,0,0,80,40v8H40a8,8,0,0,0,0,16H216a8,8,0,0,0,0-16ZM96,40a8,8,0,0,1,8-8h48a8,8,0,0,1,8,8v8H96ZM200,80H56V208a16,16,0,0,0,16,16H184a16,16,0,0,0,16-16ZM72,88V208H184V88Z"></path>
                      </svg>
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Main Chat Area */}
          <div
            className={`layout-content-container flex flex-col max-w-[920px] flex-1 ${
              isChatSidebarOpen ? "ml-4" : "ml-0"
            } transition-all duration-300 ease-in-out`}
          >
            <div className="flex flex-wrap justify-between gap-3 p-4">
              <p className="text-[#131811] tracking-light text-[32px] font-bold leading-tight min-w-72">
                AI Health Assistant
              </p>
              {/* Toggle Sidebar Button */}
              <button
                onClick={() => setIsChatSidebarOpen(!isChatSidebarOpen)}
                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                title={isChatSidebarOpen ? "Hide Chats" : "Show Chats"}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  fill="currentColor"
                  viewBox="0 0 256 256"
                >
                  {isChatSidebarOpen ? (
                    <path d="M216,48H40A16,16,0,0,0,24,64V192a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V64A16,16,0,0,0,216,48ZM40,64H216V192H40ZM120,104a8,8,0,0,1,8-8h32a8,8,0,0,1,0,16H128A8,8,0,0,1,120,104Zm0,32a8,8,0,0,1,8-8h64a8,8,0,0,1,0,16H128A8,8,0,0,1,120,136Zm0,32a8,8,0,0,1,8-8h32a8,8,0,0,1,0,16H128A8,8,0,0,1,120,168Z"></path>
                  ) : (
                    <path d="M40,64H216a8,8,0,0,1,0,16H40a8,8,0,0,1,0-16ZM40,120H216a8,8,0,0,1,0,16H40a8,8,0,0,1,0-16ZM40,176H216a8,8,0,0,1,0,16H40a8,8,0,0,1,0-16Z"></path>
                  )}
                </svg>
              </button>
            </div>

            {error && <p className="text-red-500 text-center mb-4">{error}</p>}

            {/* Chat History Display */}
            <div
              ref={chatContainerRef}
              className="flex flex-col flex-grow overflow-y-auto p-4 space-y-4 bg-gray-50 rounded-xl mb-4 h-[calc(100vh-350px)]"
            >
              {currentConversation ? (
                currentConversation.messages.length === 0 ? (
                  <div className="flex items-end gap-3 p-4">
                    <div
                      className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0"
                      style={{ backgroundImage: `url("${AI_AVATAR_URL}")` }}
                    ></div>
                    <div className="flex flex-1 flex-col gap-1 items-start">
                      <p className="text-[#6b8961] text-[13px] font-normal leading-normal max-w-[360px]">
                        AI Assistant
                      </p>
                      <p className="text-base font-normal leading-normal flex max-w-[360px] rounded-xl px-4 py-3 bg-[#f1f4f0] text-[#131811]">
                        Hello! I&apos;m here to help with your health questions.
                        How can I assist you today?
                      </p>
                    </div>
                  </div>
                ) : (
                  currentConversation.messages.map((msg, index) => (
                    <div
                      key={index}
                      className={`flex items-end gap-3 p-4 ${
                        msg.role === "user" ? "justify-end" : ""
                      }`}
                    >
                      {msg.role === "model" && (
                        <div
                          className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0"
                          style={{ backgroundImage: `url("${AI_AVATAR_URL}")` }}
                        ></div>
                      )}
                      <div
                        className={`flex flex-1 flex-col gap-1 ${
                          msg.role === "user" ? "items-end" : "items-start"
                        }`}
                      >
                        <p className="text-[#6b8961] text-[13px] font-normal leading-normal max-w-[360px]">
                          {msg.role === "user" ? "You" : "AI Assistant"}
                        </p>
                        <div
                          className={`text-base font-normal leading-normal flex max-w-[360px] rounded-xl px-4 py-3 ${
                            msg.role === "user"
                              ? "bg-[#45eb13] text-[#131811]"
                              : "bg-[#f1f4f0] text-[#131811]"
                          }`}
                        >
                          {msg.role === "model"
                            ? formatAIResponse(msg.text)
                            : msg.text}
                        </div>
                      </div>
                      {msg.role === "user" && (
                        <div className="flex items-center justify-center size-10 rounded-full bg-green-200 text-green-800 font-bold text-lg shrink-0">
                          {USER_AVATAR_INITIAL}
                        </div>
                      )}
                    </div>
                  ))
                )
              ) : (
                <div className="flex items-center justify-center h-full text-gray-600">
                  {loadingConversations
                    ? "Loading chats..."
                    : "Select a chat or start a new one!"}
                </div>
              )}

              {loadingResponse && (
                <div className="flex items-end gap-3 p-4">
                  <div
                    className="bg-center bg-no-repeat aspect-square bg-cover rounded-full w-10 shrink-0"
                    style={{ backgroundImage: `url("${AI_AVATAR_URL}")` }}
                  ></div>
                  <div className="flex flex-1 flex-col gap-1 items-start">
                    <p className="text-[#6b8961] text-[13px] font-normal leading-normal max-w-[360px]">
                      AI Assistant
                    </p>
                    <p className="text-base font-normal leading-normal flex max-w-[360px] rounded-xl px-4 py-3 bg-[#f1f4f0] text-[#131811]">
                      Thinking...
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Chat Input */}
            <form
              onSubmit={handleSendMessageClick}
              className="relative flex items-center px-4 py-3 gap-3 @container"
            >
              <label className="flex flex-col min-w-40 h-12 flex-1">
                <div className="flex w-full flex-1 items-stretch rounded-xl h-full">
                  <input
                    type="text"
                    placeholder="Type your message..."
                    className="form-input flex w-full min-w-0 flex-1 resize-none overflow-hidden rounded-xl text-[#131811] focus:outline-0 focus:ring-0 border-none bg-[#f1f4f0] focus:border-none h-full placeholder:text-[#6b8961] px-4 rounded-r-none border-r-0 pr-2 text-base font-normal leading-normal"
                    value={inputMessage}
                    onChange={handleInputChange}
                    disabled={loadingResponse || !currentConversation}
                  />
                  <div className="flex border-none bg-[#f1f4f0] items-center justify-center pr-4 rounded-r-xl border-l-0">
                    <div className="flex items-center gap-4 justify-end">
                      <div className="flex items-center gap-1">
                        {/* Button to toggle Common Health Topics Popover */}
                        <button
                          type="button"
                          ref={topicsButtonRef}
                          onClick={() =>
                            setShowTopicsPopover(!showTopicsPopover)
                          }
                          className="flex items-center justify-center p-1.5 rounded-full hover:bg-gray-200 transition-colors"
                          disabled={loadingResponse}
                          title="Common Health Topics"
                        >
                          <div
                            className="text-[#6b8961]"
                            data-icon="Paperclip"
                            data-size="20px"
                            data-weight="regular"
                          >
                            {/* Using a different icon for topics, e.g., info or list icon */}
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="20px"
                              height="20px"
                              fill="currentColor"
                              viewBox="0 0 256 256"
                            >
                              <path d="M128,24A104,104,0,1,0,232,128,104.11,104.11,0,0,0,128,24Zm0,192a88,88,0,1,1,88-88A88.1,88.1,0,0,1,128,216Zm-8-80V104a8,8,0,0,1,16,0v32a8,8,0,0,1-16,0Zm8-40a12,12,0,1,1,12-12A12,12,0,0,1,128,96Z"></path>
                            </svg>
                          </div>
                        </button>
                      </div>
                      <button
                        type="submit"
                        className="min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-8 px-4 bg-[#45eb13] text-[#131811] text-sm font-medium leading-normal hidden @[480px]:block hover:bg-green-600 hover:text-white transition-colors"
                        disabled={
                          loadingResponse ||
                          !inputMessage.trim() ||
                          !currentConversation
                        }
                      >
                        <span className="truncate">Send</span>
                      </button>
                    </div>
                  </div>
                </div>
              </label>

              {/* Common Health Topics Popover */}
              {showTopicsPopover && (
                <div
                  ref={topicsPopoverRef}
                  className="absolute bottom-full right-0 mb-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-10 p-2"
                >
                  <h3 className="text-[#131811] text-base font-bold px-2 py-1">
                    Common Topics
                  </h3>
                  <div className="flex flex-col">
                    {[
                      "Headaches",
                      "Sleep Issues",
                      "Stress Management",
                      "Nutrition",
                      "Exercise",
                    ].map((topic, index) => (
                      <button
                        key={index}
                        onClick={() => handleTopicClick(topic)}
                        className="text-left px-2 py-1 rounded-md hover:bg-gray-100 text-gray-800 text-sm"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </form>
            <p className="text-[#6b8961] text-sm font-normal leading-normal pb-3 pt-1 px-4 text-center">
              Disclaimer: This AI assistant provides information for general
              knowledge and informational purposes only, and does not constitute
              medical advice. It is essential to consult with a qualified
              healthcare professional for any health concerns or before making
              any decisions related to your health or treatment.
            </p>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
