import { useState } from "react";
import Ollama from "ollama";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function OllamaChat() {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAsk = async () => {
    if (!input.trim() || loading) return;

    const userMessage = {
      role: "user",
      content: input,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setError("");
    setLoading(true);

    try {
      const response = await Ollama.chat({
        model: "llama3.2",
        messages: updatedMessages,
      });

      setMessages((currentMessages) => [
        ...currentMessages,
        response.message,
      ]);
    } catch (err) {
      setError("Failed to get response from Ollama.");
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    setInput("");
    setError("");
  };

  return (
    <section className="chat-shell">
      <div className="chat-card">
        <header className="chat-header">
          <h1>HR Help Assistant</h1>
          <p>
            Build a local AI chatbot prototype that helps employees ask general
            HR questions.
          </p>
        </header>

        <p className="chat-guidance">
          Ask about general HR topics such as benefits, time off, policies, or
          workplace procedures. Do not enter private, sensitive, or personal
          information.
        </p>

        <div className="chat-input-area">
          <label htmlFor="chat-prompt" className="sr-only">
            Ask the HR assistant
          </label>

          <textarea
            id="chat-prompt"
            rows="5"
            className="chat-textarea"
            placeholder="Ask about benefits, PTO, or workplace policies..."
            value={input}
            onChange={(event) => setInput(event.target.value)}
          />
        </div>

        <div className="chat-actions">
          <button
            className="chat-button"
            onClick={handleAsk}
            disabled={!input.trim() || loading}
          >
            Send
          </button>

          <button
            className="chat-button chat-button-secondary"
            onClick={clearChat}
            disabled={messages.length === 0 || loading}
          >
            Clear thread
          </button>
        </div>

        <div className="message-list" aria-label="Conversation thread">
          {messages.map((message, index) => (
            <article key={index}>
              <strong>
                {message.role === "user" ? "You" : "Assistant"}:
              </strong>

              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {message.content}
              </ReactMarkdown>
            </article>
          ))}

          {loading && (
            <div>
              <strong>Assistant:</strong> Thinking...
            </div>
          )}

          {error && <p>{error}</p>}
        </div>
      </div>
    </section>
  );
}