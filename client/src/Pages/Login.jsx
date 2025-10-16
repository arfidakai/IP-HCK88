import { useState, useEffect } from "react";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      localStorage.setItem("authToken", token);
      navigate("/"); 
    }
  }, [location]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("http://localhost/api/login", form);
      localStorage.setItem("authToken", res.data.token);
      alert("✅ Login berhasil!");
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("❌ Email atau password salah!");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "http://localhost/api/auth/google";
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#FFF5EF]">
      <div className="bg-white p-8 rounded-xl shadow-lg w-96 text-center">
        <h1 className="text-2xl font-bold text-[#A75D5D] mb-4">Login Akun</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
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
            {loading ? "Memproses..." : "Login"}
          </button>
        </form>

        <div className="my-4 flex items-center justify-center text-[#A75D5D80]">
          <span className="h-px w-1/4 bg-[#FFC3A1]"></span>
          <span className="mx-2 text-sm">atau</span>
          <span className="h-px w-1/4 bg-[#FFC3A1]"></span>
        </div>

        <button
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-2 bg-[#F0997D] hover:bg-[#FFC3A1] text-white px-4 py-2 rounded-lg shadow w-full transition duration-300"
        >
          <img
            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Login dengan Google
        </button>

        <p className="text-[#5C3A3A] text-sm mt-6">
          Belum punya akun?{" "}
          <a href="/register" className="text-[#A75D5D] hover:text-[#D3756B] font-medium">
            Daftar
          </a>
        </p>
      </div>
    </div>
  );
}
