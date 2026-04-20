import { useState } from "react";

const API_URL = process.env.REACT_APP_API_URL

function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;
    const newMessages = [...messages, { role: "user", text: userText }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await fetch(`${API_URL}/api/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ message: userText })
      });

      const data = await res.json();

      setMessages([
        ...newMessages,
        { role: "bot", text: data.reply || data.error || "No response" }
      ]);
    } catch (error) {
      setMessages([
        ...newMessages,
        { role: "bot", text: "Something went wrong." }
      ]);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] pointer-events-none">
      <div className="pointer-events-auto flex flex-col items-end">
        {open && (
          <div className="mb-3 w-80 h-96 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 flex flex-col overflow-hidden">
            <div className="bg-blue-600 text-white p-3 font-semibold">
              AI Assistant
            </div>

            <div className="flex-1 p-3 overflow-y-auto space-y-2">
              {messages.map((m, i) => (
                <div
                  key={i}
                  className={`p-2 rounded-xl text-sm ${
                    m.role === "user"
                      ? "bg-blue-100 text-right text-black"
                      : "bg-gray-100 dark:bg-gray-700 text-black dark:text-white"
                  }`}
                >
                  {m.text}
                </div>
              ))}
            </div>

            <div className="p-3 border-t border-gray-200 dark:border-gray-700 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                className="flex-1 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-900 text-black dark:text-white"
                placeholder="Ask something..."
              />
              <button
                onClick={sendMessage}
                className="bg-blue-600 text-white px-4 rounded-lg"
              >
                Send
              </button>
            </div>
          </div>
        )}

        <button
          onClick={() => setOpen(!open)}
          className="bg-blue-600 text-white w-14 h-14 rounded-full shadow-lg hover:bg-blue-700 transition"
        >
          💬
        </button>
      </div>
    </div>
  );
}

export default Chatbot;