import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API = process.env.REACT_APP_API_URL;

function StudentDashboard() {
  const [data, setData] = useState(null);
  const [marks, setMarks] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [semester, setSemester] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API}/student/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch {
        navigate("/");
      }
    };

    const fetchTimetable = async () => {
      try {
        const res = await axios.get(`${API}/student/timetable`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTimetable(res.data);
      } catch {}
    };

    fetchProfile();
    fetchTimetable();
  }, [navigate]);

  // 🔥 Fetch marks when semester changes
  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${API}/student/marks/${semester}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setMarks(res.data);
      } catch (err) {
        console.log("Marks error:", err.response);
      }
    };

    fetchMarks();
  }, [semester]);

  if (!data) return <p className="text-center mt-10">Loading...</p>;

  // 🔥 CALCULATIONS
  const total = marks.reduce((sum, m) => sum + m.score, 0);
  const sgpa = marks.length ? (total / (marks.length * 10)).toFixed(2) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <Navbar role="student" />

      <div className="p-6 flex flex-col items-center gap-6">

        {/* 🔹 TAB BUTTONS */}
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 rounded-full ${
              activeTab === "profile"
                ? "bg-blue-400 text-white"
                : "bg-white shadow"
            }`}
          >
            Profile
          </button>

          <button
            onClick={() => setActiveTab("marks")}
            className={`px-4 py-2 rounded-full ${
              activeTab === "marks"
                ? "bg-green-400 text-white"
                : "bg-white shadow"
            }`}
          >
            Marksheet
          </button>

          <button
            onClick={() => setActiveTab("timetable")}
            className={`px-4 py-2 rounded-full ${
              activeTab === "timetable"
                ? "bg-purple-400 text-white"
                : "bg-white shadow"
            }`}
          >
            Timetable
          </button>
        </div>

        <div className="w-full max-w-4xl">

          {/* PROFILE */}
          {activeTab === "profile" && (
            <div className="bg-white/70 shadow-xl rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4">My Profile</h2>

              <p><b>Email:</b> {data.email}</p>
              <p><b>Roll Number:</b> {data.roll_number}</p>
              <p><b>Department:</b> {data.department}</p>
              <p><b>Year:</b> {data.year}</p>
            </div>
          )}

          {/* 🔥 MARKSHEET */}
          {activeTab === "marks" && (
            <div className="bg-white/80 shadow-xl rounded-2xl p-6">

              <h2 className="text-2xl font-bold text-center mb-2">
                IILM University
              </h2>

              <p className="text-center mb-4 text-gray-600">
                Semester Marksheet
              </p>

              {/* Semester Selector */}
              <div className="mb-4 text-center">
                <select
                  value={semester}
                  onChange={(e) => setSemester(Number(e.target.value))}
                  className="border p-2 rounded"
                >
                  <option value={1}>Semester 1</option>
                  <option value={2}>Semester 2</option>
                </select>
              </div>

              {/* Student Info */}
              <div className="mb-4">
                <p><b>Name:</b> {data.roll_number}</p>
                <p><b>Email:</b> {data.email}</p>
              </div>

              {/* Table */}
              <table className="w-full border text-center">
                <thead className="bg-purple-100">
                  <tr>
                    <th>Subject</th>
                    <th>Marks</th>
                  </tr>
                </thead>

                <tbody>
                  {marks.map((m, i) => (
                    <tr key={i}>
                      <td>{m.subject}</td>
                      <td>{m.score}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Result */}
              <div className="mt-4 text-right">
                <p><b>Total:</b> {total}</p>
                <p><b>SGPA:</b> {sgpa}</p>
              </div>
            </div>
          )}

          {/* TIMETABLE */}
          {activeTab === "timetable" && (
            <div className="bg-white/70 shadow-xl rounded-2xl p-6 overflow-x-auto">
              <h2 className="text-xl font-semibold mb-4">Weekly Timetable</h2>

              <table className="w-full border text-center">
                <thead>
                  <tr className="bg-purple-100">
                    <th>Day</th>
                    {[1,2,3,4,5,6,7].map(slot => (
                      <th key={slot}>Slot {slot}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {["Monday","Tuesday","Wednesday","Thursday","Friday"].map(day => (
                    <tr key={day}>
                      <td className="font-semibold bg-purple-50">{day}</td>

                      {[1,2,3,4,5,6,7].map(slot => {
                        const entry = timetable.find(
                          t => t.day === day && t.slot === slot
                        );

                        return (
                          <td key={slot}>
                            {entry ? entry.subject : "-"}
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;