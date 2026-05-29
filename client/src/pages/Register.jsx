import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

import API from "../services/api";

function Register() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
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
      await API.post(
        "/auth/register",
        formData
      );

      alert("Registration Successful");

      navigate("/login");

    } catch (error) {
      console.log(error);

      alert("Registration Failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      
      <form
        onSubmit={handleSubmit}
        className="bg-slate-900 p-10 rounded-2xl w-full max-w-md shadow-2xl"
      >
        
        <h1 className="text-4xl font-bold text-white text-center mb-8">
          Register
        </h1>

        <div className="mb-5">
          <label className="text-slate-300">
            Name
          </label>

          <input
            type="text"
            name="name"
            onChange={handleChange}
            className="w-full mt-2 p-3 rounded-lg bg-slate-800 text-white outline-none"
            placeholder="Enter name"
            required
          />
        </div>

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

        <div className="mb-5">
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

        <div className="mb-6">
          <label className="text-slate-300">
            Role
          </label>

          <select
            name="role"
            onChange={handleChange}
            className="w-full mt-2 p-3 rounded-lg bg-slate-800 text-white outline-none"
          >
            <option value="user">
              User
            </option>

            <option value="worker">
              Worker
            </option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-cyan-500 hover:bg-cyan-600 transition p-3 rounded-lg text-lg font-semibold text-white"
        >
          Register
        </button>

        <p className="text-slate-400 mt-6 text-center">
          Already have an account?{" "}

          <Link
            to="/login"
            className="text-cyan-400"
          >
            Login
          </Link>
        </p>

      </form>

    </div>
  );
}

export default Register;