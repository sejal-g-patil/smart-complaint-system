import { Routes, Route } from "react-router-dom";
import AdminDashboard from "./pages/AdminDashboard";
import WorkerDashboard from "./pages/WorkerDashboard";
import UserDashboard from "./pages/UserDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Login from "./pages/Login";
import Register from "./pages/Register";

import CreateComplaint from "./pages/CreateComplaint";

import { useState } from "react";

function App() {

  const [darkMode, setDarkMode] =
    useState(true);

  return (

    <Routes>
<Route
  path="/profile"
  element={<Profile />}
/>


      <Route
        path="/login"
        element={<Login />}
      />

      <Route
        path="/register"
        element={<Register />}
      />
<Route path="/" element={<Home />} />


<Route
  path="/admin-dashboard"
  element={
    <ProtectedRoute>
      <AdminDashboard
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
    </ProtectedRoute>
  }
/>

<Route
  path="/worker-dashboard"
  element={
    <ProtectedRoute>
      <WorkerDashboard />
    </ProtectedRoute>
  }
/>

<Route
  path="/user-dashboard"
  element={
    <ProtectedRoute>
      <UserDashboard
        darkMode={darkMode}
        setDarkMode={setDarkMode}
      />
    </ProtectedRoute>
  }
/>

      <Route
        path="/create-complaint"
        element={
          <ProtectedRoute>

            <CreateComplaint />

          </ProtectedRoute>
        }
      />

    </Routes>
  );
}

export default App;