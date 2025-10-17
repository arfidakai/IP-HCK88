import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";


export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("https://aicourse.arfidakai.site/api/register", form);
      // alert("✅ Akun berhasil dibuat! Silakan login.");
      Swal.fire({ icon: "success", title: "Akun berhasil dibuat!", text: "Silakan login untuk melanjutkan.", confirmButtonColor: "#A75D5D" })
      navigate("/login");
    } catch (err) {
      console.error(err);
      Swal.fire({ icon: "error", title: "Gagal!", text: "Gagal mendaftar. Coba lagi ya!", confirmButtonColor: "#A75D5D" })
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleRegister = () => {
    window.location.href = "https://aicourse.arfidakai.site/api/auth/google";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFF5EF]">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96 text-center">
        <h1 className="text-2xl font-bold text-[#A75D5D] mb-4">
          Daftar Akun Baru
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Nama lengkap"
            className="w-full border border-[#D3756B] rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#A75D5D] focus:outline-none"
            required
          />
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email"
            className="w-full border border-[#D3756B] rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#A75D5D] focus:outline-none"
            required
          />
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            placeholder="Password"
            className="w-full border border-[#D3756B] rounded-lg px-4 py-2 focus:ring-2 focus:ring-[#A75D5D] focus:outline-none"
            required
          />

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2 rounded-lg font-semibold transition duration-300 ${
              loading
                ? "bg-[#D3756B80] cursor-not-allowed"
                : "bg-[#A75D5D] hover:bg-[#D3756B] text-white"
            }`}
          >
            {loading ? "Mendaftar..." : "Daftar"}
          </button>
        </form>

        <div className="my-4 flex items-center justify-center text-[#A75D5D80]">
          <span className="h-px w-1/4 bg-[#FFC3A1]"></span>
          <span className="mx-2 text-sm">atau</span>
          <span className="h-px w-1/4 bg-[#FFC3A1]"></span>
        </div>

        <button
          onClick={handleGoogleRegister}
          className="flex items-center justify-center gap-2 bg-[#F0997D] hover:bg-[#FFC3A1] text-white px-4 py-2 rounded-lg shadow w-full transition duration-300"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Daftar dengan Google
        </button>

        <p className="text-[#5C3A3A] text-sm mt-6">
          Sudah punya akun?{" "}
          <a href="/login" className="text-[#A75D5D] hover:text-[#D3756B] font-medium">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}
