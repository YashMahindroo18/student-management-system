import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

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

        {/* SIDEBAR */}
        <div className="w-64 min-h-screen bg-white shadow-lg p-5">
          <h2 className="text-xl font-bold mb-6 text-center">
            🎓 IILM Portal
          </h2>

          <div className="flex flex-col gap-3">
            {["profile", "marks", "timetable"].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`p-3 rounded transition transform hover:scale-105 ${
                  activeTab === tab
                    ? "bg-blue-500 text-white"
                    : "hover:bg-gray-200"
                }`}
              >
                {tab === "profile"
                  ? "Profile"
                  : tab === "marks"
                  ? "Marksheet"
                  : "Timetable"}
              </button>
            ))}
          </div>
        </div>

        {/* MAIN CONTENT */}
        <motion.div
          className="flex-1 p-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >

          {/* DASHBOARD CARDS */}
          <div className="grid grid-cols-3 gap-4 mb-6">

            <div className="bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg rounded-lg p-5 text-center">
              <p>CGPA</p>
              <h2 className="text-2xl font-bold">{cgpa}</h2>
            </div>

            <div className="bg-gradient-to-r from-green-500 to-teal-500 text-white shadow-lg rounded-lg p-5 text-center">
              <p>Subjects</p>
              <h2 className="text-2xl font-bold">{marks.length}</h2>
            </div>

            <div className="bg-gradient-to-r from-pink-500 to-red-500 text-white shadow-lg rounded-lg p-5 text-center">
              <p>Semester</p>
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

          {/* MARKS */}
          {activeTab === "marks" && (
            <div className="bg-white shadow-2xl rounded-lg p-8 border border-gray-300">

              <h2 className="text-3xl font-bold text-center">IILM University</h2>
              <p className="text-center text-gray-600 mb-6">Semester Marksheet</p>

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
                    <tr key={i} className="border-t hover:bg-gray-100">
                      <td>{m.subject}</td>
                      <td>{m.score}</td>
                      <td>{m.grade}</td>
                      <td>{m.gp}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="mt-6 text-right">
                <p>Total: {total}</p>
                <p>SGPA: {sgpa}</p>
                <p>CGPA: {cgpa}</p>
              </div>

              {/* CHART */}
              <div className="mt-8">
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={marks}>
                    <XAxis dataKey="subject" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="score" />
                  </BarChart>
                </ResponsiveContainer>
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

        </motion.div>
      </div>
    </div>
  );
}

export default StudentDashboard;