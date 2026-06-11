import {
  FaClipboardList,
  FaCheckCircle,
  FaClock,
} from "react-icons/fa";
import Navbar from "../components/Navbar";

import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import API from "../services/api";

function UserDashboard({
  darkMode,
  setDarkMode,
}) {

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const token =
    localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  const [complaints, setComplaints] =
    useState([]);

  // FETCH USER COMPLAINTS

  const fetchComplaints = async () => {

    try {

      const res = await API.get(
        "/complaints/my",
        config
      );

      setComplaints(res.data);

    } catch (error) {

      console.log(error);
    }
  };

  useEffect(() => {

    fetchComplaints();

  }, []);

  // COUNTS

  const totalComplaints =
    complaints.length;

  const resolvedComplaints =
    complaints.filter(
      (c) => c.status === "Resolved"
    ).length;

  const pendingComplaints =
    complaints.filter(
      (c) => c.status === "Pending"
    ).length;

  // LOGOUT

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/login");
  };

  return (
    

    <div
      className={`min-h-screen ${
        darkMode
          ? "bg-slate-950 text-white"
          : "bg-slate-100 text-black"
      }`}
    >

      {/* TOPBAR */}

      <div className="flex flex-col lg:flex-row justify-between items-center p-6 gap-5">
        

        <div>

          <h1 className="text-4xl font-bold">
            User Dashboard
          </h1>

          <p className="text-slate-400 mt-2">
            Welcome back, {user?.name}
          </p>

        </div>

        <div className="flex flex-wrap gap-4">

          <button
            onClick={() =>
              setDarkMode(!darkMode)
            }
            className="bg-cyan-500 hover:bg-cyan-600 px-5 py-3 rounded-xl"
          >
            {darkMode
              ? "Light Mode"
              : "Dark Mode"}
          </button>

          <button
            onClick={() =>
              navigate("/create-complaint")
            }
            className="bg-yellow-500 hover:bg-yellow-600 px-5 py-3 rounded-xl"
          >
            Create Complaint
          </button>

          <button
            onClick={() =>
              navigate("/profile")
            }
            className="bg-slate-800 hover:bg-slate-700 px-5 py-3 rounded-xl"
          >
            Profile
          </button>

          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-5 py-3 rounded-xl"
          >
            Logout
          </button>

        </div>

      </div>

      {/* STATS */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">

        {/* TOTAL */}

        <div className="bg-slate-900 p-6 rounded-2xl shadow-xl">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-slate-400">
                Total Complaints
              </p>

              <h1 className="text-4xl font-bold mt-3">
                {totalComplaints}
              </h1>

            </div>

            <FaClipboardList className="text-5xl text-cyan-400" />

          </div>

        </div>

        {/* RESOLVED */}

        <div className="bg-slate-900 p-6 rounded-2xl shadow-xl">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-slate-400">
                Resolved
              </p>

              <h1 className="text-4xl font-bold mt-3">
                {resolvedComplaints}
              </h1>

            </div>

            <FaCheckCircle className="text-5xl text-green-400" />

          </div>

        </div>

        {/* PENDING */}

        <div className="bg-slate-900 p-6 rounded-2xl shadow-xl">

          <div className="flex justify-between items-center">

            <div>

              <p className="text-slate-400">
                Pending
              </p>

              <h1 className="text-4xl font-bold mt-3">
                {pendingComplaints}
              </h1>

            </div>

            <FaClock className="text-5xl text-yellow-400" />

          </div>

        </div>

      </div>

      {/* COMPLAINT TABLE */}

      <div className="p-6">

        <div className="bg-slate-900 p-6 rounded-2xl overflow-x-auto">

          <h2 className="text-2xl font-bold mb-6">
            My Complaints
          </h2>

          <table className="w-full min-w-[1000px]">

            <thead>

              <tr className="border-b border-slate-700 text-left">

                <th className="p-4">
                  Title
                </th>

                <th className="p-4">
                  Status
                </th>

                <th className="p-4">
                  Priority
                </th>

                <th className="p-4">
                  Worker
                </th>

                <th className="p-4">
                  Date
                </th>
                <th className="p-4">
  Timeline
</th>

                <th className="p-4">
                  Complaint Image
                </th>

                <th className="p-4">
                  Work Note
                </th>

                <th className="p-4">
                  Completed Image
                </th>

              </tr>

            </thead>

            <tbody>

              {complaints.map(
                (complaint) => (

                  <tr
                    key={complaint.id}
                    className="border-b border-slate-800"
                  >

                    <td className="p-4">
                      {complaint.title}
                    </td>

                    <td className="p-4">

                      <span
                        className={`px-4 py-2 rounded-full text-sm ${
                          complaint.status ===
                          "Resolved"
                            ? "bg-green-500"
                            : "bg-yellow-500"
                        }`}
                      >
                        {complaint.status}
                      </span>

                    </td>

                    <td className="p-4">
                      {complaint.priority}
                    </td>

                    <td className="p-4">

                      {complaint.worker
                        ? complaint.worker.name
                        : "Not Assigned"}

                    </td>

                    <td className="p-4">

                      {new Date(
                        complaint.createdAt
                      ).toLocaleDateString()}

                    </td>
<td className="p-4">

  {complaint.timeline ||
    "Created"}

</td>
                    {/* COMPLAINT IMAGE */}

                    <td className="p-4">

                      {complaint.image ? (

                        <img
                          src={`http://localhost:5000/uploads/${complaint.image}`}
                          alt=""
                          className="w-20 h-20 object-cover rounded-lg"
                        />

                      ) : (

                        "No Image"

                      )}

                    </td>

                    {/* WORK NOTE */}

                    <td className="p-4">

                      {complaint.workNote
                        || "Work Not Completed"}

                    </td>

                    {/* COMPLETED IMAGE */}

                    <td className="p-4">

                      {complaint.workImage ? (

                        <img
                          src={`http://localhost:5000/uploads/${complaint.workImage}`}
                          alt=""
                          className="w-20 h-20 rounded-lg object-cover"
                        />

                      ) : (

                        "No Image"

                      )}

                    </td>

                  </tr>

                )
              )}

            </tbody>

          </table>

        </div>

      </div>

    </div>
  );
}

export default UserDashboard;