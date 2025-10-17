import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");
  const [userName, setUserName] = useState("");

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded.email?.split("@")[0] || "User");
      } catch (err) {
        console.error("Token decode error:", err);
      }
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <nav className="bg-[#FFC3A1] text-[#5C3A3A] px-6 py-3 flex justify-between items-center shadow-md">
      {/* Logo / Title */}
      <h1
        onClick={() => navigate("/")}
        className="text-xl font-bold cursor-pointer hover:text-[#A75D5D] transition"
      >
        AI Course Recommender
      </h1>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        {token ? (
          <>
            <button
              onClick={() => navigate("/recommend")}
              className="hover:underline text-sm"
            >
              Rekomendasi
            </button>
            <button
              onClick={() => navigate("/MyList")}
              className="hover:underline text-sm"
            >
              📚 Daftar Belajar
            </button>

            {/* Profile Circle */}
            <div className="relative group">
              <div className="w-9 h-9 bg-[#A75D5D] text-white rounded-full flex items-center justify-center font-bold uppercase cursor-pointer select-none">
                {userName ? userName[0] : "U"}
              </div>
              <div className="absolute right-0 mt-2 hidden group-hover:block bg-white border border-[#A75D5D30] rounded-lg shadow-lg px-3 py-2 text-sm text-[#5C3A3A] whitespace-nowrap">
                {userName}
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="bg-white text-[#A75D5D] px-3 py-1 rounded-lg font-medium hover:bg-[#FFE5D4] transition"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={handleLogin}
            className="bg-white text-[#A75D5D] px-3 py-1 rounded-lg font-medium hover:bg-[#FFE5D4] transition"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
