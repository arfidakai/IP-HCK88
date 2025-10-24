import { useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";

export default function Navbar() {
  const navigate = useNavigate();

  const rawToken =
    localStorage.getItem("authToken") ||
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    null;

  const token = rawToken
    ? rawToken.startsWith("Bearer ")
      ? rawToken.split(" ")[1]
      : rawToken
    : null;

  const [userName, setUserName] = useState("");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (token) {
      try {
        const decoded = jwtDecode(token);
        setUserName(decoded.email?.split("@")[0] || decoded?.name || "User");
      } catch (err) {
        console.error("Token decode error:", err);
      }
    } else {
      setUserName("");
    }
  }, [token]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("token");
    localStorage.removeItem("accessToken");
    setOpen(false);
    navigate("/login");
  };

  const handleLogin = () => {
    setOpen(false);
    navigate("/login");
  };

  return (
    <>
 <nav className="fixed top-0 left-0 w-full z-[99999] bg-gradient-to-r from-[#FFC3A1] to-[#FFD8BE] text-[#5C3A3A] shadow-md backdrop-blur-md bg-opacity-90">




        <div className="max-w-7xl mx-auto flex items-center justify-between px-5 py-3">
          {/* Logo */}
          <Link
            to="/"
            className="text-lg sm:text-xl font-extrabold tracking-wide hover:scale-105 transition-transform"
          >
            AI Course<span className="text-[#A75D5D]"> Recommender</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6 font-medium">
            <Link
              to="/"
              className="hover:text-[#A75D5D] transition-colors duration-200"
            >
              Home
            </Link>
            <Link
              to="/recommend"
              className="hover:text-[#A75D5D] transition-colors duration-200"
            >
              Recommend
            </Link>
            <Link
              to="/MyList"
              className="hover:text-[#A75D5D] transition-colors duration-200"
            >
              My List
            </Link>

            {token ? (
              <>
                <div className="relative group">
                  <div className="w-9 h-9 bg-[#A75D5D] text-white rounded-full flex items-center justify-center font-semibold uppercase shadow hover:scale-110 transition-transform">
                    {userName ? userName[0] : "U"}
                  </div>
                  <div className="absolute right-0 mt-2 hidden group-hover:block bg-white border rounded-lg shadow-lg px-3 py-2 text-sm text-[#5C3A3A]">
                    {userName}
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  className="bg-white text-[#A75D5D] px-4 py-2 rounded-full font-semibold shadow hover:bg-[#FFE5D4] transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={handleLogin}
                className="bg-white text-[#A75D5D] px-4 py-2 rounded-full font-semibold shadow hover:bg-[#FFE5D4] transition"
              >
                Login
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setOpen(!open)}
              className="flex flex-col justify-center items-center w-8 h-8 focus:outline-none"
            >
              <span
                className={`block w-6 h-0.5 bg-[#5C3A3A] transform transition duration-300 ${
                  open ? "rotate-45 translate-y-1.5" : ""
                }`}
              ></span>
              <span
                className={`block w-6 h-0.5 bg-[#5C3A3A] my-1 transition-opacity duration-300 ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              ></span>
              <span
                className={`block w-6 h-0.5 bg-[#5C3A3A] transform transition duration-300 ${
                  open ? "-rotate-45 -translate-y-1.5" : ""
                }`}
              ></span>
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={`fixed top-[60px] left-0 w-full bg-white shadow-md transition-transform duration-300 ease-in-out md:hidden ${
          open ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="px-5 py-4 space-y-3 font-medium text-[#5C3A3A]">
          <Link to="/" onClick={() => setOpen(false)} className="block hover:text-[#A75D5D]">
            Home
          </Link>
          <Link
            to="/recommend"
            onClick={() => setOpen(false)}
            className="block hover:text-[#A75D5D]"
          >
            Recommend
          </Link>
          <Link
            to="/MyList"
            onClick={() => setOpen(false)}
            className="block hover:text-[#A75D5D]"
          >
            My List
          </Link>

          <div className="border-t pt-3">
            {token ? (
              <>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-8 h-8 bg-[#A75D5D] text-white rounded-full flex items-center justify-center font-semibold uppercase">
                    {userName ? userName[0] : "U"}
                  </div>
                  <span>{userName || "User"}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="w-full bg-[#FFF5EF] hover:bg-[#FFE6D9] py-2 rounded-lg text-center font-medium transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <button
                onClick={handleLogin}
                className="w-full bg-[#FFF5EF] hover:bg-[#FFE6D9] py-2 rounded-lg text-center font-medium transition"
              >
                Login
              </button>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
