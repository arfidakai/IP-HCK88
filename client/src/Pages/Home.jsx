import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ChatBubble from "../components/ChatBubble";
import { jwtDecode } from "jwt-decode";
import TrendingCard from "../components/TrendingCard";

export default function Home() {
  const [chatInput, setChatInput] = useState("");
  const [videos, setVideos] = useState([]);
  const [nextPageToken, setNextPageToken] = useState(null);
  const [loading, setLoading] = useState(false);
  const [recommendationKeyword, setRecommendationKeyword] = useState("");
  const [recommendedVideos, setRecommendedVideos] = useState([]);
  const [showRecommendations, setShowRecommendations] = useState(false);
  const [saving, setSaving] = useState(false);
  const loaderRef = useRef(null);

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

  const clearHistory = () => {
    if (confirm("Yakin mau hapus seluruh riwayat chat kamu?")) {
      localStorage.removeItem(`chatHistory_${userId}`);
      setMessages([]);
      setRecommendationKeyword("");
      setShowRecommendations(false);
    }
  };

  const sendMessage = async () => {
    if (!chatInput.trim()) return;
    const userMsg = { sender: "user", text: chatInput };
    setMessages((prev) => [...prev, userMsg]);
    setChatInput("");
    setLoading(true);

    try {
      const res = await axios.post(
        "http://aicourse.arfidakai.site/api/consult",
        { message: chatInput }
      );

      const aiReply = res.data.reply;
      const aiMsg = { sender: "bot", text: aiReply };
      setMessages((prev) => [...prev, aiMsg]);

      const lowerReply = aiReply.toLowerCase();
      const keywordMatch = lowerReply.match(
        /frontend|backend|fullstack|data|datascience|ai|machinelearning|deeplearning|ml|ui|ux|design|cyber|security|cloud|devops|network|database|sql|nosql|api|mobile|android|ios|web|software|game|blockchain|robotics|embedded|python|javascript|typescript|java|c\+\+|golang|php|ruby|react|node|express|django|flask|laravel|spring|aws|azure|gcp|firebase|docker|kubernetes|linux|testing|qa|automation/gi
      );

      if (keywordMatch && keywordMatch.length > 0) {
        setRecommendationKeyword(keywordMatch[0]);
        setShowRecommendations(false);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchRecommendedVideos = async (keyword) => {
    try {
      const res = await axios.post(
        "http://aicourse.arfidakai.site/api/recommend",
        {
          interest: keyword,
        }
      );
      setRecommendedVideos(res.data.videos || []);
      setShowRecommendations(true);
    } catch (err) {
      console.error("Gagal ambil rekomendasi:", err);
    }
  };

  const handleSave = async (video) => {
    try {
      setSaving(true);
      await axios.post("http://aicourse.arfidakai.site/api/list", {
        title: video.title,
        videoId: video.videoId,
        thumbnail: video.thumbnail,
      });

      alert(`✅ Video "${video.title}" berhasil disimpan ke daftar belajar!`);
    } catch (err) {
      console.error("Gagal menyimpan video:", err);
      alert("❌ Gagal menyimpan video.");
    } finally {
      setSaving(false);
    }
  };

  const loadVideos = async () => {
    try {
      const res = await axios.get(
        "http://aicourse.arfidakai.site/api/trending",
        {
          params: { pageToken: nextPageToken },
        }
      );

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
    return () => observer.disconnect();
  }, [loaderRef.current]);

  return (
    <div className="space-y-12">
      {/* Chatbot Section */}
      <section className="bg-[#FFF5EF] shadow rounded-xl p-6 relative">
        {/* tombol hapus */}
        <button
          onClick={clearHistory}
          className="absolute top-4 right-4 text-[#00000080] hover:text-[#000000] text-sm"
          title="Hapus riwayat chat"
        >
          🗑️ delete
        </button>

        <h2 className="text-2xl font-bold text-[#A75D5D] mb-4 flex items-center gap-2">
          🤖 Konsultasi Minat Belajar
        </h2>
        <p className="text-[#5C3A3A] mb-4">
          Ceritakan minatmu, dan AI akan bantu saranin bidang belajar terbaik!
        </p>

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

        {recommendationKeyword && !showRecommendations && (
          <div className="mt-4 text-right">
            <button
              onClick={() => fetchRecommendedVideos(recommendationKeyword)}
              className="bg-[#F0997D] hover:bg-[#FFC3A1] text-white px-4 py-2 rounded-lg shadow transition"
            >
              🎓 Lihat Rekomendasi Belajar “{recommendationKeyword}”
            </button>
          </div>
        )}
      </section>

      {showRecommendations && (
        <section>
          <h2 className="text-2xl font-semibold text-[#A75D5D] mb-4">
            🎥 Rekomendasi Belajar “{recommendationKeyword}”
          </h2>
          {recommendedVideos.length === 0 ? (
            <p className="text-[#A75D5D80] italic">
              Belum ada video yang direkomendasikan.
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {recommendedVideos.map((v, i) => (
                <TrendingCard
                  key={v.videoId + i}
                  video={v}
                  onSave={handleSave}
                />
              ))}
            </div>
          )}
          {saving && (
            <p className="text-[#5C3A3A] italic text-sm mt-2">
              ⏳ Menyimpan ke daftar belajar...
            </p>
          )}
        </section>
      )}

      <section>
        <h2 className="text-2xl font-semibold text-[#000000] mb-4">
          🔥 Video Trending IT
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {videos.map((v, i) => (
            <TrendingCard key={v.videoId + i} video={v} onSave={handleSave} />
          ))}
        </div>
        <div ref={loaderRef} className="text-center py-4 text-[#00000080]">
          ⏳ Memuat lebih banyak...
        </div>
      </section>
    </div>
  );
}
