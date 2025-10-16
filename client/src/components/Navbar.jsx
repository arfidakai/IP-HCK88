import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const navigate = useNavigate();
  const token = localStorage.getItem("authToken");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <nav className="#D3756B80 text-black px-6 py-3 flex justify-between items-center shadow">
      <h1
        onClick={() => navigate("/")}
        className="text-xl font-bold cursor-pointer"
      >
        AI Course Recommender
      </h1>

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
            <button
              onClick={handleLogout}
              className="bg-white #A75D5D px-3 py-1 rounded-lg font-medium hover:bg-gray-200"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={handleLogin}
            className="bg-white #A75D5D px-3 py-1 rounded-lg font-medium hover:bg-gray-200"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
}
