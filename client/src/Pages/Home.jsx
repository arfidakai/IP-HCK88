import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ChatBubble from "../components/ChatBubble";
import { jwtDecode } from "jwt-decode";
import TrendingCard from "../components/TrendingCard";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [chatInput, setChatInput] = useState("");
  const [videos, setVideos] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recommendationKeyword, setRecommendationKeyword] = useState("");
  const loaderRef = useRef(null);
  const navigate = useNavigate();

  const token = localStorage.getItem("authToken");
  let userId = "guest";
  if (token) {
    try {
      const decoded = jwtDecode(token);
      userId = decoded.id || "guest";
    } catch (e) {
      console.error("Token decode error:", e);
    }
  }

  const [messages, setMessages] = useState(() => {
    const saved = localStorage.getItem(`chatHistory_${userId}`);
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem(`chatHistory_${userId}`, JSON.stringify(messages));
  }, [messages, userId]);


  const sendMessage = async () => {
    if (!chatInput.trim()) return;

    const userMsg = { sender: "user", text: chatInput };
    setMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setLoading(true);

    try {
      const res = await axios.post("http://localhost:8080/api/consult", {
        message: chatInput,
      });
      const aiReply = res.data.reply;
      const aiMsg = { sender: "bot", text: aiReply };
      setMessages((prev) => [...prev, aiMsg]);

      const lowerReply = aiReply.toLowerCase();
      const keywordMatch = lowerReply.match(
        /frontend|backend|data|ui|ux|cyber|ai|cloud|devops|security|mobile|android|web|fullstack|python|aws|react|node/gi
      );
      if (keywordMatch && keywordMatch.length > 0) {
        const keyword = keywordMatch[0];
        setRecommendationKeyword(keyword);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const loadVideos = async () => {
    try {
      const res = await axios.get("http://localhost:8080/api/trending", {
        params: { pageToken: nextPageToken },
      });
      setVideos((prev) => [...prev, ...res.data.videos]);
      setNextPageToken(res.data.nextPageToken);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadVideos();
      },
      { threshold: 1 }
    );
    if (loaderRef.current) observer.observe(loaderRef.current);
    return () => {
      if (loaderRef.current) observer.disconnect();
    };
  }, [loaderRef.current]);

  return (
    <div className="space-y-12">
      {/* Chatbot Section */}
      <section className="bg-[#FFF5EF] shadow rounded-xl p-6">
        <h2 className="text-2xl font-bold text-[#A75D5D] mb-4 flex items-center gap-2">
          🤖 Konsultasi Minat Belajar
        </h2>
        <p className="text-[#5C3A3A] mb-4">
          Ceritakan minatmu, dan AI akan bantu saranin bidang belajar terbaik!
        </p>

        {/* Chat Area */}
        <div className="border border-[#FFC3A1] rounded-lg p-4 h-64 overflow-y-auto mb-4 bg-[#FFECE2]">
          {messages.length === 0 ? (
            <p className="text-[#A75D5D80] italic text-center mt-16">
              Mulai ngobrol dengan AI...
            </p>
          ) : (
            messages.map((msg, idx) => (
              <ChatBubble key={idx} sender={msg.sender} text={msg.text} />
            ))
          )}
          {loading && (
            <div className="flex justify-start mb-2">
              <div className="bg-[#FFC3A1] text-[#5C3A3A] px-3 py-2 rounded-2xl inline-flex items-center gap-1">
                <span className="animate-bounce">●</span>
                <span className="animate-bounce delay-100">●</span>
                <span className="animate-bounce delay-200">●</span>
              </div>
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={chatInput}
            onChange={(e) => setChatInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            placeholder="Tulis minat kamu (contoh: pengen belajar AI)..."
            className="flex-1 border border-[#D3756B] rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#A75D5D] focus:outline-none"
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className={`${
              loading
                ? "bg-[#D3756B80] cursor-not-allowed"
                : "bg-[#A75D5D] hover:bg-[#D3756B]"
            } text-white px-4 py-2 rounded-lg shadow transition`}
          >
            {loading ? "..." : "Kirim"}
          </button>
        </div>

        {recommendationKeyword && (
          <div className="mt-4 text-right">
            <button
              onClick={() =>
                navigate(`/recommend?interest=${recommendationKeyword}`)
              }
              className="bg-[#F0997D] hover:bg-[#FFC3A1] text-white px-4 py-2 rounded-lg shadow transition"
            >
              🎯 Lihat Rekomendasi Belajar “{recommendationKeyword}”
            </button>
          </div>
        )}
      </section>

      {/* Trending Videos Section */}
      <section>
        <h2 className="text-2xl font-semibold text-[#000000] mb-4">
          🔥 Video Trending IT
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {videos.map((v, i) => (
            <TrendingCard key={v.videoId + i} video={v} />
          ))}
        </div>
        <div ref={loaderRef} className="text-center py-4 text-[#00000080]">
          ⏳ Memuat lebih banyak...
        </div>
      </section>
    </div>
  );
}
