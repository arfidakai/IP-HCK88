import { BrowserRouter, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./Pages/Home";
import Recommend from "./pages/Recommend";
import MyList from "./Pages/MyList";
import Login from "./Pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Register from "./Pages/Register";

export default function App() {
  return (
    <BrowserRouter>
     <div className="bg-[#FFF8F5] min-h-screen text-[#5C3A3A]">
      <Navbar />
       <main className="pt-[80px] px-4 sm:px-6 pb-10 max-w-7xl mx-auto">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          />
          <Route
            path="/recommend"
            element={
              <ProtectedRoute>
                <Recommend />
              </ProtectedRoute>
            }
          />
          <Route
            path="/MyList"
            element={
              <ProtectedRoute>
                <MyList />
              </ProtectedRoute>
            }
          />
        </Routes>
       </main>
     </div>
    </BrowserRouter>
  );
}
