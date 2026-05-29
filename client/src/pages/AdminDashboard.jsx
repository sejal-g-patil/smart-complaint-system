import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

import ComplaintMap from "../components/ComplaintMap";

import {
  useNavigate,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import API from "../services/api";

function AdminDashboard({
  darkMode,
  setDarkMode,
}) {

  const navigate =
    useNavigate();

  const user = JSON.parse(
    localStorage.getItem("user")
  );

  const [
    notification,
    setNotification,
  ] = useState("");

  const [
    workers,
    setWorkers,
  ] = useState([]);

  const [
    complaints,
    setComplaints,
  ] = useState([]);

  const [
    search,
    setSearch,
  ] = useState("");

  const [
    filterStatus,
    setFilterStatus,
  ] = useState("All");

  const token =
    localStorage.getItem(
      "token"
    );

  const config = {
    headers: {
      Authorization:
        `Bearer ${token}`,
    },
  };

  // FETCH WORKERS

  const fetchWorkers =
    async () => {

      try {

        const res =
          await API.get(
            "/auth/workers",
            config
          );

        setWorkers(
          res.data
        );

      } catch (error) {

        console.log(error);
      }
    };

  // FETCH COMPLAINTS

  const fetchComplaints =
    async () => {

      try {

        const res =
          await API.get(
            "/complaints/all",
            config
          );

        setComplaints(
          res.data
        );

      } catch (error) {

        console.log(error);
      }
    };

  // ASSIGN WORKER

  const assignWorker =
    async (
      complaintId,
      workerId
    ) => {

      try {

        await API.put(
          `/complaints/assign/${complaintId}`,
          { workerId },
          config
        );

        setNotification(
          "Worker Assigned Successfully"
        );

        setTimeout(() => {

          setNotification("");

        }, 3000);

        fetchComplaints();

      } catch (error) {

        console.log(error);
      }
    };

  // UPDATE STATUS

  const updateStatus =
    async (
      id,
      status
    ) => {

      try {

        await API.put(
          `/complaints/update/${id}`,
          { status },
          config
        );

        setNotification(
          "Complaint Status Updated"
        );

        setTimeout(() => {

          setNotification("");

        }, 3000);

        fetchComplaints();

      } catch (error) {

        console.log(error);
      }
    };

  // LOAD DATA

  useEffect(() => {

    fetchComplaints();
    fetchWorkers();

  }, []);

  // COUNTS

  const totalComplaints =
    complaints.length;

  const resolvedComplaints =
    complaints.filter(
      (c) =>
        c.status ===
        "Resolved"
    ).length;

 const pendingComplaints =
  complaints.filter(
    (c) =>
      c.status === "Pending"
  ).length;

const inProgressComplaints =
  complaints.filter(
    (c) =>
      c.status === "In Progress"
  ).length;

  // FILTER

  const filteredComplaints =
    complaints.filter(
      (complaint) => {

        const matchesSearch =
          complaint.title
            .toLowerCase()
            .includes(
              search.toLowerCase()
            );

        const matchesStatus =
          filterStatus ===
          "All"
            ? true
            : complaint.status ===
              filterStatus;

        return (
          matchesSearch &&
          matchesStatus
        );
      }
    );

  // CHART DATA

 const chartData = [
  {
    name: "Resolved",
    value:
      resolvedComplaints,
  },
  {
    name: "Pending",
    value:
      pendingComplaints,
  },
];

  // LOGOUT

  const handleLogout =
    () => {

      localStorage.removeItem(
        "token"
      );

      localStorage.removeItem(
        "user"
      );

      navigate("/login");
    };

  // EXPORT PDF

  const exportPDF =
    () => {

      const doc =
        new jsPDF();

      doc.setFontSize(20);

      doc.text(
        "Smart Complaint Report",
        14,
        20
      );

      autoTable(doc, {

        startY: 30,

        head: [[
          "Title",
          "Status",
          "Priority",
          "Date",
        ]],

        body:
          complaints.map(
            (
              complaint
            ) => [

              complaint.title,

              complaint.status,

              complaint.priority,

              new Date(
                complaint.createdAt
              ).toLocaleDateString(),
            ]
          ),
      });

      doc.save(
        "complaint-report.pdf"
      );
    };

  return (

    <div
      className={`min-h-screen p-8 ${
        darkMode
          ? "bg-slate-950 text-white"
          : "bg-slate-100 text-black"
      }`}
    >

      {/* NAVBAR */}

      <div className="flex justify-between items-center bg-slate-900 p-5 rounded-2xl mb-10">

        <div>

          <h1 className="text-3xl font-bold text-cyan-400">
            Smart Complaint
          </h1>

          <p className="text-slate-400 mt-1">
            Admin Control Panel
          </p>

        </div>

        <div className="flex gap-4 items-center">

          <button
            onClick={() =>
              navigate(
                "/profile"
              )
            }
            className="bg-slate-800 hover:bg-slate-700 px-5 py-3 rounded-xl"
          >
            Profile
          </button>

          <button
            onClick={() =>
              setDarkMode(
                !darkMode
              )
            }
            className="bg-cyan-500 hover:bg-cyan-600 px-5 py-3 rounded-xl"
          >
            {darkMode
              ? "Light Mode"
              : "Dark Mode"}
          </button>

          <button
            onClick={
              exportPDF
            }
            className="bg-green-500 hover:bg-green-600 px-5 py-3 rounded-xl"
          >
            Export PDF
          </button>

          <button
            onClick={
              handleLogout
            }
            className="bg-red-500 hover:bg-red-600 px-5 py-3 rounded-xl"
          >
            Logout
          </button>

        </div>

      </div>

      {/* HEADER */}

      <div className="mb-10">

        <h1 className="text-4xl font-bold">
          Dashboard
        </h1>

        <p className="text-slate-400 mt-2">
          Welcome back,
          {" "}
          {user?.name}
        </p>

      </div>

      {/* NOTIFICATION */}

      {notification && (

        <div className="bg-green-500 text-white p-4 rounded-xl mb-6 shadow-xl">

          {notification}

        </div>

      )}

      {/* SEARCH + FILTER */}

      <div className="mt-10 flex flex-col md:flex-row gap-4">

        <input
          type="text"
          placeholder="Search complaints..."
          value={search}
          onChange={(e) =>
            setSearch(
              e.target.value
            )
          }
          className="flex-1 p-4 rounded-xl bg-slate-900 outline-none"
        />

        <select
          value={
            filterStatus
          }
          onChange={(e) =>
            setFilterStatus(
              e.target.value
            )
          }
          className="p-4 rounded-xl bg-slate-900 outline-none"
        >

          <option value="All">
            All
          </option>

          <option value="Pending">
            Pending
          </option>

          <option value="In Progress">
            In Progress
          </option>

          <option value="Resolved">
            Resolved
          </option>

        </select>

      </div>

      {/* ANALYTICS */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">

        <div className="bg-slate-900 p-6 rounded-2xl">

          <p className="text-slate-400">
            Total Complaints
          </p>

          <h1 className="text-4xl font-bold mt-3">
            {
              totalComplaints
            }
          </h1>

        </div>

        <div className="bg-slate-900 p-6 rounded-2xl">

          <p className="text-slate-400">
            Resolved
          </p>

          <h1 className="text-4xl font-bold mt-3 text-green-400">
            {
              resolvedComplaints
            }
          </h1>

        </div>

        <div className="bg-slate-900 p-6 rounded-2xl">

          <p className="text-slate-400">
            Pending
          </p>

          <h1 className="text-4xl font-bold mt-3 text-yellow-400">
            {
              pendingComplaints
            }
          </h1>

        </div>

        <div className="bg-slate-900 p-6 rounded-2xl">

          <p className="text-slate-400">
            Workers
          </p>

          <h1 className="text-4xl font-bold mt-3 text-cyan-400">
            {
              workers.length
            }
          </h1>

        </div>

      </div>

      {/* CHART + MAP */}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-10">

        <div className="bg-slate-900 p-6 rounded-2xl">

          <h2 className="text-2xl font-bold mb-5">
            Complaint Analytics
          </h2>

          <div className="h-80">

            <ResponsiveContainer>

              <PieChart>

                <Pie
                  data={
                    chartData
                  }
                  dataKey="value"
                  outerRadius={
                    120
                  }
                  label
                >

                 <Cell fill="#22c55e" />

<Cell fill="#eab308" />

<Cell fill="#3b82f6" />

                </Pie>

                <Tooltip />

              </PieChart>

            </ResponsiveContainer>

          </div>

        </div>

        <div className="bg-slate-900 p-6 rounded-2xl">

          <h2 className="text-2xl font-bold mb-5">
            Complaint Locations
          </h2>

          <ComplaintMap
            complaints={
              complaints
            }
          />

        </div>

      </div>

      {/* TABLE */}

      <div className="bg-slate-900 p-6 rounded-2xl mt-10 overflow-auto">

        <h2 className="text-2xl font-bold mb-6">
          Complaints List
        </h2>

        <table className="w-full">

          <thead>

            <tr className="border-b border-slate-700 text-left">

              <th className="p-4">
                Title
              </th>

              <th className="p-4">
                Image
              </th>

              <th className="p-4">
                Status
              </th>

              <th className="p-4">
                Priority
              </th>

              <th className="p-4">
                Assign Worker
              </th>

              <th className="p-4">
                Work Note
              </th>

              <th className="p-4">
                Work Image
              </th>

              <th className="p-4">
                Action
              </th>

            </tr>

          </thead>

          <tbody>

            {filteredComplaints.map(
              (
                complaint
              ) => (

                <tr
                  key={
                    complaint.id
                  }
                  className="border-b border-slate-800"
                >

                  <td className="p-4">
                    {
                      complaint.title
                    }
                  </td>

                  <td className="p-4">

                    {complaint.image ? (

                      <img
                        src={`http://localhost:5000/uploads/${complaint.image}`}
                        alt=""
                        className="w-20 h-20 rounded-lg object-cover"
                      />

                    ) : (
                      "No Image"
                    )}

                  </td>

                  <td className="p-4">

                    <span
                      className={`px-4 py-2 rounded-full text-sm ${
                        complaint.status ===
                        "Resolved"
                          ? "bg-green-500"
                          : complaint.status ===
                            "In Progress"
                          ? "bg-blue-500"
                          : "bg-yellow-500"
                      }`}
                    >
                      {
                        complaint.status
                      }
                    </span>

                  </td>

                  <td className="p-4">
                    {
                      complaint.priority
                    }
                  </td>

                  <td className="p-4">

                    <select
                      disabled={
                        complaint.status ===
                        "Resolved"
                      }
                      onChange={(e) =>
                        assignWorker(
                          complaint.id,
                          e.target.value
                        )
                      }
                      className="bg-slate-800 p-2 rounded-lg"
                    >
<option value="">
  {complaint.worker?.name ||
    "Select"}
</option>

                      {workers.map(
                        (
                          worker
                        ) => (

                          <option
                            key={
                              worker.id
                            }
                            value={
                              worker.id
                            }
                          >
                            {
                              worker.name
                            }
                          </option>

                        )
                      )}

                    </select>

                  </td>

                  <td className="p-4">
                    {complaint.workNote ||
                      "Pending"}
                  </td>

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

                  <td className="p-4 flex gap-2">

                    <button
                      disabled={
                        complaint.status ===
                        "Resolved"
                      }
                      onClick={() =>
                        updateStatus(
                          complaint.id,
                          "In Progress"
                        )
                      }
                      className={`px-4 py-2 rounded-lg ${
                        complaint.status ===
                        "Resolved"
                          ? "bg-gray-500 cursor-not-allowed"
                          : "bg-blue-500 hover:bg-blue-600"
                      }`}
                    >
                      Start
                    </button>

                    <button
                      disabled={
                        complaint.status ===
                        "Resolved"
                      }
                      onClick={() =>
                        updateStatus(
                          complaint.id,
                          "Resolved"
                        )
                      }
                      className={`px-4 py-2 rounded-lg ${
                        complaint.status ===
                        "Resolved"
                          ? "bg-gray-500 cursor-not-allowed"
                          : "bg-green-500 hover:bg-green-600"
                      }`}
                    >
                      {complaint.status ===
                      "Resolved"
                        ? "Resolved"
                        : "Resolve"}
                    </button>

                  </td>

                </tr>

              )
            )}

          </tbody>

        </table>

      </div>

    </div>
  );
}

export default AdminDashboard;