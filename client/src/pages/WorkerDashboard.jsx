import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import API from "../services/api";

function WorkerDashboard() {

  const navigate = useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [complaints, setComplaints] =
    useState([]);

  const [workNotes, setWorkNotes] =
    useState({});

  const [workImages, setWorkImages] =
    useState({});

  const token =
    localStorage.getItem("token");

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };

  // FETCH COMPLAINTS

  const fetchComplaints =
    async () => {

      try {

        const res =
          await API.get(
            "/complaints/worker",
            config
          );

        setComplaints(
          res.data
        );

      } catch (error) {

        console.log(error);
      }
    };

  useEffect(() => {

    fetchComplaints();

  }, []);

  // COMPLETE WORK

  const completeWork =
    async (id) => {

      try {

        const formData =
          new FormData();

        formData.append(
          "workNote",
          workNotes[id] || ""
        );

        if (workImages[id]) {

          formData.append(
            "workImage",
            workImages[id]
          );
        }

        await API.put(
          `/complaints/complete/${id}`,
          formData,
          {
            headers: {
              Authorization:
                `Bearer ${token}`,
              "Content-Type":
                "multipart/form-data",
            },
          }
        );

        alert(
          "Work Completed Successfully"
        );

        fetchComplaints();

      } catch (error) {

        console.log(error);

        alert("Failed To Complete Work");
      }
    };

  // LOGOUT

  const handleLogout = () => {

    localStorage.removeItem("token");

    localStorage.removeItem("user");

    navigate("/login");
  };

  return (

    <div className="min-h-screen bg-slate-950 text-white p-8">

      {/* TOPBAR */}

      <div className="flex justify-between items-center mb-10 bg-slate-900 p-5 rounded-2xl">

        <div>

          <h1 className="text-4xl font-bold">
            Worker Dashboard
          </h1>

          <p className="text-slate-400 mt-2">
            Welcome, {user?.name}
          </p>

        </div>

        <div className="flex gap-4">

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

      {/* COMPLAINTS */}

      <div className="grid grid-cols-1 gap-8">

        {complaints.map(
          (complaint) => (

            <div
              key={complaint.id}
              className="bg-slate-900 p-6 rounded-2xl shadow-xl"
            >

              {/* TITLE */}

              <div className="flex justify-between items-center">

                <h2 className="text-3xl font-bold">
                  {complaint.title}
                </h2>

                <span
  className={`px-4 py-2 rounded-full ${
    complaint.status === "Resolved"
      ? "bg-green-500"
      : complaint.status === "Rejected"
      ? "bg-red-500"
      : complaint.status === "Work Submitted"
      ? "bg-purple-500"
      : complaint.status === "In Progress"
      ? "bg-blue-500"
      : "bg-yellow-500"
  }`}
>
                  {complaint.status}
                </span>

              </div>

              {/* DESCRIPTION */}

              <p className="mt-5 text-slate-300 text-lg">

                {complaint.description}

              </p>
              {complaint.status === "Rejected" && (

  <div className="mt-5 bg-red-900 p-4 rounded-xl">

    <h3 className="font-bold text-red-300">
      Rejected By Admin
    </h3>

    <p className="mt-2">
      {complaint.rejectionReason}
    </p>

  </div>

)}

              {/* PRIORITY */}

              <p className="mt-4">

                Priority:

                <span className="ml-2 text-red-400 font-bold">

                  {complaint.priority}

                </span>

              </p>

              {/* ORIGINAL IMAGE */}

              {complaint.image && (

                <div className="mt-5">

                  <p className="mb-2 text-slate-400">
                    Complaint Image
                  </p>

                  <img
                    src={`http://localhost:5000/uploads/${complaint.image}`}
                    alt=""
                    className="w-52 h-52 object-cover rounded-2xl"
                  />

                </div>

              )}

              {/* WORK NOTE */}

              <textarea
                placeholder="Enter work completion note..."
                value={
                  workNotes[complaint.id] || ""
                }
                onChange={(e) =>
                  setWorkNotes({
                    ...workNotes,
                    [complaint.id]:
                      e.target.value,
                  })
                }
                className="w-full mt-6 p-4 rounded-2xl bg-slate-800 outline-none"
                rows="4"
              />
              {complaint.workImage && (

  <div className="mt-5">

    <p className="mb-2 text-slate-400">
      Submitted Work Image
    </p>

    <img
      src={`http://localhost:5000/uploads/${complaint.workImage}`}
      alt=""
      className="w-52 h-52 object-cover rounded-2xl"
    />

  </div>

)}

              {/* WORK IMAGE */}

              <div className="mt-5">

                <p className="mb-2 text-slate-400">
                  Upload Completion Image
                </p>

                <input
                  type="file"
                  onChange={(e) =>
                    setWorkImages({
                      ...workImages,
                      [complaint.id]:
                        e.target.files[0],
                    })
                  }
                  className="bg-slate-800 p-3 rounded-xl"
                />


              </div>

              {/* COMPLETE BUTTON */}

            <button
  disabled={
    complaint.status ===
    "Resolved"
  }
  onClick={() =>
    completeWork(
      complaint.id
    )
  }
  className={`mt-5 px-6 py-3 rounded-xl ${
    complaint.status ===
    "Resolved"
      ? "bg-gray-500 cursor-not-allowed"
      : complaint.status ===
        "Rejected"
      ? "bg-red-500 hover:bg-red-600"
      : "bg-green-500 hover:bg-green-600"
  }`}
>

  {complaint.status ===
  "Resolved"
    ? "Resolved"
    : complaint.status ===
      "Rejected"
    ? "Re-Submit Work"
    : complaint.status ===
      "Work Submitted"
    ? "Update Submission"
    : "Complete Work"}

</button>

            </div>

          )
        )}

      </div>

    </div>
  );
}

export default WorkerDashboard;