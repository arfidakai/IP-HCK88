import { useState, useEffect } from "react";
import axios from "axios";

export default function MyList() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState("all");

  const loadList = async () => {
    try {
      setLoading(true);
      const res = await axios.get("http://aicourse.arfidakai.site/api/list");
      setList(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === "belum" ? "selesai" : "belum";
      await axios.put(`http://aicourse.arfidakai.site/api/list/${id}`, {
        status: newStatus,
      });
      setList((prev) =>
        prev.map((v) =>
          v.id === id ? { ...v, status: newStatus } : v
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  const removeFromList = async (id) => {
    if (!confirm("Yakin mau hapus video ini?")) return;
    try {
      await axios.delete(`http://aicourse.arfidakai.site/api/list/${id}`);
      setList((prev) => prev.filter((v) => v.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    loadList();
  }, []);

  const filteredList =
    filter === "all"
      ? list
      : list.filter((v) => v.status === filter);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-[#A75D5D] mb-4">
        🎯 Daftar Belajar Saya
      </h1>

      {/* Filter buttons */}
      <div className="flex gap-3 mb-6">
        <button
          onClick={() => setFilter("all")}
          className={`px-3 py-1 rounded-lg ${
            filter === "all"
              ? "bg-[#A75D5D] text-white"
              : "bg-[#FFECE2] text-[#5C3A3A]"
          }`}
        >
          Semua
        </button>
        <button
          onClick={() => setFilter("belum")}
          className={`px-3 py-1 rounded-lg ${
            filter === "belum"
              ? "bg-[#A75D5D] text-white"
              : "bg-[#FFECE2] text-[#5C3A3A]"
          }`}
        >
          Belum Selesai
        </button>
        <button
          onClick={() => setFilter("selesai")}
          className={`px-3 py-1 rounded-lg ${
            filter === "selesai"
              ? "bg-[#A75D5D] text-white"
              : "bg-[#FFECE2] text-[#5C3A3A]"
          }`}
        >
          Selesai
        </button>
      </div>

      {loading ? (
        <p className="text-[#5C3A3A]">⏳ Memuat daftar...</p>
      ) : filteredList.length === 0 ? (
        <p className="italic text-[#A75D5D80]">Belum ada data.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredList.map((v) => (
            <div
              key={v.id}
              className={`p-4 rounded-xl shadow border ${
                v.status === "selesai"
                  ? "bg-[#E8F5E9] border-[#81C784]"
                  : "bg-[#FFF5EF] border-[#FFC3A1]"
              }`}
            >
              <img
                src={v.thumbnail}
                alt={v.title}
                className="rounded-lg mb-3"
              />
              <h3 className="font-semibold text-[#5C3A3A] mb-2">{v.title}</h3>

              <div className="flex justify-between items-center">
                <button
                  onClick={() => toggleStatus(v.id, v.status)}
                  className={`px-3 py-1 rounded-lg text-white text-sm ${
                    v.status === "selesai"
                      ? "bg-[#A75D5D] hover:bg-[#D3756B]"
                      : "bg-[#F0997D] hover:bg-[#FFC3A1]"
                  }`}
                >
                  {v.status === "selesai" ? "✅ Tandai Belum" : "✔️ Tandai Selesai"}
                </button>
                <button
                  onClick={() => removeFromList(v.id)}
                  className="bg-[#FFC3A1] hover:bg-[#A75D5D] text-white px-3 py-1 rounded-lg text-sm"
                >
                  🗑️ Hapus
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
