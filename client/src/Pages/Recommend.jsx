import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import axios from "axios";
import TrendingCard from "../components/TrendingCard";
import Swal from "sweetalert2";
import { jwtDecode } from "jwt-decode";

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
      const res = await axios.post("https://aicourse.arfidakai.site/api/recommend", {
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

      // Ambil token dari localStorage (beberapa kemungkinan nama)
      const rawToken =
        localStorage.getItem("authToken") ||
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        null;

      if (!rawToken) {
        setSaving(false);
        return Swal.fire({
          icon: "warning",
          title: "Belum Login!",
          text: "Silakan login dulu sebelum menyimpan video.",
          confirmButtonColor: "#A75D5D",
        });
      }

      const token = rawToken.startsWith("Bearer ") ? rawToken.split(" ")[1] : rawToken;
      const authHeader = rawToken.startsWith("Bearer ") ? rawToken : `Bearer ${rawToken}`;

      // decode untuk ambil userId
      let userId = null;
      try {
        const decoded = jwtDecode(token);
        userId = decoded?.id ?? decoded?.userId ?? decoded?.sub ?? null;
      } catch (e) {
        console.error("Token decode error:", e);
      }

      const body = {
        title: video.title,
        videoId: video.videoId,
        thumbnail: video.thumbnail,
        ...(userId ? { userId: Number(userId) } : {}),
      };

      await axios.post("https://aicourse.arfidakai.site/api/list", body, {
        headers: { Authorization: authHeader, "Content-Type": "application/json" },
      });

      Swal.fire({
        icon: "success",
        title: "Berhasil!",
        text: "Video berhasil disimpan ke daftar belajar!",
        confirmButtonColor: "#A75D5D",
      });
    } catch (err) {
      console.error("Gagal menyimpan video:", err);
      Swal.fire({
        icon: "error",
        title: "Gagal!",
        text: err.response?.data?.error || "Gagal menyimpan video. Coba lagi ya!",
        confirmButtonColor: "#A75D5D",
      });
    } finally {
      setSaving(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (interest.trim()) getRecommendations(interest);
  };

  return (
   <div className="space-y-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-[#A75D5D]">
        🎯 Rekomendasi Belajar {interest && `"${interest}"`}
      </h1>

      <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-2 mt-2 mb-4">
        <input
          value={interest}
          onChange={(e) => setInterest(e.target.value)}
          placeholder="Cari topik lain (contoh: React, Python, AWS...)"
          className="flex-1 border border-[#D3756B] rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#A75D5D] focus:outline-none w-full"
        />
        <button
          type="submit"
          className="bg-[#FFC3A1] hover:bg-[#A75D5D] text-[#5C3A3A] px-4 py-2 rounded-lg shadow transition duration-300 w-full sm:w-auto"
        >
          🔍 Cari
        </button>
      </form>

      {loading ? (
        <p className="text-[#A75D5D80]">⏳ Sedang memuat video...</p>
      ) : videos.length === 0 ? (
        <p className="text-[#00000080] italic">Belum ada hasil. Coba topik lain di halaman Home.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
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
