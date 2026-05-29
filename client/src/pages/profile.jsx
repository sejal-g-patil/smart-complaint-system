import { useNavigate } from "react-router-dom";

function Profile() {

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

    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">

      <div className="bg-slate-900 p-10 rounded-3xl w-full max-w-xl shadow-2xl">

        {/* PROFILE HEADER */}

        <div className="flex flex-col items-center">

          <div className="w-28 h-28 rounded-full bg-cyan-500 flex items-center justify-center text-5xl font-bold">

            {user?.name?.charAt(0)}

          </div>

          <h1 className="text-3xl font-bold text-white mt-5">

            {user?.name}

          </h1>

          <p className="text-slate-400 mt-2">

            {user?.email}

          </p>

        </div>

        {/* DETAILS */}

        <div className="mt-10 space-y-5">

          <div className="bg-slate-800 p-5 rounded-2xl">

            <p className="text-slate-400">
              Role
            </p>

            <h2 className="text-2xl text-cyan-400 font-bold capitalize mt-2">

              {user?.role}

            </h2>

          </div>

          <div className="bg-slate-800 p-5 rounded-2xl">

            <p className="text-slate-400">
              Account Status
            </p>

            <h2 className="text-2xl text-green-400 font-bold mt-2">

              Active

            </h2>

          </div>

        </div>

        {/* BUTTONS */}

        <div className="flex gap-4 mt-10">

          <button
            onClick={() => navigate(-1)}
            className="flex-1 bg-slate-700 hover:bg-slate-600 p-4 rounded-2xl text-white font-semibold"
          >
            Back
          </button>

          <button
            onClick={handleLogout}
            className="flex-1 bg-red-500 hover:bg-red-600 p-4 rounded-2xl text-white font-semibold"
          >
            Logout
          </button>

        </div>

      </div>

    </div>

  );
}

export default Profile;