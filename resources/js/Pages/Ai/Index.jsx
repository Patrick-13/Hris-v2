import { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
    Bot,
    User,
    Send,
    Sparkles,
    Plus,
    Clock,
    CalendarDays,
    Building2,
    ClipboardList,
} from "lucide-react";

export default function AIAssistant() {
    const [messages, setMessages] = useState([
        {
            role: "assistant",
            content:
                "Hello! 👋 I'm your HRIS Assistant. Ask me about attendance, leave, overtime, or employee information.",
        },
    ]);

    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);

    const bottomRef = useRef();

    useEffect(() => {
        bottomRef.current?.scrollIntoView({
            behavior: "smooth",
        });
    }, [messages]);

    const suggestions = [
        "Summarize my attendance this month",
        "Why was I late yesterday?",
        "How many leave credits do I have?",
        "Show my overtime this month",
    ];

    const sendMessage = async (text = input) => {
        if (!text.trim()) return;

        setMessages((prev) => [
            ...prev,
            {
                role: "user",
                content: text,
            },
        ]);

        setInput("");
        setLoading(true);

        try {
            const { data } = await axios.post("/user/ai/chat", {
                message: text,
            });

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: data.answer,
                },
            ]);
        } catch (e) {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content:
                        "Sorry, something went wrong while processing your request.",
                },
            ]);
        }

        setLoading(false);
    };

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}

            <aside className="w-72 border-r bg-white flex flex-col">
                <div className="p-5 border-b">
                    <button className="flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 py-3 font-medium text-white hover:bg-blue-700">
                        <Plus size={18} />
                        New Chat
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-4">
                    <p className="mb-3 text-xs font-semibold uppercase text-gray-500">
                        Suggestions
                    </p>

                    <div className="space-y-2">
                        <button className="w-full rounded-lg p-3 text-left hover:bg-gray-100">
                            Attendance Summary
                        </button>

                        <button className="w-full rounded-lg p-3 text-left hover:bg-gray-100">
                            Leave Credits
                        </button>

                        <button className="w-full rounded-lg p-3 text-left hover:bg-gray-100">
                            Overtime
                        </button>
                    </div>
                </div>
            </aside>

            {/* Chat */}

            <main className="flex flex-1 flex-col">
                {/* Header */}

                <div className="border-b bg-white px-8 py-5">
                    <div className="flex items-center gap-3">
                        <div className="rounded-xl bg-blue-100 p-2">
                            <Bot className="text-blue-600" />
                        </div>

                        <div>
                            <h1 className="font-semibold text-lg">
                                HRIS AI Assistant
                            </h1>

                            <p className="text-sm text-gray-500">
                                Powered by AI
                            </p>
                        </div>
                    </div>
                </div>

                {/* Messages */}

                <div className="flex-1 overflow-y-auto px-8 py-8">
                    {messages.length === 1 && (
                        <div className="mb-10">
                            <div className="mb-8 flex flex-col items-center">
                                <div className="rounded-full bg-blue-100 p-5">
                                    <Sparkles
                                        className="text-blue-600"
                                        size={34}
                                    />
                                </div>

                                <h2 className="mt-5 text-3xl font-bold">
                                    How can I help you today?
                                </h2>

                                <p className="mt-2 text-gray-500">
                                    Ask anything about your HR records.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                {suggestions.map((item) => (
                                    <button
                                        key={item}
                                        onClick={() => sendMessage(item)}
                                        className="rounded-xl border bg-white p-5 text-left hover:border-blue-500 hover:shadow"
                                    >
                                        {item}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="space-y-6">
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${
                                    msg.role === "user"
                                        ? "justify-end"
                                        : "justify-start"
                                }`}
                            >
                                <div
                                    className={`flex max-w-3xl gap-4 ${
                                        msg.role === "user"
                                            ? "flex-row-reverse"
                                            : ""
                                    }`}
                                >
                                    <div
                                        className={`h-10 w-10 rounded-full flex items-center justify-center ${
                                            msg.role === "assistant"
                                                ? "bg-blue-100"
                                                : "bg-gray-200"
                                        }`}
                                    >
                                        {msg.role === "assistant" ? (
                                            <Bot size={20} />
                                        ) : (
                                            <User size={20} />
                                        )}
                                    </div>

                                    <div
                                        className={`rounded-2xl px-5 py-4 ${
                                            msg.role === "assistant"
                                                ? "bg-white shadow"
                                                : "bg-blue-600 text-white"
                                        }`}
                                    >
                                        {msg.content}
                                    </div>
                                </div>
                            </div>
                        ))}

                        {loading && (
                            <div className="flex gap-3">
                                <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                                    <Bot />
                                </div>

                                <div className="rounded-2xl bg-white px-5 py-4 shadow">
                                    Thinking...
                                </div>
                            </div>
                        )}

                        <div ref={bottomRef} />
                    </div>
                </div>

                {/* Input */}

                <div className="border-t bg-white p-5">
                    <div className="flex items-center gap-3 rounded-2xl border px-5 py-3 shadow-sm">
                        <input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) =>
                                e.key === "Enter" && sendMessage()
                            }
                            placeholder="Ask about attendance, leave, overtime..."
                            className="flex-1 bg-transparent outline-none"
                        />

                        <button
                            onClick={() => sendMessage()}
                            className="rounded-xl bg-blue-600 p-3 text-white hover:bg-blue-700"
                        >
                            <Send size={18} />
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}
