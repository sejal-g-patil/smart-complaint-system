import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import API from "../services/api";

function Login() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    const res = await API.post("/auth/login", formData);

    // token
    localStorage.setItem("token", res.data.token);

    // user object
    localStorage.setItem(
      "user",
      JSON.stringify(res.data.user)
    );

    // 🔥 ADD THIS (IMPORTANT FIX)
    localStorage.setItem("role", res.data.user.role);
    localStorage.setItem("userId", res.data.user.id);

    alert("Login Successful");

    // 🔥 ROLE BASED REDIRECT (IMPORTANT)
    if (res.data.user.role === "admin") {

  navigate("/admin-dashboard");

} else if (
  res.data.user.role === "worker"
) {

  navigate("/worker-dashboard");

} else {

  navigate("/user-dashboard");
}

  } catch (error) {
    console.log(error);
    alert("Login Failed");
  }
};

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 p-10 rounded-2xl w-full max-w-md shadow-2xl"
      >
        
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Login
        </h1>

        <div className="mb-5">
          <label className="text-slate-300">
            Email
          </label>

          <input
            type="email"
            name="email"
            onChange={handleChange}
            className="w-full mt-2 p-3 rounded-lg bg-slate-800 text-white outline-none"
            placeholder="Enter email"
            required
          />
        </div>

        <div className="mb-6">
          <label className="text-slate-300">
            Password
          </label>

          <input
            type="password"
            name="password"
            onChange={handleChange}
            className="w-full mt-2 p-3 rounded-lg bg-slate-800 text-white outline-none"
            placeholder="Enter password"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full bg-cyan-500 hover:bg-cyan-600 transition p-3 rounded-lg text-lg font-semibold text-white"
        >
          Login
        </button>

        <p className="text-slate-400 mt-6 text-center">
          Don't have an account?{" "}
          
          <Link
            to="/register"
            className="text-cyan-400"
          >
            Register
          </Link>
        </p>

      </form>

    </div>
  );
}

export default Login;