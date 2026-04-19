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
  const [cgpa, setCgpa] = useState(0);

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

    const fetchCGPA = async () => {
      try {
        const res = await axios.get(`${API}/student/cgpa`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCgpa(res.data.cgpa);
      } catch {}
    };

    fetchProfile();
    fetchTimetable();
    fetchCGPA();
  }, [navigate]);

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

  const total = marks.reduce((sum, m) => sum + (m.score || 0), 0);

  const sgpa = marks.length
    ? (
        marks.reduce((sum, m) => sum + (m.gp || 0), 0) /
        marks.length
      ).toFixed(2)
    : 0;

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar role="student" />

      <div className="flex">

        {/* 🔹 SIDEBAR */}
        <div className="w-64 min-h-screen bg-white shadow-lg p-5">
          <h2 className="text-xl font-bold mb-6 text-center">
            🎓 IILM Portal
          </h2>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => setActiveTab("profile")}
              className={`p-3 rounded ${
                activeTab === "profile"
                  ? "bg-blue-500 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              Profile
            </button>

            <button
              onClick={() => setActiveTab("marks")}
              className={`p-3 rounded ${
                activeTab === "marks"
                  ? "bg-green-500 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              Marksheet
            </button>

            <button
              onClick={() => setActiveTab("timetable")}
              className={`p-3 rounded ${
                activeTab === "timetable"
                  ? "bg-purple-500 text-white"
                  : "hover:bg-gray-100"
              }`}
            >
              Timetable
            </button>
          </div>
        </div>

        {/* 🔹 MAIN CONTENT */}
        <div className="flex-1 p-6">

          {/* 🔥 DASHBOARD CARDS */}
          <div className="grid grid-cols-3 gap-4 mb-6">

            <div className="bg-white shadow rounded p-4 text-center">
              <p className="text-gray-500">CGPA</p>
              <h2 className="text-2xl font-bold">{cgpa}</h2>
            </div>

            <div className="bg-white shadow rounded p-4 text-center">
              <p className="text-gray-500">Subjects</p>
              <h2 className="text-2xl font-bold">{marks.length}</h2>
            </div>

            <div className="bg-white shadow rounded p-4 text-center">
              <p className="text-gray-500">Semester</p>
              <h2 className="text-2xl font-bold">{semester}</h2>
            </div>

          </div>

          {/* PROFILE */}
          {activeTab === "profile" && (
            <div className="bg-white shadow-xl rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">My Profile</h2>
              <p><b>Email:</b> {data.email}</p>
              <p><b>Roll Number:</b> {data.roll_number}</p>
              <p><b>Department:</b> {data.department}</p>
              <p><b>Year:</b> {data.year}</p>
            </div>
          )}

          {/* MARKSHEET */}
          {activeTab === "marks" && (
            <div className="bg-white shadow-2xl rounded-lg p-8 border border-gray-300">

              <h2 className="text-3xl font-bold text-center tracking-wide">
                IILM University
              </h2>

              <p className="text-center text-gray-600 mb-6">
                Semester Marksheet
              </p>

              <div className="mb-4 text-center">
                <select
                  value={semester}
                  onChange={(e) => setSemester(Number(e.target.value))}
                  className="border px-3 py-2 rounded shadow"
                >
                  <option value={1}>Semester 1</option>
                  <option value={2}>Semester 2</option>
                </select>
              </div>

              <div className="mb-4">
                <p><b>Name:</b> {data.roll_number}</p>
                <p><b>Email:</b> {data.email}</p>
              </div>

              <table className="w-full border text-center">
                <thead className="bg-gray-800 text-white">
                  <tr>
                    <th className="p-2">Subject</th>
                    <th className="p-2">Marks</th>
                    <th className="p-2">Grade</th>
                    <th className="p-2">GP</th>
                  </tr>
                </thead>

                <tbody>
                  {marks.map((m, i) => (
                    <tr key={i} className="border-t hover:bg-gray-100 transition">
                      <td className="p-2">{m.subject}</td>
                      <td className="p-2">{m.score}</td>
                      <td className="p-2">{m.grade}</td>
                      <td className="p-2">{m.gp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-6 text-right space-y-2 text-lg">
                <p><b>Total Marks:</b> {total}</p>
                <p><b>SGPA:</b> {sgpa}</p>
                <p><b>CGPA:</b> {cgpa}</p>
              </div>

              {/* PDF BUTTON */}
              <div className="mt-6 flex justify-end">
                <button
                  onClick={async () => {
                    try {
                      const token = localStorage.getItem("token");

                      const res = await fetch(
                        `${API}/student/marksheet/pdf/${semester}?token=${token}`
                      );

                      const blob = await res.blob();

                      const url = window.URL.createObjectURL(blob);
                      const a = document.createElement("a");

                      a.href = url;
                      a.download = `marksheet_sem_${semester}.pdf`;

                      document.body.appendChild(a);
                      a.click();
                      a.remove();
                    } catch (err) {
                      alert("Error downloading PDF");
                    }
                  }}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-2 rounded-lg shadow hover:scale-105 transition"
                >
                  Download Marksheet PDF
                </button>
              </div>

            </div>
          )}

          {/* TIMETABLE */}
          {activeTab === "timetable" && (
            <div className="bg-white shadow-xl rounded-lg p-6">
              <h2 className="text-xl font-semibold mb-4">Weekly Timetable</h2>

              <table className="w-full border text-center">
                <thead>
                  <tr className="bg-purple-200">
                    <th>Day</th>
                    {[1,2,3,4,5,6,7].map((slot) => (
                      <th key={slot}>Slot {slot}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {["Monday","Tuesday","Wednesday","Thursday","Friday"].map((day) => (
                    <tr key={day}>
                      <td className="font-semibold">{day}</td>
                      {[1,2,3,4,5,6,7].map((slot) => {
                        const entry = timetable.find(
                          (t) => t.day === day && t.slot === slot
                        );
                        return <td key={slot}>{entry ? entry.subject : "-"}</td>;
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