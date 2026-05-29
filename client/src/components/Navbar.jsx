import { useNavigate } from "react-router-dom";

function Navbar({
  darkMode,
  setDarkMode,
}) {

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/login");
  };

  return (

    <div className="bg-slate-900 text-white px-8 py-4 flex justify-between items-center shadow-xl">

      {/* LOGO */}

      <div
        onClick={() => navigate("/")}
        className="text-3xl font-bold text-cyan-400 cursor-pointer"
      >
        Smart Complaint
      </div>

      {/* MENU */}

      <div className="flex items-center gap-4">

        <button
          onClick={() => navigate("/")}
          className="bg-slate-800 hover:bg-slate-700 px-5 py-2 rounded-xl"
        >
          Home
        </button>

        <button
          onClick={() =>
            navigate("/profile")
          }
          className="bg-slate-800 hover:bg-slate-700 px-5 py-2 rounded-xl"
        >
          Profile
        </button>

        {/* USER */}

        {user?.role === "user" && (

          <button
            onClick={() =>
              navigate("/create-complaint")
            }
            className="bg-yellow-500 hover:bg-yellow-600 px-5 py-2 rounded-xl"
          >
            Create Complaint
          </button>

        )}

        {/* DARK MODE */}

        <button
          onClick={() =>
            setDarkMode(!darkMode)
          }
          className="bg-cyan-500 hover:bg-cyan-600 px-5 py-2 rounded-xl"
        >
          {darkMode
            ? "Light"
            : "Dark"}
        </button>

        {/* LOGOUT */}

        <button
          onClick={handleLogout}
          className="bg-red-500 hover:bg-red-600 px-5 py-2 rounded-xl"
        >
          Logout
        </button>

      </div>

    </div>
  );
}

export default Navbar;