import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const logoutHandler = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-slate-900 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link to="/">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            RepoLens
          </h1>
        </Link>

        {/* Menu */}
        <div className="flex items-center gap-6">
          <Link to="/" className="hover:text-indigo-400 transition">
            Dashboard
          </Link>

          <Link to="/history" className="hover:text-indigo-400 transition">
            History
          </Link>

          <div className="bg-slate-800 px-4 py-2 rounded-xl">
            👋 {user?.name}
          </div>

          <button
            onClick={logoutHandler}
            className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-xl transition"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
