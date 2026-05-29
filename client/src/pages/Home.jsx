import { useNavigate } from "react-router-dom";

function Home() {

  const navigate = useNavigate();

  return (

    <div className="min-h-screen bg-slate-950 text-white">

      {/* NAVBAR */}

      <div className="flex justify-between items-center px-10 py-6 bg-slate-900">

        <h1 className="text-3xl font-bold text-cyan-400">
          Smart Complaint
        </h1>

        <div className="flex gap-4">

          <button
            onClick={() => navigate("/login")}
            className="bg-cyan-500 hover:bg-cyan-600 px-5 py-2 rounded-xl"
          >
            Login
          </button>

          <button
            onClick={() => navigate("/register")}
            className="bg-green-500 hover:bg-green-600 px-5 py-2 rounded-xl"
          >
            Register
          </button>

        </div>

      </div>

      {/* HERO SECTION */}

      <div className="flex flex-col items-center justify-center text-center px-6 py-24">

        <h1 className="text-6xl font-bold leading-tight">

          Smart Complaint
          <br />

          Management System

        </h1>

        <p className="text-slate-400 text-xl mt-6 max-w-3xl">

          AI-powered complaint management platform
          with live tracking, worker assignment,
          analytics, image upload, and real-time updates.

        </p>

        <button
          onClick={() => navigate("/register")}
          className="mt-10 bg-cyan-500 hover:bg-cyan-600 px-8 py-4 rounded-2xl text-xl font-semibold"
        >
          Get Started
        </button>

      </div>

      {/* FEATURES */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 px-10 pb-20">

        <div className="bg-slate-900 p-8 rounded-2xl">

          <h2 className="text-2xl font-bold text-cyan-400">
            AI Priority Detection
          </h2>

          <p className="text-slate-400 mt-4">

            Automatically detects complaint priority
            using AI-based analysis.

          </p>

        </div>

        <div className="bg-slate-900 p-8 rounded-2xl">

          <h2 className="text-2xl font-bold text-cyan-400">
            Live Tracking
          </h2>

          <p className="text-slate-400 mt-4">

            Track complaint progress in real-time
            with status updates.

          </p>

        </div>

        <div className="bg-slate-900 p-8 rounded-2xl">

          <h2 className="text-2xl font-bold text-cyan-400">
            Worker Assignment
          </h2>

          <p className="text-slate-400 mt-4">

            Admin can assign workers and monitor
            completion progress easily.

          </p>

        </div>

      </div>

    </div>

  );
}

export default Home;