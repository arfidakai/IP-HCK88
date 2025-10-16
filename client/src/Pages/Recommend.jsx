import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import TrendingCard from "../components/TrendingCard";

export default function Recommend() {
  const location = useLocation();
  const [interest, setInterest] = useState("");
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  // Ambil interest dari query string
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const interestParam = params.get("interest") || "";
    setInterest(interestParam);
    if (interestParam) getRecommendations(interestParam);
  }, [location.search]);

  // Ambil rekomendasi dari backend
  const getRecommendations = async (keyword) => {
    setLoading(true);
    try {
      const res = await axios.post("http://aicourse.arfidakai.site/api/recommend", {
        interest: keyword,
      });
      setVideos(res.data.videos || []);
    } catch (err) {
      console.error("Gagal memuat rekomendasi:", err);
    } finally {
      setLoading(false);
    }
  };

  // Simpan video ke daftar belajar
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

  const handleSearch = (e) => {
    e.preventDefault();
    if (interest.trim()) getRecommendations(interest);
  };

  return (
    <div className="p-6 space-y-8">
      <h1 className="text-3xl font-bold text-[#A75D5D]">
        🎯 Rekomendasi Belajar {interest && `"${interest}"`}
      </h1>

      <form onSubmit={handleSearch} className="flex gap-2 mt-2 mb-4">
        <input
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          placeholder="Cari topik lain (contoh: React, Python, AWS...)"
          className="flex-1 border border-[#D3756B] rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#A75D5D] focus:outline-none"
        />
        <button
          type="submit"
          className="bg-[#FFC3A1] hover:bg-[#A75D5D] text-[#5C3A3A] px-4 py-2 rounded-lg shadow transition duration-300"
        >
          🔍 Cari
        </button>
      </form>

      {loading ? (
        <p className="text-[#A75D5D80]">⏳ Sedang memuat video...</p>
      ) : videos.length === 0 ? (
        <p className="text-[#00000080] italic">
          Belum ada hasil. Coba topik lain di halaman Home.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {videos.map((v, i) => (
            <TrendingCard key={v.videoId + i} video={v} onSave={handleSave} />
          ))}
        </div>
      )}

      {saving && (
        <p className="text-[#00000080] text-sm italic">
          ⏳ Menyimpan ke daftar belajar...
        </p>
      )}
    </div>
  );
}
